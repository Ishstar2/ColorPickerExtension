let currentHex = '';

// Load saved palette when popup opens
document.addEventListener('DOMContentLoaded', loadPalette);

document.getElementById('pickBtn').addEventListener('click', async () => {
  if (!('EyeDropper' in window)) {
    document.getElementById('result').innerText = "EyeDropper not supported.";
    return;
  }

  const eyeDropper = new EyeDropper();

  try {
    const result = await eyeDropper.open();
    currentHex = result.sRGBHex;

    document.getElementById('result').innerText = currentHex;
    document.getElementById('preview').style.backgroundColor = currentHex;

    document.getElementById('copyBtn').style.display = 'block';
    document.getElementById('saveBtn').style.display = 'block';
    document.getElementById('copyBtn').innerText = 'Copy HEX';
  } catch (e) {
    console.log("Canceled color picking.");
  }
});

// Copy to Clipboard
document.getElementById('copyBtn').addEventListener('click', async () => {
  if (currentHex) {
    await navigator.clipboard.writeText(currentHex);
    document.getElementById('copyBtn').innerText = 'Copied!';
  }
});

// Save Color to Storage
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!currentHex) return;

  chrome.storage.local.get({ savedColors: [] }, (data) => {
    const updatedColors = data.savedColors;
    if (!updatedColors.includes(currentHex)) {
      updatedColors.push(currentHex);
      chrome.storage.local.set({ savedColors: updatedColors }, () => {
        renderPalette(updatedColors);
      });
    }
  });
});

// Load Palette from Storage
function loadPalette() {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    renderPalette(data.savedColors);
  });
}

// Render Palette Swatches
function renderPalette(colors) {
  const container = document.getElementById('palette');
  container.innerHTML = '';

  colors.forEach((color) => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = color;
    swatch.title = `Click to copy ${color}`;

    swatch.addEventListener('click', async () => {
      await navigator.clipboard.writeText(color);
      document.getElementById('result').innerText = `Copied ${color}!`;
    });

    container.appendChild(swatch);
  });
}

// Export as CSS Variables file
document.getElementById('exportBtn').addEventListener('click', () => {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    if (data.savedColors.length === 0) {
      alert("Save some colors first!");
      return;
    }

    let cssContent = ":root {\n";
    data.savedColors.forEach((hex, index) => {
      cssContent += `  --color-${index + 1}: ${hex};\n`;
    });
    cssContent += "}\n";

    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.css';
    a.click();
  });
});
