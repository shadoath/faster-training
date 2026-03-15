// Content script - handles storage, sets playback rate, keyboard overlay
let currentRate = 2;
let kbSettings = {
  shortcut: { ctrl: true, shift: true, alt: false, key: '.' },
  step: 0.25,
  minSpeed: 0.25,
  maxSpeed: 3,
  showOverlay: true
};

chrome.storage.local.get(['playbackRate', 'kbSettings'], (data) => {
  currentRate = data.playbackRate || 2;
  if (data.kbSettings) Object.assign(kbSettings, data.kbSettings);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.playbackRate) currentRate = changes.playbackRate.newValue;
  if (changes.kbSettings) Object.assign(kbSettings, changes.kbSettings.newValue);
});

setInterval(() => {
  document.querySelectorAll('audio, video').forEach(media => {
    media.playbackRate = currentRate;
  });
}, 1000);

// ---- Keyboard Speed Overlay ----

let overlayEl = null;
let overlayActive = false;
let inputBuffer = '';
let inactivityTimer = null;

function getOrCreateOverlay() {
  if (!overlayEl) {
    overlayEl = document.createElement('div');
    overlayEl.id = '__pf_overlay__';
    overlayEl.style.cssText = [
      'position:fixed',
      'top:16px',
      'right:16px',
      'background:rgba(0,0,0,0.82)',
      'color:#fff',
      'border-radius:10px',
      'padding:12px 24px',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'text-align:center',
      'z-index:2147483647',
      'pointer-events:none',
      'min-width:130px',
      'box-shadow:0 4px 16px rgba(0,0,0,0.4)',
      'transition:opacity 0.15s ease',
      'opacity:0'
    ].join(';');
    (document.body || document.documentElement).appendChild(overlayEl);
  }
  return overlayEl;
}

function renderOverlay(rate, buffer) {
  const el = getOrCreateOverlay();
  const speedText = buffer !== undefined
    ? (buffer === '' ? '\u2014' : buffer + 'x')
    : rate.toFixed(2) + 'x';
  el.innerHTML =
    '<div style="font-size:10px;font-weight:700;letter-spacing:.1em;color:#9ca3af;margin-bottom:6px">PLAYBACK SPEED</div>' +
    '<div style="font-size:24px;font-weight:700;letter-spacing:-.5px">' + speedText + '</div>';
}

function showOverlay() {
  if (!kbSettings.showOverlay) return;
  overlayActive = true;
  inputBuffer = '';
  renderOverlay(currentRate);
  const el = getOrCreateOverlay();
  el.style.opacity = '0';
  requestAnimationFrame(() => { el.style.opacity = '1'; });
  resetInactivity();
}

function hideOverlay() {
  overlayActive = false;
  inputBuffer = '';
  clearTimeout(inactivityTimer);
  if (overlayEl) {
    overlayEl.style.opacity = '0';
    const el = overlayEl;
    overlayEl = null;
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 150);
  }
}

function resetInactivity() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(hideOverlay, 2000);
}

function applyRate(rate) {
  const clamped = Math.max(kbSettings.minSpeed, Math.min(kbSettings.maxSpeed,
    Math.round(rate * 100) / 100));
  currentRate = clamped;
  chrome.storage.local.set({ playbackRate: clamped });
  return clamped;
}

function matchesActivationShortcut(e) {
  const sc = kbSettings.shortcut;
  const ctrlOk = sc.ctrl ? (e.ctrlKey || e.metaKey) : (!e.ctrlKey && !e.metaKey);
  const shiftOk = sc.shift ? e.shiftKey : !e.shiftKey;
  const altOk = (sc.alt || false) ? e.altKey : !e.altKey;
  return ctrlOk && shiftOk && altOk && e.key === sc.key;
}

document.addEventListener('keydown', function(e) {
  if (matchesActivationShortcut(e)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    overlayActive ? hideOverlay() : showOverlay();
    return;
  }

  if (!overlayActive) return;
  e.preventDefault();
  e.stopImmediatePropagation();

  switch (e.key) {
    case 'ArrowRight':
      inputBuffer = '';
      applyRate(currentRate + kbSettings.step);
      renderOverlay(currentRate);
      resetInactivity();
      break;
    case 'ArrowLeft':
      inputBuffer = '';
      applyRate(currentRate - kbSettings.step);
      renderOverlay(currentRate);
      resetInactivity();
      break;
    case 'Enter':
      if (inputBuffer) {
        const v = parseFloat(inputBuffer);
        if (!isNaN(v)) applyRate(v);
      }
      hideOverlay();
      break;
    case 'Escape':
      hideOverlay();
      break;
    case 'Backspace':
      inputBuffer = inputBuffer.slice(0, -1);
      renderOverlay(currentRate, inputBuffer);
      resetInactivity();
      break;
    default:
      if (/^[0-9]$/.test(e.key)) {
        inputBuffer += e.key;
        renderOverlay(currentRate, inputBuffer);
        resetInactivity();
      } else if (e.key === '.' && !inputBuffer.includes('.')) {
        inputBuffer += '.';
        renderOverlay(currentRate, inputBuffer);
        resetInactivity();
      }
  }
}, true);
