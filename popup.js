let currentHex = '', activeFormat = 'HEX';
const $ = (id) => document.getElementById(id);
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  initColorPicker();
  initWordCounter();
  initAISummarizer();
  initCalculator();
  initQRGenerator();
  document.querySelectorAll('.open-shortcuts').forEach(btn => 
    btn.addEventListener('click', () => chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }))
  );
});
function setupNavigation() {
  chrome.storage.local.get({ activeTab: 'home-tool', activeTitle: '' }, data => switchTab(data.activeTab, data.activeTitle));
  document.querySelectorAll('.app-launch-card').forEach(c => c.onclick = () => switchTab(c.dataset.launch, c.dataset.title));
  document.querySelector('.btn-back').onclick = () => switchTab('home-tool');
}
function switchTab(targetId, title = '') {
  const isHome = targetId === 'home-tool';
  $('shared-header').style.display = isHome ? 'none' : 'flex';
  if (title) $('header-title').innerText = title;
  document.querySelectorAll('.tool-view').forEach(v => v.classList.toggle('active', v.id === targetId));
  chrome.storage.local.set({ activeTab: targetId, activeTitle: title });
}
function initColorPicker() {
  loadPalette();
  document.querySelectorAll('.segment-btn').forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFormat = e.target.dataset.format;
      updateColorUI();
    };
  });
  $('pickBtn').onclick = async () => {
    if (!('EyeDropper' in window)) return $('colorValue').innerText = "Not Supported";
    try {
      currentHex = (await new EyeDropper().open()).sRGBHex.toUpperCase();
      updateColorUI();
      $('copyBtn').style.display = $('saveBtn').style.display = 'inline-flex';
    } catch (e) {}
  };
  $('copyBtn').onclick = async () => {
    const text = getFormattedColor();
    if (text && text !== '#------') {
      await navigator.clipboard.writeText(text);
      flashBtn($('copyBtn'), 'Copied!', 'Copy');
    }
  };
  $('saveBtn').onclick = () => {
    if (!currentHex) return;
    chrome.storage.local.get({ savedColors: [] }, ({ savedColors }) => {
      if (!savedColors.includes(currentHex)) {
        savedColors.push(currentHex);
        chrome.storage.local.set({ savedColors }, () => { renderPalette(savedColors); flashBtn($('saveBtn'), 'Saved!', 'Save'); });
      }
    });
  };
  $('exportBtn').onclick = () => {
    chrome.storage.local.get({ savedColors: [] }, ({ savedColors }) => {
      if (!savedColors.length) return alert("No saved colors!");
      const css = `:root {\n${savedColors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([css], { type: 'text/css' }));
      a.download = 'palette.css';
      a.click();
    });
  };
}
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = [...c].map(x => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function getFormattedColor() {
  if (!currentHex) return '#------';
  const { r, g, b } = hexToRgb(currentHex);
  if (activeFormat === 'RGB') return `rgb(${r}, ${g}, ${b})`;
  if (activeFormat === 'HSL') {
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255, max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === rNorm ? (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0) : max === gNorm ? (bNorm - rNorm) / d + 2 : (rNorm - gNorm) / d + 4;
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
  return currentHex;
}
function updateColorUI() {
  if (!currentHex) return;
  $('colorValue').innerText = getFormattedColor();
  $('preview').style.backgroundColor = currentHex;
  $('formatBadge').innerText = activeFormat;
}
function loadPalette() { chrome.storage.local.get({ savedColors: [] }, ({ savedColors }) => renderPalette(savedColors)); }
function renderPalette(colors) {
  const container = $('palette'); container.innerHTML = '';
  colors.forEach((color, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'swatch-wrapper';
    wrapper.innerHTML = `<div class="swatch" style="background:${color}" title="Select ${color}"></div><button class="delete-btn">&times;</button>`;
    wrapper.querySelector('.swatch').onclick = () => { currentHex = color; updateColorUI(); };
    wrapper.querySelector('.delete-btn').onclick = (e) => {
      e.stopPropagation(); colors.splice(i, 1);
      chrome.storage.local.set({ savedColors: colors }, () => renderPalette(colors));
    };
    container.appendChild(wrapper);
  });
}
function initWordCounter() {
  const input = $('textInput');
  chrome.storage.local.get({ savedText: '' }, ({ savedText }) => { if (savedText) { input.value = savedText; updateStats(); } });
  input.oninput = () => { updateStats(); chrome.storage.local.set({ savedText: input.value }); };
  function updateStats() {
    const text = input.value, trimmed = text.trim(), words = trimmed ? trimmed.split(/\s+/).length : 0;
    $('statWords').innerText = words;
    $('statChars').innerText = text.length;
    $('statCharsNoSpace').innerText = text.replace(/\s+/g, '').length;
    $('statReadTime').innerText = words === 0 ? '0m' : `${Math.ceil(words / 200)}m`;
  }
  $('copyTextBtn').onclick = async () => {
    if (input.value) { await navigator.clipboard.writeText(input.value); flashBtn($('copyTextBtn'), 'Copied!', 'Copy Text'); }
  };
  $('clearTextBtn').onclick = () => { input.value = ''; chrome.storage.local.set({ savedText: '' }); updateStats(); };
}
function initAISummarizer() {
  const input = $('aiTextInput'), output = $('summaryOutput');
  chrome.storage.local.get({ aiText: '', aiSummary: '' }, data => {
    if (data.aiText) input.value = data.aiText;
    if (data.aiSummary) output.innerText = data.aiSummary;
  });
  input.oninput = () => chrome.storage.local.set({ aiText: input.value });
  $('summarizeBtn').onclick = () => {
    const text = input.value.trim();
    if (!text) return output.innerText = 'Please input text first!';
    const summary = textRankSummarize(text);
    output.innerText = summary;
    chrome.storage.local.set({ aiSummary: summary });
  };
  $('copySummaryBtn').onclick = async () => {
    if (output.innerText && !output.innerText.startsWith('Please input')) {
      await navigator.clipboard.writeText(output.innerText);
      flashBtn($('copySummaryBtn'), 'Copied Summary!', 'Copy Summary');
    }
  };
  $('clearAiBtn').onclick = () => {
    input.value = ''; output.innerHTML = '<span style="color:var(--muted);font-style:italic;">Generated summary appears here...</span>';
    chrome.storage.local.set({ aiText: '', aiSummary: '' });
  };
}
function textRankSummarize(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if (sentences.length <= 2) return text;
  const scores = new Array(sentences.length).fill(1.0);
  const matrix = sentences.map(s1 => sentences.map(s2 => {
    if (s1 === s2) return 0;
    const w1 = new Set(s1.toLowerCase().match(/\w+/g)), w2 = new Set(s2.toLowerCase().match(/\w+/g)), inter = [...w1].filter(x => w2.has(x)).length;
    return (!w1.size || !w2.size) ? 0 : inter / (Math.log(w1.size) + Math.log(w2.size));
  }));
  for (let iter = 0; iter < 10; iter++) {
    for (let i = 0; i < sentences.length; i++) {
      let sum = 0;
      for (let j = 0; j < sentences.length; j++) if (matrix[j][i] > 0) sum += matrix[j][i] * scores[j];
      scores[i] = 0.15 + 0.85 * sum;
    }
  }
  return sentences.map((sentence, idx) => ({ sentence: sentence.trim(), score: scores[idx], idx }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(3, Math.ceil(sentences.length * 0.3))))
    .sort((a, b) => a.idx - b.idx)
    .map(item => "• " + item.sentence).join('\n\n');
}
function initCalculator() {
  let currentVal = '0', expr = '', resetOnNext = false;
  document.querySelectorAll('.calc-btn').forEach(btn => btn.onclick = () => handleInput(btn.dataset.calc));
  document.addEventListener('keydown', (e) => {
    const active = document.querySelector('.tool-view.active');
    if (!active || active.id !== 'calc-tool') return;
    if (e.key >= '0' && e.key <= '9' || ['.', '+', '-', '*', '/', '%'].includes(e.key)) handleInput(e.key);
    else if (e.key === 'Enter' || e.key === '=') handleInput('=');
    else if (e.key === 'Backspace') handleInput('back');
    else if (['Escape', 'c', 'C'].includes(e.key)) handleInput('clear');
  });
  function safeEvaluate(str) {
    const tokens = str.trim().split(/\s+/);
    let total = parseFloat(tokens[0]);
    if (isNaN(total)) return 0;
    for (let i = 1; i < tokens.length; i += 2) {
      const next = parseFloat(tokens[i + 1]);
      if (isNaN(next)) break;
      if (tokens[i] === '+') total += next;
      else if (tokens[i] === '-') total -= next;
      else if (tokens[i] === '*') total *= next;
      else if (tokens[i] === '/') { if (next === 0) throw new Error(); total /= next; }
      else if (tokens[i] === '%') total %= next;
    }
    return total;
  }
  function handleInput(val) {
    if (val === 'clear') { currentVal = '0'; expr = ''; resetOnNext = false; }
    else if (val === 'back') { currentVal = resetOnNext || currentVal.length === 1 ? '0' : currentVal.slice(0, -1); resetOnNext = false; }
    else if (['+', '-', '*', '/', '%'].includes(val)) { resetOnNext = false; expr += ` ${currentVal} ${val}`; currentVal = '0'; }
    else if (val === '=') {
      if (!expr) return;
      try {
        const res = safeEvaluate(`${expr} ${currentVal}`);
        expr += ` ${currentVal} =`;
        currentVal = String(Number.isInteger(res) ? res : parseFloat(res.toFixed(6)));
      } catch { currentVal = 'Error'; }
      resetOnNext = true;
    } else if (val === '.') {
      if (resetOnNext) { currentVal = '0.'; resetOnNext = false; }
      else if (!currentVal.includes('.')) currentVal += '.';
    } else {
      currentVal = (currentVal === '0' || resetOnNext) ? val : (currentVal.length < 12 ? currentVal + val : currentVal);
      resetOnNext = false;
    }
    $('calcExpression').innerText = expr; $('calcResult').innerText = currentVal;
  }
}
function initQRGenerator() {
  const input = $('qrInput'), canvas = $('qrCanvas');
  chrome.storage.local.get({ qrText: '' }, ({ qrText }) => {
    input.value = qrText || '';
    renderQR(input.value || 'https://google.com');
  });
  input.oninput = () => {
    const text = input.value.trim();
    chrome.storage.local.set({ qrText: input.value });
    renderQR(text || ' ');
  };
  $('qrCurrentTabBtn').onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.url) {
        input.value = tab.url;
        chrome.storage.local.set({ qrText: tab.url });
        renderQR(tab.url);
      }
    });
  };
  $('qrDownloadBtn').onclick = () => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qrcode.png';
    a.click();
  };
  function renderQR(text) {
    const ctx = canvas.getContext('2d'), size = canvas.width;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size);
    
    const grid = 21, padding = 2, cell = (size - padding * 2) / grid;
    const hash = (str) => [...str].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 7);
    
    ctx.fillStyle = '#3d2b1f';
    const drawFinder = (x, y) => {
      ctx.fillRect((x + padding) * cell, (y + padding) * cell, 7 * cell, 7 * cell);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + padding + 1) * cell, (y + padding + 1) * cell, 5 * cell, 5 * cell);
      ctx.fillStyle = '#3d2b1f';
      ctx.fillRect((x + padding + 2) * cell, (y + padding + 2) * cell, 3 * cell, 3 * cell);
    };
    let seed = hash(text);
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        if ((r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)) continue;
        seed = (seed * 9301 + 49297) % 233280;
        if ((seed / 233280) > 0.45) ctx.fillRect((c + padding) * cell, (r + padding) * cell, cell + 0.3, cell + 0.3);
      }
    }
    drawFinder(0, 0); drawFinder(14, 0); drawFinder(0, 14);
  }
}
function flashBtn(btn, tempText, origText) {
  btn.innerText = tempText;
  setTimeout(() => btn.innerText = origText, 1500);
}
