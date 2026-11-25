<div align="center">
  <img src="icons/icon128.png" width="96" height="96" alt="LierEX-Q Logo" />
  <h1>🌐 LierEX-Q v1.4 — Экстрактор Медиа и Хаб Экосистемы LIER</h1>
  <p><strong>Браузерное расширение для извлечения карточек фильмов, сериалов, видеоигр и музыки в JSON, LierTags, Lierkour или LierSync</strong></p>

  <p>
    <a href="README.md"><img src="https://img.shields.io/badge/Язык-Русский-8B0000?style=flat-square" alt="Русский" /></a>
    <a href="README_EN.md"><img src="https://img.shields.io/badge/Language-English-39C5BB?style=flat-square" alt="English" /></a>
    <a href="https://github.com/LaRCorp/LierEX-Q/releases"><img src="https://img.shields.io/badge/version-1.4.0-6366f1?style=flat-square" alt="Version 1.4.0" /></a>
    <img src="https://img.shields.io/badge/Manifest-V3-0ea5e9?style=flat-square" alt="Manifest V3" />
    <img src="https://img.shields.io/badge/Vanilla_JS-Zero_Build-f59e0b?style=flat-square" alt="Vanilla JS" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-GPLv3-10b981?style=flat-square" alt="GPLv3 License" /></a>
    <a href="https://github.com/LaRCorp/LierTags"><img src="https://img.shields.io/badge/Companion-LierTags_v1.1%2B-ec4899?style=flat-square" alt="LierTags v1.1+" /></a>
    <a href="https://github.com/LaRCorp/Lierkour"><img src="https://img.shields.io/badge/Companion-Lierkour_v2.3%2B-8b5cf6?style=flat-square" alt="Lierkour v2.3+" /></a>
    <a href="https://github.com/LaRCorp/LierSync"><img src="https://img.shields.io/badge/Companion-LierSync_v1.2%2B-39C5BB?style=flat-square" alt="LierSync v1.2+" /></a>
  </p>
</div>

**LierEX-Q** — лёгкое браузерное расширение (Manifest V3) без сборщиков и внешних зависимостей:
- **Фильмы и игры** (`movie`, `game`) → экспорт в JSON или прямая отправка в **Lierkour** (порт `8765`).
- **Музыкальные треки и релизы** (`track`) → экспорт в JSON или прямая отправка в **LierTags** (порт `8766`).
- **Ссылки, текст и картинки с любого сайта** → отправка на ПК/Android через **LierSync** (порт `8768`) через popup или контекстное меню браузера, плюс оффлайн-очередь при закрытых приложениях.

---

## Поддерживаемые площадки (13 сервисов)

### 🎵 Музыкальные сервисы (`type: "track"`)

| Площадка | Домен | Приёмник | Что извлекается |
| --- | --- | --- | --- |
| **MusicBrainz** | `musicbrainz.org` | `LierTags` (порт 8766) | Название трека/релиза, исполнитель, альбом, год, теги/жанры, обложка (Cover Art Archive) |
| **Discogs** | `discogs.com` | `LierTags` (порт 8766) | Название, исполнитель, альбом, год релиза, стили/жанры, обложка из галереи/мета |
| **Last.fm** | `last.fm` | `LierTags` (порт 8766) | Название, исполнитель, альбом, год, жанровые теги, качественный арт исполнителя/альбома |
| **Bandcamp** | `bandcamp.com` | `LierTags` (порт 8766) | Название трека, исполнитель, альбом, год релиза, теги, качественный popup-арт обложки |
| **Яндекс.Музыка** | `music.yandex.ru` / `.com` | `LierTags` (порт 8766) | Название трека/альбома, исполнители, альбом, год выпуска, жанры, HD-обложка |

### 🎬 Кино, сериалы и аниме (`type: "movie"`)

| Площадка | Домен | Приёмник | Что извлекается |
| --- | --- | --- | --- |
| **Кинопоиск** | `kinopoisk.ru` | `Lierkour` (порт 8765) | Название, оригинальное название, год, режиссёр, жанры, страна, длительность, число сезонов, постер, описание |
| **IMDb** | `imdb.com` | `Lierkour` (порт 8765) | Название, IMDb ID (`tt...`), год, режиссёр, жанры, страна, длительность, сезоны, постер, описание |
| **TMDb** | `themoviedb.org` | `Lierkour` (порт 8765) | Фильмы (`/movie/`) и сериалы (`/tv/`), оригинальное название, режиссёр/создатель, жанры, длительность (`169m`), сезоны, постер |
| **Letterboxd** | `letterboxd.com` | `Lierkour` (порт 8765) | Название, оригинальное название, год, режиссёр, жанры, страна, длительность, ссылка на IMDb ID, постер |

### 🎮 Видеоигры (`type: "game"`)

