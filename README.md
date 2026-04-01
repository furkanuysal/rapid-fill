# RapidFill

<p align="center">
  <a href="https://github.com/furkanuysal/rapid-fill/releases"><img alt="Version" src="https://img.shields.io/github/v/release/furkanuysal/rapid-fill?display_name=tag&color=2f63ff"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-1f8b4c"></a>
  <a href="https://github.com/furkanuysal/rapid-fill/releases"><img alt="GitHub Releases" src="https://img.shields.io/badge/Releases-Downloads-181717?logo=github&logoColor=white"></a>
  <a href="https://chromewebstore.google.com/detail/rapidfill/hhlmkpjjadjnclhlgjnaidjlgghdkeen"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome%20Web%20Store-Live-4285f4?logo=googlechrome&logoColor=white"></a>
  <a href="https://addons.mozilla.org/tr/firefox/addon/rapidfill/"><img alt="Firefox Add-ons" src="https://img.shields.io/badge/Mozilla%20Add--ons-Live-ff9500?logo=firefoxbrowser&logoColor=white"></a>
  <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/React-19-20232a?logo=react"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white"></a>
  <a href="https://vite.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-7.3-646cff?logo=vite&logoColor=white"></a>
</p>

RapidFill is a browser extension that helps users autofill job application forms using a locally stored profile.

It is built with React, TypeScript, and Vite, with separate Chrome and Firefox manifests and a privacy-first permission model.

## Overview

RapidFill lets users maintain a reusable application profile inside the extension popup and apply that profile to job application forms on demand.

The project focuses on:

- Local-first data storage
- Minimal permissions
- Manual, user-triggered autofill
- Cross-browser support for Chrome and Firefox
- A polished popup UI with multilingual support

## Features

- Save and edit profile data directly in the extension popup
- Autofill supported form fields on the active page
- Store data locally with `chrome.storage.local`
- Switch between English and Turkish in the UI
- Manage contact, location, education, and experience details
- Use structured phone input with country dialing codes
- Use date picker inputs for profile dates
- Clear saved profile data from the popup

## Tech Stack

- React 19
- TypeScript
- Vite
- `react-datepicker`
- `date-fns`
- `libphonenumber-js`

## Project Structure

```text
public/
  manifests/
    manifest.chrome.json
    manifest.firefox.json

src/
  content/              Content script entry
  engine/               Form scanning and autofill logic
  lib/                  Shared app utilities such as i18n
  locales/              Translation dictionaries
  popup/                Popup pages, form UI, and popup helpers
  storage/              Browser storage helpers
  types/                Shared TypeScript types
  utils/                Formatting helpers
```

## How It Works

1. The user enters profile data in the popup.
2. RapidFill stores that data locally in browser extension storage.
3. When the user clicks autofill, the extension injects the content script into the active tab.
4. The content script scans the current page and fills matching fields from the saved profile.

RapidFill does not run continuously on every site by default. Autofill is initiated only by explicit user action.

## Permissions Model

RapidFill uses a limited extension permission set:

- `storage`: stores profile data and language preference locally
- `activeTab`: allows access to the current tab only after user interaction
- `scripting`: injects the autofill script when autofill is requested

The extension does not use persistent `<all_urls>` host permissions and does not register always-on content scripts for every page.

## Privacy

RapidFill is designed to be local-first.

- User profile data is stored locally in browser extension storage
- No backend is required for the current implementation
- No analytics, ad SDKs, or third-party tracking services are used
- Data is processed only when entered by the user or when autofill is explicitly triggered

For full details, see [PRIVACY.md](./PRIVACY.md).

## Development

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Type check and production build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Extension Builds

Build outputs are generated separately for Chrome and Firefox.

### Chrome

```bash
npm run build:chrome
```

Output:

```text
dist/chrome/
```

### Firefox

```bash
npm run build:firefox
```

Output:

```text
dist/firefox/
```

## Loading the Extension

### Chrome

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click `Load unpacked`
4. Select `dist/chrome`

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click `Load Temporary Add-on`
3. Select the manifest inside `dist/firefox`

## Downloads

- GitHub release builds for Chrome and Firefox are available on [GitHub Releases](https://github.com/furkanuysal/rapid-fill/releases).
- The Chrome version is published on the [Chrome Web Store](https://chromewebstore.google.com/detail/rapidfill/hhlmkpjjadjnclhlgjnaidjlgghdkeen).
- The Firefox version is also published on [Mozilla Add-ons](https://addons.mozilla.org/tr/firefox/addon/rapidfill/).

## Internationalization

RapidFill currently supports:

- English
- Turkish

Translations are defined in:

- [src/locales/en.ts](./src/locales/en.ts)
- [src/locales/tr.ts](./src/locales/tr.ts)

The app resolves the initial language from the browser UI language and stores the selected language locally.

## Versioning

Browser extension version numbers are managed in:

- [public/manifests/manifest.chrome.json](./public/manifests/manifest.chrome.json)
- [public/manifests/manifest.firefox.json](./public/manifests/manifest.firefox.json)

The popup reads the displayed extension version from the manifest at runtime.

## Notes

- Chrome and Firefox differ in some popup and date input behaviors, so browser-specific handling may be needed in UI components.
- The autofill quality depends on how target forms label and structure their fields.
- The project currently targets manual autofill rather than background automation.

## Roadmap Ideas

- Broader field matching coverage
- Improved date picker behavior across browsers
- Additional language support
- More advanced form heuristics
- Better import and export options for profile data

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
