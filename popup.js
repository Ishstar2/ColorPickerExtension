let currentHex = '';

document.addEventListener('DOMContentLoaded', loadPalette);

// Converter Helper Functions
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function updateFormattedOutput() {
  if (!currentHex) return;

  const { r, g, b } = hexToRgb(currentHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;

  document.getElementById('rgbVal').innerText = rgbStr;
  document.getElementById('hslVal').innerText = hslStr;

  const format = document.getElementById('formatSelect').value;
  const outputInput = document.getElementById('colorOutput');

  if (format === 'HEX') outputInput.value = currentHex;
  else if (format === 'RGB') outputInput.value = rgbStr;
  else if (format === 'HSL') outputInput.value = hslStr;
}

// Event Listeners
document.getElementById('formatSelect').addEventListener('change', updateFormattedOutput);

document.getElementById('pickBtn').addEventListener('click', async () => {
  if (!('EyeDropper' in window)) {
    document.getElementById('colorOutput').value = "Not Supported";
    return;
  }

  const eyeDropper = new EyeDropper();

  try {
    const result = await eyeDropper.open();
    currentHex = result.sRGBHex.toUpperCase();

    document.getElementById('preview').style.backgroundColor = currentHex;
    updateFormattedOutput();

    document.getElementById('copyBtn').style.display = 'block';
    document.getElementById('saveBtn').style.display = 'block';
  } catch (e) {
    console.log("Canceled color picking.");
  }
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  const textToCopy = document.getElementById('colorOutput').value;
  if (textToCopy && textToCopy !== '#------') {
    await navigator.clipboard.writeText(textToCopy);
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.innerText = 'Copied!';
    setTimeout(() => { copyBtn.innerText = 'Copy'; }, 1500);
  }
});

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
        setTimeout(() => { saveBtn.innerText = 'Save'; }, 1500);
      });
    }
  });
});

function loadPalette() {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    renderPalette(data.savedColors);
  });
}

function renderPalette(colors) {
  const container = document.getElementById('palette');
  container.innerHTML = '';

  colors.forEach((color, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'swatch-wrapper';

    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = color;
    swatch.title = `Select ${color}`;

    swatch.addEventListener('click', () => {
      currentHex = color;
      document.getElementById('preview').style.backgroundColor = color;
      updateFormattedOutput();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeColor(index);
    });

    wrapper.appendChild(swatch);
    wrapper.appendChild(deleteBtn);
    container.appendChild(wrapper);
  });
}

function removeColor(index) {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    const updatedColors = data.savedColors;
    updatedColors.splice(index, 1);
    chrome.storage.local.set({ savedColors: updatedColors }, () => {
      renderPalette(updatedColors);
    });
  });
}

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
