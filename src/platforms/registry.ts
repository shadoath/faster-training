import type { PlatformAdapter } from "./types"
import { easyLlama } from "./adapters/easyllama"

export const PLATFORM_ADAPTERS: PlatformAdapter[] = [easyLlama]

/**
 * Returns the adapter for the current page URL, or null if none matches.
 * Glob patterns like "*.example.com" are supported.
 */
export function getAdapter(url: string): PlatformAdapter | null {
  for (const adapter of PLATFORM_ADAPTERS) {
    for (const pattern of adapter.matches) {
      const regex = new RegExp(
        "^" + pattern.replace(/\./g, "\\.").replace(/\*/g, "[^.]+") + "$",
      )
      try {
        const host = new URL(url).hostname
        if (regex.test(host)) return adapter
      } catch {
        // invalid URL, skip
      }
    }
  }
  return null
}
