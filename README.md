Color Picker Chrome Extension

A lightweight, modern, and easy-to-use Google Chrome extension built with Manifest V3 and the native browser EyeDropper API. Quickly sample any color from any web page, convert between formats (HEX, RGB, HSL), save custom palettes, and export CSS variables.

Features

- Pixel-Perfect Color Picking: Uses the native browser EyeDropper API to sample colors from anywhere on your screen.
- Dynamic Color Conversions: Automatically converts picked colors between HEX, RGB, and HSL formats on the fly.
- Format Selector Toggle: Easily switch your view and copy format with a single dropdown select.
- Interactive Palette & Storage: Save your favorite colors locally so they persist across sessions, complete with click-to-select and individual delete controls.
- Export as CSS Variables: Export your saved color palette into a downloadable palette.css file ready for web projects.
- Modern Dark-Mode UI: Clean, compact interface with instant visual feedback for copying and saving.
- Custom Extension Icons: Polished graphics in all required sizes (16x16, 48x48, 128x128).
- Lightweight & Fast: Pure vanilla HTML, CSS, and JavaScript with zero external dependencies.

Project Structure

my-color-picker/
├── manifest.json   # Extension configuration file (Manifest V3)
├── popup.html      # UI structure with dark mode theme & format selectors
├── popup.js        # Logic for EyeDropper, format math, storage, & export
├── icon16.png      # 16x16 px extension icon
├── icon48.png      # 48x48 px extension icon
└── icon128.png     # 128x128 px extension icon

Installation & Setup

1. Clone or Download this repository/folder to your local machine:
   git clone https://github.com/your-username/color-picker-extension.git
   (Or ensure all project files are together in a single folder).

2. Open Google Chrome and navigate to:
   chrome://extensions/

3. Enable Developer mode using the toggle in the upper-right corner.

4. Click Load unpacked in the top-left corner.

5. Select the my-color-picker directory containing your manifest.json file.

Usage

1. Click the extension icon in your toolbar to open the popup.
2. Click Pick Color — your cursor will transform into a magnified eyedropper.
3. Click any pixel on your screen to pick its color.
4. Use the format dropdown to switch between HEX, RGB, and HSL output.
5. Click Copy to copy the formatted color string directly to your clipboard.
6. Click Save to store the color into your local palette.
7. Click any swatch in your palette to quickly reload it into the converter, or hover and click the X to delete it.
8. Click Export CSS Variables to download your saved colors as a .css file!

Contributing & Customization

Feel free to fork this project and add new features, such as:
- WCAG Contrast ratio calculator
- Shade and tint generator rows
- Global keyboard shortcut triggers

License

This project is open-source and available under the MIT License.
