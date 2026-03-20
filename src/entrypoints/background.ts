import { DEFAULT_RATE, DEFAULT_KB_SETTINGS } from "../shared/defaults"
import type { Message } from "../shared/types"

export default defineBackground(() => {
  // Ensure storage has defaults on install and startup
  function ensureDefaults() {
    chrome.storage.local.get(["playbackRate", "kbSettings"], (data) => {
      const updates: Record<string, unknown> = {}

      if (data.playbackRate === undefined) {
        updates.playbackRate = DEFAULT_RATE
      }

      if (!data.kbSettings || typeof data.kbSettings !== "object") {
        updates.kbSettings = { ...DEFAULT_KB_SETTINGS }
      } else {
        const merged = { ...DEFAULT_KB_SETTINGS, ...data.kbSettings }
        if (JSON.stringify(merged) !== JSON.stringify(data.kbSettings)) {
          updates.kbSettings = merged
        }
      }

      if (Object.keys(updates).length > 0) {
        chrome.storage.local.set(updates)
      }
    })
  }

  ensureDefaults()
  chrome.runtime.onInstalled.addListener(ensureDefaults)
  chrome.runtime.onStartup.addListener(ensureDefaults)

  // Inject prototype spoof into page world on every navigation
  chrome.webNavigation.onCommitted.addListener((details) => {
    chrome.scripting
      .executeScript({
        target: { tabId: details.tabId, frameIds: [details.frameId] },
        files: ["inject.js"],
        world: "MAIN",
        injectImmediately: true,
      })
      .catch(() => {}) // ignore frames we can't access (chrome-extension://, etc.)
  })

  // Badge shows current speed (blank at 1x)
  function updateBadge(rate: number) {
    const text = rate === 1 ? "" : `${rate.toString().replace(/\.?0+$/, "")}`
    chrome.action.setBadgeText({ text })
    chrome.action.setBadgeBackgroundColor({ color: "#ffffff" })
  }

  chrome.storage.local.get("playbackRate", (data) => {
    updateBadge((data.playbackRate as number) || DEFAULT_RATE)
  })

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.playbackRate) {
      updateBadge(changes.playbackRate.newValue as number)
    }
  })

  chrome.runtime.onMessage.addListener((msg: Message) => {
    if (msg.type === "rateChanged") updateBadge(msg.rate)
  })
})
