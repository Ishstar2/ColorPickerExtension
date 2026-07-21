let currentHex = '';

document.addEventListener('DOMContentLoaded', loadPalette);

document.getElementById('pickBtn').addEventListener('click', async () => {
  if (!('EyeDropper' in window)) {
    document.getElementById('result').innerText = "Not Supported";
    return;
  }

  const eyeDropper = new EyeDropper();

  try {
    const result = await eyeDropper.open();
    currentHex = result.sRGBHex.toUpperCase();

    // Update UI elements
    document.getElementById('result').innerText = currentHex;
    document.getElementById('preview').style.backgroundColor = currentHex;

    // Reveal Action Buttons
    document.getElementById('copyBtn').style.display = 'flex';
    document.getElementById('saveBtn').style.display = 'flex';
    document.getElementById('copyBtn').innerText = 'Copy HEX';
    document.getElementById('saveBtn').innerText = 'Save';
  } catch (e) {
    console.log("Canceled color picking.");
  }
});

// Copy to Clipboard with Feedback
document.getElementById('copyBtn').addEventListener('click', async () => {
  if (currentHex) {
    await navigator.clipboard.writeText(currentHex);
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.innerText = 'Copied!';
    setTimeout(() => {
      copyBtn.innerText = 'Copy HEX';
    }, 1500);
  }
});

// Save Color to Local Storage
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!currentHex) return;

  chrome.storage.local.get({ savedColors: [] }, (data) => {
    const updatedColors = data.savedColors;
    if (!updatedColors.includes(currentHex)) {
      updatedColors.push(currentHex);
      chrome.storage.local.set({ savedColors: updatedColors }, () => {
        renderPalette(updatedColors);
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.innerText = 'Saved!';
        setTimeout(() => {
          saveBtn.innerText = 'Save';
        }, 1500);
      });
    }
  });
});

// Load Palette
function loadPalette() {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    renderPalette(data.savedColors);
  });
}

// Render Palette Swatches with Delete Options
function renderPalette(colors) {
  const container = document.getElementById('palette');
  container.innerHTML = '';

  colors.forEach((color, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'swatch-wrapper';

    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = color;
    swatch.title = `Click to copy ${color}`;

    swatch.addEventListener('click', async () => {
      await navigator.clipboard.writeText(color);
      document.getElementById('result').innerText = color;
      document.getElementById('preview').style.backgroundColor = color;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Remove color';

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent copying color when deleting
      removeColor(index);
    });

    wrapper.appendChild(swatch);
    wrapper.appendChild(deleteBtn);
    container.appendChild(wrapper);
  });
}

// Remove Color from Storage
function removeColor(index) {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    const updatedColors = data.savedColors;
    updatedColors.splice(index, 1);
    chrome.storage.local.set({ savedColors: updatedColors }, () => {
      renderPalette(updatedColors);
    });
  });
}

// Export as CSS Variables
document.getElementById('exportBtn').addEventListener('click', () => {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    if (data.savedColors.length === 0) {
      alert("No saved colors to export!");
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