| Площадка | Домен | Лаунчер в Lierkour | Что извлекается |
| --- | --- | --- | --- |
| **Steam** | `store.steampowered.com` | `Steam` | Название, разработчик/издатель, жанры и теги, год, описание, вертикальный постер (`600x900` или авто-рамка на стороне Lierkour) |
| **Epic Games Store** | `epicgames.com` | `Epic Games` | Название, разработчик/издатель, жанры, год, описание, приоритет вертикальных обложек |
| **GOG** | `gog.com` | `GOG` | Название, компания, жанры/теги, дата релиза, описание, обложка игры |
| **Itch.io** | `itch.io` | `Itch.io` | Название, автор, жанр/теги, дата выхода, описание, обложка (профили авторов корректно отсеиваются) |

---

## Основные возможности

- **Автономный экспорт JSON (без установки Lierkour):** кнопки **Копировать JSON** (`Copy JSON`) и **Скачать `.json`** (`Save .json`) сразу сохраняют готовую структурированную карточку с выбранным статусом.
- **Прямой импорт в Lierkour:**
  - Фильмы / сериалы / аниме: `В планах`, `Смотрю`, `Просмотрено`, `Брошено`.
  - Игры: `В планах`, `Играю`, `Пройдена`, `Брошена`.
- **Обработка игровых обложек:** передача массива кандидатов постера в Lierkour, где горизонтальные баннеры игр (Steam / Epic / Itch / GOG) аккуратно оформляются под единый вертикальный формат `600×900`.
- **Автолокализация интерфейса (RU / EN):** язык popup-окна и системных сообщений подстраивается под язык браузера (`_locales/en` и `_locales/ru`).
- **Минимальные разрешения и приватность (см. [PRIVACY.md](PRIVACY.md)):**
  - Только `activeTab`, `scripting`, `storage` — **никаких постоянных разрешений для сторонних сайтов и `<all_urls>`**.
  - Единственный host-доступ — локальный `http://127.0.0.1:8765/*` с авторизацией токеном `X-LierEX-Token`.
  - Парсинг запускается исключительно при нажатии пользователя на иконку расширения; без телеметрии и удалённого кода.

---

## Установка с GitHub (Opera / Opera GX / Edge / Chrome / Яндекс / Brave)

1. Скачайте архив из **[Releases LierEX-Q](https://github.com/LaRCorp/LierEX-Q/releases)** (или `Code → Download ZIP`) и распакуйте его в постоянную папку (внутри должен лежать `manifest.json`).
2. Откройте страницу расширений в браузере:
   - Opera / Opera GX: `opera://extensions/`
   - Microsoft Edge: `edge://extensions/`
   - Google Chrome: `chrome://extensions/`
   - Яндекс.Браузер: `browser://extensions/`
3. Включите **Режим разработчика** (Developer mode).
4. Нажмите **Загрузить распакованное расширение** (Load unpacked) и выберите папку с `manifest.json`.
5. Закрепите иконку **LierEX-Q** на панели браузера.

---

## Интеграция с настольными приложениями

### 🎵 LierTags (Редактор аудиотегов — порт 8766)
1. Запустите **LierTags** (или автономный HTTP-сервер: `cargo run -p liertags-cli -- serve --port 8766`).
2. Откройте любую страницу трека/альбома на Bandcamp, Discogs, Last.fm, MusicBrainz или Яндекс.Музыке.
3. Нажмите **Добавить в LierTags** (токен не требуется, соединение происходит напрямую).

### 🎬 Lierkour (Каталогизатор фильмов и игр — порт 8765)
1. Установите и запустите **[Lierkour (v2.2+)](https://github.com/LaRCorp/Lierkour/releases)**.
2. Откройте в Lierkour вкладку **Настройки** → блок **«Связь с браузерным расширением LierEX»** и скопируйте `X-LierEX-Token`.
3. Нажмите иконку **LierEX-Q** в браузере → **⚙** → вставьте токен → **OK** (хранится локально в `chrome.storage.local`).
4. Откройте карточку фильма, сериала или игры, выберите статус и нажмите **Добавить в Lierkour**.

---

## Публикация в Opera Add-ons

- Руководство и готовые тексты формы публикации: [OPERA_ADDONS.md](OPERA_ADDONS.md)
- Политика конфиденциальности: [PRIVACY.md](PRIVACY.md)
- Сборка чистого архива `.zip` с проверками:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/package-opera.ps1
  ```

---

## Лицензия

Распространяется под лицензией **GNU General Public License v3.0 (GPLv3)** — см. [LICENSE](LICENSE).

Copyright (c) 2026 LaRevole.

Сделано с любовью к кино, видеоиграм, музыке и открытому вебу.

---

### Связанные проекты экосистемы
- ⚡🔄 **[LaRCorp/LierSync](https://github.com/LaRCorp/LierSync)** — быстрая P2P-передача файлов, синхронизация папок и буфера обмена между ПК и Android.
- 🎵🏷️ **[LaRCorp/LierTags](https://github.com/LaRCorp/LierTags)** — локальный редактор аудиотегов и обложек на Rust и Tauri 2.
- 🎮🎬 **[LaRCorp/Lierkour](https://github.com/LaRCorp/Lierkour)** — локальный кроссплатформенный каталогизатор фильмов, сериалов, аниме и видеоигр.
- 🎵🏷️ **[LaRCorp/LierTags](https://github.com/LaRCorp/LierTags)** — локальный высокопроизводительный редактор аудиотегов и обложек на Rust.
