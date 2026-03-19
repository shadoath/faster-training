export interface PlatformAdapter {
  /** URL patterns this adapter matches (glob-style, e.g. "*.easyllama.com") */
  matches: string[]
  /** What to report to the platform's rate checker (hides the real rate) */
  spoofMax: number
  /** Actual ceiling to enforce when setting rate */
  realMax: number
  notes?: string
}
