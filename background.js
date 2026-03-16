// Inject script into main world on every navigation
chrome.webNavigation.onCommitted.addListener((details) => {
  chrome.scripting.executeScript({
    target: { tabId: details.tabId, frameIds: [details.frameId] },
    files: ['inject.js'],
    world: 'MAIN',
    injectImmediately: true
  }).catch(() => {}); // Ignore errors for frames we can't access
});

function updateBadge(rate) {
  const text = rate === 1 ? '' : rate.toString().replace(/\.?0+$/, '') + 'x';
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
}

chrome.storage.local.get('playbackRate', (data) => {
  updateBadge(data.playbackRate || 2);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.playbackRate) {
    updateBadge(changes.playbackRate.newValue);
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'rateChanged') updateBadge(msg.rate);
});
