import { useRef } from "preact/hooks"
import type { KbSettings } from "../../../shared/types"
import styles from "./SpeedControl.module.css"

interface Props {
  rate: number
  settings: KbSettings
  onRateChange: (rate: number) => void
}

export function SpeedControl({ rate, settings, onRateChange }: Props) {
  const lastWheelRef = useRef(0)

  function handleInputChange(e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value)
    if (!isNaN(val) && val > 0) onRateChange(val)
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault()
    const now = Date.now()
    if (now - lastWheelRef.current < 200) return
    lastWheelRef.current = now
    const delta = e.deltaY < 0 ? settings.smallStep : -settings.smallStep
    onRateChange(rate + delta)
  }

  return (
    <div class={styles.controls}>
      <button
        class={`${styles.btnIcon} ${styles.large}`}
        title="Large step back"
        onClick={() => onRateChange(rate - settings.largeStep)}
      >
        <img src="icons/big-step.png" class={styles.flipH} alt="«" />
      </button>
      <button
        class={styles.btnIcon}
        title="Small step back"
        onClick={() => onRateChange(rate - settings.smallStep)}
      >
        <img src="icons/small-step.png" class={styles.flipH} alt="‹" />
      </button>

      <div class={styles.speedCircle}>
        <input
          type="number"
          class={styles.speed}
          min={settings.minSpeed}
          max={settings.maxSpeed}
          step={settings.smallStep}
          value={rate}
          onChange={handleInputChange}
          onWheel={handleWheel}
        />
      </div>

      <button
        class={styles.btnIcon}
        title="Small step forward"
        onClick={() => onRateChange(rate + settings.smallStep)}
      >
        <img src="icons/small-step.png" alt="›" />
      </button>
      <button
        class={`${styles.btnIcon} ${styles.large}`}
        title="Large step forward"
        onClick={() => onRateChange(rate + settings.largeStep)}
      >
        <img src="icons/big-step.png" alt="»" />
      </button>
    </div>
  )
}
