export interface Shortcut {
  ctrl: boolean
  shift: boolean
  alt: boolean
  key: string
}

export interface KbSettings {
  shortcut: Shortcut | null
  smallStep: number
  largeStep: number
  minSpeed: number
  maxSpeed: number
}

export type Message = { type: "rateChanged"; rate: number } | { type: "overlayToggle" }

export interface PlatformAdapter {
  /** URL patterns this adapter matches (glob patterns) */
  matches: string[]
  /** Value to report back to the platform's rate checker */
  spoofMax: number
  /** Actual maximum rate to enforce */
  realMax: number
  notes?: string
}
