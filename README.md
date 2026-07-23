# Utility Hub Extension

An all-in-one productivity Chrome Extension (Manifest V3) featuring a home dashboard and quick-access tools including a color picker & palette manager, a real-time text analyzer, a local AI text summarizer, a calculator, and a QR code generator.

---

## Features

- **Home Dashboard:** A centralized launcher with custom vector UI icons to navigate seamlessly between utilities.
- **Color Picker & Palette Manager:**
  - Pick colors directly from any webpage using the native EyeDropper API.
  - Instant conversion across HEX, RGB, and HSL color formats.
  - Save custom color swatches to your persistent local palette.
  - Export saved colors as a ready-to-use CSS Variables stylesheet (`palette.css`).
- **Word & Text Counter:**
  - Real-time word, character (with and without spaces), and estimated reading time calculations.
  - Persistent input buffer (your typed text stays saved even if you close the popup).
  - One-click Copy Text and Clear tools.
- **AI Text Summarizer:**
  - 100% local, offline text summarization powered by a built-in TextRank graph algorithm.
  - Automatically identifies key sentences and extracts bulleted summary highlights without requiring external APIs or server requests.
  - Persistent input and summary output across popup reopens.
- **Calculator:**
  - Perform arithmetic calculations (`+`, `-`, `*`, `/`, `%`).
  - Full keyboard support (numbers, operators, `Enter`, `Backspace`, `Escape`).
  - Safe, custom evaluator fully compliant with Chrome Extension Manifest V3 Content Security Policy (no `eval` or dynamic code execution).
- **QR Code Generator:**
  - Generate instant QR codes for custom text or web URLs.
  - One-click button to automatically grab the current active tab URL.
  - Download generated QR codes directly as PNG images.
- **Native Typography & Modern Styling:**
  - Styled cleanly with system UI typography (`system-ui`, `-apple-system`, `ui-monospace`) without relying on external web fonts or AI-style geometric sans-serifs.
- **Keyboard Shortcuts:**
  - Quick launch default shortcut (`Ctrl+Shift+E` on Windows/Linux, `Cmd+Shift+E` on macOS).
  - Direct link to customize extension shortcuts from within the app.

---

## File Structure

utility-hub-extension/
├── manifest.json      # Extension configuration & Manifest V3 definition
├── popup.html         # Main user interface & styling
├── popup.js           # Navigation, color picker, text counter, summarizer, calculator & QR logic
├── Readme.md          # Project documentation
├── icon-color.svg     # Home screen icon for Color Picker
├── icon-word.svg      # Home screen icon for Word Counter
├── icon-ai.svg        # Home screen icon for AI Summarizer
├── icon-calc.svg      # Home screen icon for Calculator
├── icon-qr.svg        # Home screen icon for QR Generator
├── icon16.png         # 16x16 extension icon
├── icon48.png         # 48x48 extension icon
└── icon128.png        # 128x128 extension icon

---

## Installation Guide

1. Clone or Download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** by toggling the switch in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the `utility-hub-extension` folder containing `manifest.json`.
6. Click the extension icon in your browser toolbar to open Utility Hub!

---

## Tech Stack & Permissions

- **Manifest Version:** 3
- **Languages:** HTML5, CSS3 (System UI stacks), JavaScript (ES6+)
- **Icons:** Inline Vector SVGs (`.svg`)
- **Storage:** `chrome.storage.local` (used to persist active tab preference, palette items, text inputs, summary buffers, and calculator states)

---

## License

Distributed under the MIT License. Feel free to modify and expand with your own custom tools!
