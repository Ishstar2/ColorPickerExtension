Color Picker Chrome Extension

A lightweight, modern, and easy-to-use Google Chrome extension built with Manifest V3 and the native browser EyeDropper API. Quickly sample any color from any web page, copy its HEX value, save custom color palettes, and export CSS variables.

Features

- Pixel-Perfect Color Picking: Uses the native browser EyeDropper API to sample colors from anywhere on your screen.
- One-Click Copy: Easily copy the selected HEX color code to your clipboard with immediate visual feedback.
- Visual Preview Box: Displays a live swatch preview of the currently picked color.
- Palette History & Storage: Save your favorite picked colors directly to local storage so they persist across browser sessions.
- Export as CSS Variables: Export your saved color palette into a downloadable palette.css file ready for web projects.
- Custom Extension Icon: Polished logo graphics in all required sizes (16x16, 48x48, 128x128).
- Lightweight & Fast: Pure vanilla HTML, CSS, and JavaScript with zero external dependencies.
- Privacy Focused: Uses local storage only and runs entirely inside your browser.

Project Structure

my-color-picker/
├── manifest.json   # Chrome extension configuration file (Manifest V3)
├── popup.html      # Structure and styling for the extension popup UI
├── popup.js        # Logic for EyeDropper API, clipboard, and palette storage
├── icon16.png      # 16x16 px extension icon
├── icon48.png      # 48x48 px extension icon
└── icon128.png     # 128x128 px extension icon

Installation & Setup

Follow these simple steps to install and run the extension locally in developer mode:

1. Clone or Download this repository/folder to your local machine:
   git clone https://github.com/your-username/color-picker-extension.git
   (Or simply create a folder with manifest.json, popup.html, popup.js, and the icon files).

2. Open Google Chrome and navigate to the Extensions page:
   chrome://extensions/

3. Enable Developer mode using the toggle switch in the upper-right corner.

4. Click Load unpacked in the top-left corner.

5. Select the my-color-picker directory containing your manifest.json file.

Usage

1. Click the puzzle piece icon in the top-right toolbar of Chrome and pin Color Picker Extension.
2. Click the extension icon to open the popup interface.
3. Click Pick Color — your cursor will transform into a magnified eyedropper crosshair.
4. Hover over any element or image on the web page and click to select a pixel color.
5. Click Copy HEX to copy the color code to your clipboard.
6. Click Save to Palette to store the color in your saved palette history.
7. Click any saved color swatch in your palette to instantly copy its HEX code.
8. Click Export as CSS Variables to download your saved palette as a .css file!

Contributing & Customization

Feel free to fork this project and add new features, such as:
- RGB / HSL conversion options
- WCAG Contrast ratio checker for text accessibility
- Keyboard shortcuts for instant color picking

License

This project is open-source and available under the MIT License.
