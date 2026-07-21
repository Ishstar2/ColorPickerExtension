# Color Picker Chrome Extension

A clean, modern Chrome extension built with Manifest V3 and the native browser EyeDropper API. It helps you quickly sample colors from your screen, convert them between HEX, RGB, and HSL formats, save custom palettes, and export CSS variables.

---

## Features

- Screen Eyedropper: Pick any pixel on your display using the browser's native EyeDropper API.
- Live Color Conversions: Automatically converts picked colors into HEX, RGB, and HSL values.
- Segmented Format Switcher: Toggle between formats using simple button tabs.
- Clean Aesthetic: Off-white and terracotta design with soft rounded corners and subtle hover animations.
- Color History & Storage: Saves your picked colors locally across browser sessions with options to inspect or delete individual swatches.
- Export CSS Variables: Download your saved palette as a ready-to-use palette.css stylesheet.
- Customizable Shortcuts: Trigger the picker with Ctrl+Shift+E (or Cmd+Shift+E on Mac), with a built-in button to rebind hotkeys in Chrome settings.
- Lightweight: Written in standard HTML, CSS, and vanilla JavaScript with zero external libraries.

---

## Project Structure

my-color-picker/
├── manifest.json   # Extension configuration and command shortcuts
├── popup.html      # UI layout and styling
├── popup.js        # Core logic for picking, format math, and storage
├── icon16.png      # 16x16 px toolbar icon
├── icon48.png      # 48x48 px extensions page icon
└── icon128.png     # 128x128 px Web Store icon

---

## Installation

1. Download or clone this project folder to your machine.
2. Open Chrome and go to chrome://extensions/
3. Turn on "Developer mode" using the toggle switch in the top-right corner.
4. Click the "Load unpacked" button in the top-left corner.
5. Select the my-color-picker folder that contains your manifest.json file.

---

## How to Use

1. Click the extension icon in your toolbar, or press Ctrl+Shift+E (Cmd+Shift+E on Mac).
2. Click "Pick Color" to launch the screen eyedropper.
3. Click any pixel on your screen to sample its color.
4. Use the HEX, RGB, or HSL buttons to pick your preferred format.
5. Click "Copy" to copy the formatted string straight to your clipboard.
6. Click "Save" to keep the color in your palette grid.
7. Click any saved swatch to reload it into the preview, or hover and click the X to delete it.
8. Click "Export CSS Variables" to download a .css file containing your saved palette.
9. Click "Customize Keyboard Shortcut" if you want to change the hotkey in Chrome settings.

---

## Keyboard Shortcuts

- Default: Ctrl + Shift + E (Windows/Linux) or Cmd + Shift + E (Mac)
- Changing the keybind: Click the shortcut button at the bottom of the extension, or open chrome://extensions/shortcuts in a new tab.

---

## License

This project is open-source and free to use under the MIT License.
