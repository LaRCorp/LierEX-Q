<div align="center">
  <img src="icons/icon128.png" width="96" height="96" alt="LierEX-Q Logo" />
  <h1>🌐 LierEX-Q v1.4 — Media & Music Extractor</h1>
  <p><strong>Browser extension (Manifest V3) for extracting movies, TV series, games, and music to JSON, Lierkour, LierTags, or LierSync</strong></p>

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

**LierEX-Q** is a lightweight, zero-build Manifest V3 browser extension for Chromium and Opera browsers:
- **Movies, Series & Games** (`movie`, `game`) → JSON export or direct 1-click import to **Lierkour** (`127.0.0.1:8765`).
- **Music Tracks & Releases** (`track`) → JSON export or direct 1-click import to **LierTags** (`127.0.0.1:8766`).
- **Links, Selections & Images from Any Site** → push directly to your PC/Android clipboard via **LierSync** (`127.0.0.1:8768`) from the popup or right-click context menu, with an automatic offline retry queue in `chrome.storage.local`.

---

## Supported Portals (13 Services)

- **Music (`LierTags :8766`):** MusicBrainz, Discogs, Last.fm, Bandcamp, Yandex Music
- **Movies, Series & Anime (`Lierkour :8765`):** Kinopoisk, IMDb, TMDb, Letterboxd
- **Games (`Lierkour :8765`):** Steam, Epic Games Store, GOG, Itch.io
- **Clipboard & Link Push (`LierSync :8768`):** Any HTTP/HTTPS page, text selection, link, or image via right-click menu or popup.

---

## Packaging & Privacy

- Privacy policy: [PRIVACY.md](PRIVACY.md)
- Opera Add-ons guide: [OPERA_ADDONS.md](OPERA_ADDONS.md)
- Build clean release ZIP:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/package-opera.ps1
  ```

---

## License

Released under **GNU General Public License v3.0 (GPLv3)** — see [LICENSE](LICENSE).

Copyright (c) 2026 LaRevole.

### Related Ecosystem Projects
- ⚡🔄 **[LaRCorp/LierSync](https://github.com/LaRCorp/LierSync)** — fast P2P file transfers, folder sync, and shared clipboard for PC & Android.
- 🎵🏷️ **[LaRCorp/LierTags](https://github.com/LaRCorp/LierTags)** — high-performance local audio tag & cover art editor built with Rust.
- 🎮🎬 **[LaRCorp/Lierkour](https://github.com/LaRCorp/Lierkour)** — local cross-platform catalog for movies, series, anime, and video games.
