import type { KbSettings } from "./types"
import { DEFAULT_RATE, DEFAULT_KB_SETTINGS } from "./defaults"

export async function getRate(): Promise<number> {
  const data = await chrome.storage.local.get("playbackRate")
  return (data.playbackRate as number) ?? DEFAULT_RATE
}

export async function setRate(rate: number): Promise<void> {
  await chrome.storage.local.set({ playbackRate: rate })
}

export async function getSettings(): Promise<KbSettings> {
  const data = await chrome.storage.local.get("kbSettings")
  return { ...DEFAULT_KB_SETTINGS, ...((data.kbSettings as Partial<KbSettings>) ?? {}) }
}

export async function setSettings(s: KbSettings): Promise<void> {
  await chrome.storage.local.set({ kbSettings: s })
}

export async function getAll(): Promise<{ rate: number; settings: KbSettings }> {
  const data = await chrome.storage.local.get(["playbackRate", "kbSettings"])
  return {
    rate: (data.playbackRate as number) ?? DEFAULT_RATE,
    settings: { ...DEFAULT_KB_SETTINGS, ...((data.kbSettings as Partial<KbSettings>) ?? {}) },
  }
}
