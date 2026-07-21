Color Picker Chrome Extension

A lightweight, modern, and easy-to-use Google Chrome extension built with Manifest V3 and the native browser EyeDropper API. Quickly sample any color from any web page and copy its HEX value directly to your clipboard.

Features

- Pixel-Perfect Color Picking: Uses the native browser EyeDropper API to sample colors from anywhere on your screen.
- One-Click Copy: Easily copy the selected HEX color code to your clipboard with immediate visual feedback.
- Visual Preview Box: Displays a live swatch preview of the currently picked color.
- Lightweight & Fast: Pure vanilla HTML, CSS, and JavaScript with zero external dependencies.
- Privacy Focused: Requires no permissions and runs entirely locally inside your browser.

Project Structure

my-color-picker/
├── manifest.json   # Chrome extension configuration file (Manifest V3)
├── popup.html      # Structure and styling for the extension popup UI
└── popup.js        # Logic for EyeDropper API and clipboard functionality

Installation & Setup

Follow these simple steps to install and run the extension locally in developer mode:

1. Clone or Download this repository/folder to your local machine:
   git clone https://github.com/your-username/color-picker-extension.git
   (Or simply create a folder with manifest.json, popup.html, and popup.js).

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
5. Click Copy HEX to copy the #RRGGBB color code directly to your clipboard!

Contributing & Customization

Feel free to fork this project and add new features, such as:
- RGB / HSL conversion options
- Palette history (saving recent picked colors using chrome.storage.local)
- WCAG Contrast ratio checker for text accessibility

License

This project is open-source and available under the MIT License.
