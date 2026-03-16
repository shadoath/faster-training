// ---- Settings defaults (declared first so all handlers below can reference kbSettings safely) ----

const DEFAULT_KB_SETTINGS = {
  shortcut: { ctrl: true, shift: true, alt: false, key: '.' },
  smallStep: 0.1,
  largeStep: 0.5,
  presets: [1, 1.5, 2, 3, 4]
};

// Fix #1: initialize synchronously so button handlers never see null/undefined
let kbSettings = mergeSettings({});

// ---- Speed controls ----

const input = document.getElementById('speed');

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function round(val) {
  return Math.round(val * 100) / 100;
}

function setRate(rate) {
  rate = clamp(round(rate), 0.1, 64);
  input.value = rate;
  chrome.storage.local.set({ playbackRate: rate });
  // Fix #2: notify background to update badge even if service worker was dormant
  chrome.runtime.sendMessage({ type: 'rateChanged', rate }).catch(() => {});
}

chrome.storage.local.get('playbackRate', (data) => {
  input.value = data.playbackRate || 2;
});

document.getElementById('btnLargeDown').addEventListener('click', () => setRate((parseFloat(input.value) || 2) - kbSettings.largeStep));
document.getElementById('btnSmallDown').addEventListener('click', () => setRate((parseFloat(input.value) || 2) - kbSettings.smallStep));
document.getElementById('btnSmallUp').addEventListener('click',   () => setRate((parseFloat(input.value) || 2) + kbSettings.smallStep));
document.getElementById('btnLargeUp').addEventListener('click',   () => setRate((parseFloat(input.value) || 2) + kbSettings.largeStep));

input.addEventListener('change', () => {
  setRate(parseFloat(input.value) || 2);
});

input.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY < 0 ? kbSettings.smallStep : -kbSettings.smallStep;
  setRate((parseFloat(input.value) || 2) + delta);
});

// ---- Settings Panel ----

const gearBtn = document.getElementById('gearBtn');
const settingsPanel = document.getElementById('settingsPanel');
const shortcutInput = document.getElementById('shortcutInput');
const smallStepInput = document.getElementById('smallStep');
const largeStepInput = document.getElementById('largeStep');
const presetInputs = document.querySelectorAll('[data-preset]');

let recordingShortcut = false;

// Fix #8: handle special keys in shortcut display
const KEY_LABELS = {
  '.': 'Period', ' ': 'Space',
  'ArrowUp': 'Up', 'ArrowDown': 'Down', 'ArrowLeft': 'Left', 'ArrowRight': 'Right',
  'Escape': 'Esc', 'Enter': 'Enter', 'Backspace': 'Backspace', 'Tab': 'Tab'
};

function formatShortcut(sc) {
  const parts = [];
  if (sc.ctrl) parts.push('Ctrl');
  if (sc.shift) parts.push('Shift');
  if (sc.alt) parts.push('Alt');
  parts.push(KEY_LABELS[sc.key] || sc.key.toUpperCase());
  return parts.join('+');
}

// Fix #3 & #6: deep merge presets so missing entries fall back to defaults
function mergeSettings(saved) {
  const merged = Object.assign({}, DEFAULT_KB_SETTINGS, saved);
  merged.presets = DEFAULT_KB_SETTINGS.presets.map((def, i) =>
    (saved.presets && saved.presets[i] != null) ? saved.presets[i] : def
  );
  return merged;
}

function populateSettings(s) {
  shortcutInput.value = formatShortcut(s.shortcut);
  smallStepInput.value = s.smallStep;
  largeStepInput.value = s.largeStep;
  presetInputs.forEach(inp => {
    inp.value = s.presets[parseInt(inp.dataset.preset)];
  });
}

function saveSettings() {
  chrome.storage.local.set({ kbSettings });
}

// Load settings
chrome.storage.local.get('kbSettings', (data) => {
  kbSettings = mergeSettings(data.kbSettings || {});
  populateSettings(kbSettings);
});

// Toggle settings panel
gearBtn.addEventListener('click', () => {
  const open = settingsPanel.style.display === 'block';
  settingsPanel.style.display = open ? 'none' : 'block';
  gearBtn.classList.toggle('open', !open);
});

// Shortcut recorder
shortcutInput.addEventListener('click', () => {
  recordingShortcut = true;
  shortcutInput.value = 'Press shortcut…';
  shortcutInput.classList.add('recording');
});

shortcutInput.addEventListener('blur', () => {
  if (recordingShortcut) {
    recordingShortcut = false;
    shortcutInput.classList.remove('recording');
    shortcutInput.value = formatShortcut(kbSettings.shortcut);
  }
});

shortcutInput.addEventListener('keydown', (e) => {
  if (!recordingShortcut) return;
  e.preventDefault();
  e.stopPropagation();

  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

  kbSettings.shortcut = {
    ctrl: e.ctrlKey || e.metaKey,
    shift: e.shiftKey,
    alt: e.altKey,
    key: e.key
  };

  recordingShortcut = false;
  shortcutInput.classList.remove('recording');
  shortcutInput.value = formatShortcut(kbSettings.shortcut);
  shortcutInput.blur();
  saveSettings();
});

// Step inputs
smallStepInput.addEventListener('change', () => {
  const v = parseFloat(smallStepInput.value);
  if (!isNaN(v) && v > 0 && v <= 2) {
    kbSettings.smallStep = round(v);
    saveSettings();
  }
});

largeStepInput.addEventListener('change', () => {
  const v = parseFloat(largeStepInput.value);
  if (!isNaN(v) && v > 0 && v <= 4) {
    kbSettings.largeStep = round(v);
    saveSettings();
  }
});

// Preset inputs
presetInputs.forEach(inp => {
  inp.addEventListener('change', () => {
    const v = parseFloat(inp.value);
    if (!isNaN(v) && v >= 0.1 && v <= 64) {
      kbSettings.presets[parseInt(inp.dataset.preset)] = round(v);
      saveSettings();
    }
  });
});

// Arrow keys and presets work while popup is open
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    setRate((parseFloat(input.value) || 2) + kbSettings.smallStep);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    setRate((parseFloat(input.value) || 2) - kbSettings.smallStep);
  } else if (e.key >= '1' && e.key <= '5') {
    const preset = kbSettings.presets[parseInt(e.key) - 1];
    if (preset != null) setRate(preset);
  }
});

// Fix #7: use e.target.closest() instead of activeElement to reliably detect input elements during wheel
document.addEventListener('wheel', (e) => {
  if (e.target.closest('input, select, textarea')) return;
  e.preventDefault();
  const delta = e.deltaY < 0 ? kbSettings.smallStep : -kbSettings.smallStep;
  setRate((parseFloat(input.value) || 2) + delta);
}, { passive: false });
