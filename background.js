const LIERKOUR_API_BASE = 'http://127.0.0.1:8765';
const LIERTAGS_API_BASE = 'http://127.0.0.1:8766';

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
  const timeout = setTimeout(() => controller.abort(), 2500);

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
      return { online: false, authorized: false, app: 'Lierkour' };
    }

    const body = await response.json().catch(() => ({}));
    return {
      online: true,
      authorized: Boolean(body?.authorized),
      app: 'Lierkour',
    };
  } catch {
    return { online: false, authorized: false, app: 'Lierkour' };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkLierTagsHealth() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${LIERTAGS_API_BASE}/api/status`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      return { online: false, authorized: true, app: 'LierTags' };
    }

    const body = await response.json().catch(() => ({}));
    return {
      online: true,
      authorized: true,
      app: 'LierTags',
      version: body?.version || '0.1.0',
    };
  } catch {
    return { online: false, authorized: true, app: 'LierTags' };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkServerHealth(target, token) {
  const normalizedTarget = String(target || '').toLowerCase();
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

  // If target not specified, check Lierkour first, then LierTags
  const lierkourStatus = await checkLierkourHealth(token);
  if (lierkourStatus.online) return lierkourStatus;

  const lierTagsStatus = await checkLierTagsHealth();
  if (lierTagsStatus.online) return lierTagsStatus;

  return { online: false, authorized: false };
}

async function sendToApp(payload, token) {
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
    const offlineMsg = isTrack
      ? msg(
          'LierTags не запущен (порт 8766). Запустите LierTags или используйте Copy / Save JSON.',
          'LierTags is not running (port 8766). Start LierTags or use Copy / Save JSON.'
        )
      : msg(
          'Lierkour не запущен (порт 8765). Запустите Lierkour для импорта или используйте Copy / Save JSON.',
          'Lierkour is not running (port 8765). Start Lierkour to import, or use Copy / Save JSON.'
        );

    return {
      ok: false,
      kind: 'offline',
      app: targetApp,
      error: offlineMsg,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// Backward compatibility alias
const importToLierkour = (payload, token) => sendToApp(payload, token);

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

  if (message.type === 'IMPORT_MEDIA' || message.type === 'SEND_TO_APP') {
    sendToApp(message.payload, message.token || '').then(sendResponse);
    return true;
  }

  return false;
});
