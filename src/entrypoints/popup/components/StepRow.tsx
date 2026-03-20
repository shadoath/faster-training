import styles from "./StepRow.module.css"

interface Props {
  label: string
  sublabel?: string
  id: string
  value: number
  min: number
  max: number
  step: number
  onChange: (val: number) => void
}

const round = (v: number) => Math.round(v * 100) / 100

export function StepRow({ label, sublabel, id, value, min, max, step, onChange }: Props) {
  const clampedChange = (next: number) => {
    const clamped = Math.max(min, Math.min(max, round(next)))
    onChange(clamped)
  }

  const handleInputChange = (e: Event) => {
    const v = parseFloat((e.target as HTMLInputElement).value)
    if (!isNaN(v)) clampedChange(v)
  }

  return (
    <div class={styles.settingRow}>
      <span class={styles.settingLabel}>
        {label}
        {sublabel && <small>{sublabel}</small>}
      </span>
      <div class={styles.stepControl}>
        <button
          class={styles.stepBtn}
          onClick={() => clampedChange(value - step)}
          aria-label={`Decrease ${label}`}
        >
          <img src="icons/blue-adjust-triangle.png" class={styles.flipH} alt="−" />
        </button>
        <input
          type="number"
          class={styles.stepInput}
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
        />
        <button
          class={styles.stepBtn}
          onClick={() => clampedChange(value + step)}
          aria-label={`Increase ${label}`}
        >
          <img src="icons/blue-adjust-triangle.png" alt="+" />
        </button>
      </div>
    </div>
  )
}
