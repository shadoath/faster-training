const input = document.getElementById('speed');
const buttons = document.querySelectorAll('button[data-delta]');

// Speed controls
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function round(val) {
  return Math.round(val * 10) / 10;
}

function setRate(rate) {
  rate = clamp(round(rate), 0.1, 16);
  input.value = rate;
  chrome.storage.local.set({ playbackRate: rate });
}

chrome.storage.local.get('playbackRate', (data) => {
  input.value = data.playbackRate || 2;
});

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const delta = parseFloat(btn.dataset.delta);
    const current = parseFloat(input.value) || 2;
    setRate(current + delta);
  });
});

input.addEventListener('change', () => {
  setRate(parseFloat(input.value) || 2);
});

input.addEventListener('wheel', (e) => {
  e.preventDefault();
  const current = parseFloat(input.value) || 2;
  const delta = e.deltaY < 0 ? 0.1 : -0.1;
  setRate(current + delta);
});

// ---- Settings Panel ----

const DEFAULT_KB_SETTINGS = {
  shortcut: { ctrl: true, shift: true, alt: false, key: '.' },
  step: 0.25,
  minSpeed: 0.25,
  maxSpeed: 3,
  showOverlay: true
};

const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const shortcutInput = document.getElementById('shortcutInput');
const stepSelect = document.getElementById('stepSelect');
const minSpeedInput = document.getElementById('minSpeed');
const maxSpeedInput = document.getElementById('maxSpeed');
const showOverlayCheck = document.getElementById('showOverlay');

let kbSettings = Object.assign({}, DEFAULT_KB_SETTINGS);
let recordingShortcut = false;

function formatShortcut(sc) {
  const parts = [];
  if (sc.ctrl) parts.push('Ctrl');
  if (sc.shift) parts.push('Shift');
  if (sc.alt) parts.push('Alt');
  const keyLabel = sc.key === '.' ? 'Period' : sc.key.toUpperCase();
  parts.push(keyLabel);
  return parts.join('+');
}

function populateSettings(s) {
  shortcutInput.value = formatShortcut(s.shortcut);
  const stepOption = stepSelect.querySelector(`option[value="${s.step}"]`);
  if (stepOption) stepOption.selected = true;
  minSpeedInput.value = s.minSpeed;
  maxSpeedInput.value = s.maxSpeed;
  showOverlayCheck.checked = s.showOverlay;
}

function saveSettings() {
  chrome.storage.local.set({ kbSettings });
}

// Load settings
chrome.storage.local.get('kbSettings', (data) => {
  if (data.kbSettings) Object.assign(kbSettings, data.kbSettings);
  populateSettings(kbSettings);
});

// Toggle settings panel
settingsToggle.addEventListener('click', () => {
  const open = settingsPanel.style.display === 'block';
  settingsPanel.style.display = open ? 'none' : 'block';
  settingsToggle.classList.toggle('open', !open);
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

  // Ignore standalone modifier keys
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

// Step change
stepSelect.addEventListener('change', () => {
  kbSettings.step = parseFloat(stepSelect.value);
  saveSettings();
});

// Min/max speed
minSpeedInput.addEventListener('change', () => {
  const v = parseFloat(minSpeedInput.value);
  if (!isNaN(v) && v > 0) {
    kbSettings.minSpeed = Math.round(v * 100) / 100;
    saveSettings();
  }
});

maxSpeedInput.addEventListener('change', () => {
  const v = parseFloat(maxSpeedInput.value);
  if (!isNaN(v) && v > kbSettings.minSpeed) {
    kbSettings.maxSpeed = Math.round(v * 100) / 100;
    saveSettings();
  }
});

// Overlay toggle
showOverlayCheck.addEventListener('change', () => {
  kbSettings.showOverlay = showOverlayCheck.checked;
  saveSettings();
});
