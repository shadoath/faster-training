import { useState } from "preact/hooks"
import type { KbSettings } from "../../../shared/types"

const KEY_LABELS: Record<string, string> = {
  ".": "Period",
  " ": "Space",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Escape: "Esc",
  Enter: "Enter",
  Backspace: "Backspace",
  Tab: "Tab",
}

function formatShortcut(sc: KbSettings["shortcut"]): string {
  if (!sc) return "None"
  const parts: string[] = []
  if (sc.ctrl) parts.push("Ctrl")
  if (sc.shift) parts.push("Shift")
  if (sc.alt) parts.push("Alt")
  parts.push(KEY_LABELS[sc.key] ?? (sc.key ? sc.key.toUpperCase() : "?"))
  return parts.join("+")
}

interface Props {
  shortcut: KbSettings["shortcut"]
  onChange: (sc: KbSettings["shortcut"]) => void
}

export function ShortcutRecorder({ shortcut, onChange }: Props) {
  const [recording, setRecording] = useState(false)

  function startRecording() {
    setRecording(true)
  }

  function stopRecording() {
    setRecording(false)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!recording) return
    e.preventDefault()
    e.stopPropagation()

    if (e.key === "Escape") {
      onChange(null)
      stopRecording()
      return
    }

    if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return

    onChange({
      ctrl: e.ctrlKey || e.metaKey,
      shift: e.shiftKey,
      alt: e.altKey,
      key: e.key,
    })
    stopRecording()
  }

  return (
    <input
      type="text"
      id="shortcutInput"
      class={recording ? "recording" : ""}
      readonly
      placeholder="Click to record · Esc to clear"
      value={recording ? "Press shortcut…" : formatShortcut(shortcut)}
      onClick={startRecording}
      onBlur={stopRecording}
      onKeyDown={onKeyDown}
    />
  )
}
