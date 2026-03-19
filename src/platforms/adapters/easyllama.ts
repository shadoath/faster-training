import type { PlatformAdapter } from "../types"

export const easyLlama: PlatformAdapter = {
  matches: ["*.easyllama.com", "*.go1.com", "*.scorm.com"],
  spoofMax: 2,
  realMax: 16,
  notes: "setInterval every 3s reloads page if playbackRate > 2. Prototype getter spoof bypasses this.",
}
