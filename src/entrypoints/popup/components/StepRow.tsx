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

function round(v: number) {
  return Math.round(v * 100) / 100
}

export function StepRow({ label, sublabel, id, value, min, max, step, onChange }: Props) {
  function clampedChange(next: number) {
    const clamped = Math.max(min, Math.min(max, round(next)))
    onChange(clamped)
  }

  function handleInputChange(e: Event) {
    const v = parseFloat((e.target as HTMLInputElement).value)
    if (!isNaN(v)) clampedChange(v)
  }

  return (
    <div class="setting-row">
      <span class="setting-label">
        {label}
        {sublabel && <small>{sublabel}</small>}
      </span>
      <div class="step-control">
        <button
          class="step-btn"
          onClick={() => clampedChange(value - step)}
          aria-label={`Decrease ${label}`}
        >
          <img src="icons/blue-adjust-triangle.png" class="flip-h" alt="−" />
        </button>
        <input
          type="number"
          class="step-input"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
        />
        <button
          class="step-btn"
          onClick={() => clampedChange(value + step)}
          aria-label={`Increase ${label}`}
        >
          <img src="icons/blue-adjust-triangle.png" alt="+" />
        </button>
      </div>
    </div>
  )
}
