const LIERKOUR_API_BASE = 'http://127.0.0.1:8765';
const LIERTAGS_API_BASE = 'http://127.0.0.1:8766';
const LIERSYNC_API_BASE = 'http://127.0.0.1:8768';
const OFFLINE_QUEUE_KEY = 'lierex_offline_queue';
const TOKEN_STORAGE_KEY = 'lierex_token';

function msg(ruText, enText) {
  const lang = (
    (typeof chrome !== 'undefined' && chrome?.i18n?.getUILanguage
      ? chrome.i18n.getUILanguage()
      : 'ru') || 'ru'
  ).toLowerCase();
  return lang.startsWith('ru') ? ruText : enText;
}

async function checkLierkourHealth(token) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);

  try {
    const headers = {};
    if (token) {
      headers['X-LierEX-Token'] = token;
    }
    const response = await fetch(`${LIERKOUR_API_BASE}/api/health`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      return { online: false, authorized: false, app: 'Lierkour', port: 8765 };
    }

    const body = await response.json().catch(() => ({}));
    return {
      online: true,
      authorized: Boolean(body?.authorized),
      app: 'Lierkour',
      version: body?.version || '2.3.0',
      port: 8765,
    };
  } catch {
    return { online: false, authorized: false, app: 'Lierkour', port: 8765 };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkLierTagsHealth() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);

  try {
    const response = await fetch(`${LIERTAGS_API_BASE}/api/status`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      return { online: false, authorized: true, app: 'LierTags', port: 8766 };
    }

    const body = await response.json().catch(() => ({}));
    return {
      online: true,
      authorized: true,
      app: 'LierTags',
      version: body?.version || '1.1.0',
      port: 8766,
    };
  } catch {
    return { online: false, authorized: true, app: 'LierTags', port: 8766 };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkLierSyncHealth() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);

  try {
    const response = await fetch(`${LIERSYNC_API_BASE}/api/lier/info`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      return { online: false, authorized: true, app: 'LierSync', port: 8768 };
    }

    const body = await response.json().catch(() => ({}));
    return {
      online: true,
      authorized: true,
      app: 'LierSync',
      version: body?.version || '1.2.0',
      peers: Array.isArray(body?.peers) ? body.peers.length : 0,
      port: 8768,
    };
  } catch {
    return { online: false, authorized: true, app: 'LierSync', port: 8768 };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkEcosystem(token) {
  const [lierkour, liertags, liersync] = await Promise.all([
    checkLierkourHealth(token),
    checkLierTagsHealth(),
    checkLierSyncHealth(),
  ]);
  return { lierkour, liertags, liersync };
}

async function checkServerHealth(target, token) {
  const normalizedTarget = String(target || '').toLowerCase();
  if (normalizedTarget === 'liersync' || normalizedTarget === 'sync') {
    return checkLierSyncHealth();
  }
  if (normalizedTarget === 'liertags' || normalizedTarget === 'track') {
    return checkLierTagsHealth();
  }
  if (
    normalizedTarget === 'lierkour' ||
    normalizedTarget === 'movie' ||
    normalizedTarget === 'game'
  ) {
    return checkLierkourHealth(token);
  }

  const lierkourStatus = await checkLierkourHealth(token);
  if (lierkourStatus.online) return lierkourStatus;

  const lierTagsStatus = await checkLierTagsHealth();
  if (lierTagsStatus.online) return lierTagsStatus;

  return { online: false, authorized: false };
}

async function getOfflineQueue() {
  try {
    const res = await chrome.storage.local.get(OFFLINE_QUEUE_KEY);
    const list = res?.[OFFLINE_QUEUE_KEY];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function setOfflineQueue(items) {
  try {
    await chrome.storage.local.set({ [OFFLINE_QUEUE_KEY]: items.slice(0, 50) });
  } catch {
    // ignore storage errors
  }
}

async function enqueueOffline(kind, data) {
  const queue = await getOfflineQueue();
  queue.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    kind,
    data,
    createdAt: new Date().toISOString(),
  });
  await setOfflineQueue(queue);
  return queue.length;
}

async function blobToPngBase64(blob) {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const isPng =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;

  let pngBytes = bytes;
  if (!isPng && typeof createImageBitmap === 'function' && typeof OffscreenCanvas === 'function') {
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    const outBlob = await canvas.convertToBlob({ type: 'image/png' });
    pngBytes = new Uint8Array(await outBlob.arrayBuffer());
  }

  let binary = '';
  const step = 0x8000;
  for (let i = 0; i < pngBytes.length; i += step) {
    binary += String.fromCharCode(...pngBytes.subarray(i, i + step));
  }
  return btoa(binary);
}

async function sendToLierSync(item, allowQueue = true) {
  const payload = {
    source: 'LierEX-Q',
  };
  if (item.text) payload.text = String(item.text);
  if (item.url) payload.url = String(item.url);

  if (item.image_base64) {
    payload.image_base64 = item.image_base64;
  } else if (item.imageUrl) {
    try {
      const imgResp = await fetch(item.imageUrl);
      if (!imgResp.ok) {
        return {
          ok: false,
          error: msg('Не удалось скачать изображение', 'Failed to fetch image'),
        };
      }
      const blob = await imgResp.blob();
      payload.image_base64 = await blobToPngBase64(blob);
    } catch (e) {
      return {
        ok: false,
        error: msg(`Ошибка загрузки картинки: ${e?.message || e}`, `Image load failed: ${e?.message || e}`),
      };
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${LIERSYNC_API_BASE}/api/ecosystem/clipboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body?.success !== true) {
      return {
        ok: false,
        kind: 'server',
        error: body?.error || `LierSync HTTP ${response.status}`,
      };
    }
    return { ok: true, result: body };
  } catch {
    if (allowQueue) {
      const qCount = await enqueueOffline('liersync', payload);
      return {
        ok: false,
        kind: 'offline',
        queued: true,
        queueCount: qCount,
        error: msg(
          `LierSync не запущен (:8768) — сохранено в очередь (${qCount}).`,
          `LierSync offline (:8768) — saved to offline queue (${qCount}).`
        ),
      };
    }
    return {
      ok: false,
      kind: 'offline',
      error: msg('LierSync недоступен (:8768)', 'LierSync is offline (:8768)'),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function sendToApp(payload, token, allowQueue = true) {
  if (!payload || typeof payload !== 'object') {
    return {
      ok: false,
      kind: 'validation',
      error: msg('Пустые данные для отправки', 'Empty data to send'),
    };
  }

  const isTrack = payload.type === 'track';
  const targetApp = isTrack ? 'LierTags' : 'Lierkour';
  const apiBase = isTrack ? LIERTAGS_API_BASE : LIERKOUR_API_BASE;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (!isTrack && token) {
      headers['X-LierEX-Token'] = token;
    }

    const response = await fetch(`${apiBase}/api/import`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (response.status === 200) {
      const body = await response.json().catch(() => ({}));
      return { ok: true, app: targetApp, result: body };
    }

    const errBody = await response.json().catch(() => ({}));
    const serverMsg =
      errBody?.error ||
      msg(
        `Ошибка сервера ${targetApp} (${response.status})`,
        `${targetApp} server error (${response.status})`
      );

    if (response.status === 401 && !isTrack) {
      return {
        ok: false,
        kind: 'unauthorized',
        app: targetApp,
        error: msg(
          'Неверный или пустой токен. Скопируйте токен из Настроек Lierkour.',
          'Invalid or missing token. Copy X-LierEX-Token from Lierkour Settings.'
        ),
      };
    }

    return {
      ok: false,
      kind: 'server',
      app: targetApp,
      error: serverMsg,
    };
  } catch {
    let queueCount = 0;
    if (allowQueue) {
      queueCount = await enqueueOffline('media', payload);
    }
    const offlineMsg = isTrack
      ? msg(
          `LierTags не запущен (:8766) — добавлено в очередь (${queueCount}).`,
          `LierTags offline (:8766) — queued (${queueCount}).`
        )
      : msg(
          `Lierkour не запущен (:8765) — добавлено в очередь (${queueCount}).`,
          `Lierkour offline (:8765) — queued (${queueCount}).`
        );

    return {
      ok: false,
      kind: 'offline',
      queued: allowQueue,
      queueCount,
      app: targetApp,
      error: offlineMsg,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function flushOfflineQueue(passedToken) {
  let token = passedToken || '';
  if (!token) {
    try {
      const stored = await chrome.storage.local.get(TOKEN_STORAGE_KEY);
      token = String(stored?.[TOKEN_STORAGE_KEY] || '').trim();
    } catch {
      token = '';
    }
  }

  const queue = await getOfflineQueue();
  if (queue.length === 0) {
    return { sent: 0, remaining: 0 };
  }

  const remaining = [];
  let sent = 0;
  for (const item of queue) {
    const res =
      item.kind === 'liersync'
        ? await sendToLierSync(item.data, false)
        : await sendToApp(item.data, token, false);
    if (res?.ok) {
      sent += 1;
    } else {
      remaining.push(item);
    }
  }
  await setOfflineQueue(remaining);
  return { sent, remaining: remaining.length };
}

function registerContextMenus() {
  if (!chrome?.contextMenus) return;
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'liersync_send_selection',
      title: msg('Отправить текст в LierSync', 'Send selection to LierSync'),
      contexts: ['selection'],
    });
    chrome.contextMenus.create({
      id: 'liersync_send_link',
      title: msg('Отправить ссылку в LierSync', 'Send link to LierSync'),
      contexts: ['link'],
    });
    chrome.contextMenus.create({
      id: 'liersync_send_image',
      title: msg('Отправить картинку в буфер LierSync', 'Send image to LierSync clipboard'),
      contexts: ['image'],
    });
    chrome.contextMenus.create({
      id: 'liersync_send_page',
      title: msg('Отправить страницу в LierSync', 'Send page URL to LierSync'),
      contexts: ['page'],
    });
  });
}

if (chrome?.runtime?.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    registerContextMenus();
  });
}

if (chrome?.contextMenus?.onClicked) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'liersync_send_selection' && info.selectionText) {
      sendToLierSync({ text: info.selectionText }, true);
    } else if (info.menuItemId === 'liersync_send_link' && info.linkUrl) {
      sendToLierSync({ url: info.linkUrl }, true);
    } else if (info.menuItemId === 'liersync_send_image' && info.srcUrl) {
      sendToLierSync({ imageUrl: info.srcUrl }, true);
    } else if (info.menuItemId === 'liersync_send_page' && (info.pageUrl || tab?.url)) {
      sendToLierSync({ url: info.pageUrl || tab.url }, true);
    }
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== 'string') {
    return false;
  }

  if (message.type === 'CHECK_SERVER') {
    checkServerHealth(message.target || message.mediaType, message.token || '').then(
      sendResponse
    );
    return true;
  }

  if (message.type === 'CHECK_ECOSYSTEM') {
    checkEcosystem(message.token || '').then(sendResponse);
    return true;
  }

  if (message.type === 'IMPORT_MEDIA' || message.type === 'SEND_TO_APP') {
    sendToApp(message.payload, message.token || '', message.allowQueue !== false).then(
      sendResponse
    );
    return true;
  }

  if (message.type === 'SEND_TO_LIERSYNC') {
    sendToLierSync(message.payload || {}, message.allowQueue !== false).then(sendResponse);
    return true;
  }

  if (message.type === 'GET_QUEUE') {
    getOfflineQueue().then((items) => sendResponse({ count: items.length, items }));
    return true;
  }

  if (message.type === 'FLUSH_QUEUE') {
    flushOfflineQueue(message.token || '').then(sendResponse);
    return true;
  }

  if (message.type === 'CLEAR_QUEUE') {
    setOfflineQueue([]).then(() => sendResponse({ cleared: true }));
    return true;
  }

  return false;
});
