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

export type Message = { type: "rateChanged"; rate: number }
