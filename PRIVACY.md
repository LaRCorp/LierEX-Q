# Privacy Policy — LierEX-Q

_Last updated: 2026-11-26_

**LierEX-Q** ("Extract and export media cards to JSON, Lierkour, LierTags, or LierSync") is an open-source browser extension licensed under GNU GPLv3. Respecting user privacy is core to its design: **LierEX-Q collects zero personal data, zero browsing history, zero analytics, and communicates with zero remote servers.**

## 1. What Data LierEX-Q Reads
- Only when you explicitly click the **LierEX-Q** toolbar icon or choose a **Send to LierSync** context-menu action, the extension uses `activeTab`, `scripting`, and `contextMenus` permissions to inspect the active page metadata, selected text, link URL, or image URL.
- LierEX-Q **does not** run background content scripts across websites, does not track visited URLs, and does not access your browsing history, cookies, passwords, or form inputs.

## 2. How Extracted Data Is Used
- The extracted card or link/image is either exported locally (**Copy JSON** / **Save `.json`**) or sent strictly to your own desktop applications running on localhost:
  - **Lierkour** (`http://127.0.0.1:8765`)
  - **LierTags** (`http://127.0.0.1:8766`)
  - **LierSync Bridge** (`http://127.0.0.1:8768`)
- If a target app is offline, the pending item can be queued locally in `chrome.storage.local` until you retry.

## 3. Local Storage & Authentication Token
- If you connect LierEX to the Lierkour desktop app, the local authentication token (`X-LierEX-Token`) you enter is stored exclusively on your device via `chrome.storage.local`.
- No tokens or user preferences are synchronized externally or sent to third parties.

## 4. Third Parties & Analytics
- **None.** LierEX uses no analytics SDKs, no ad networks, no crash reporting services, and no remote code execution.

## 5. Source Code & Contact
- LierEX repository: https://github.com/LaRCorp/LierEX
- Companion desktop app (Lierkour): https://github.com/LaRCorp/Lierkour
- Issue tracker / support: https://github.com/LaRCorp/LierEX/issues

