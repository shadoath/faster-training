import { useRef } from "preact/hooks"
import type { KbSettings } from "../../../shared/types"

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
    <div class="controls">
      <button
        class="btn-icon large"
        title="Large step back"
        onClick={() => onRateChange(rate - settings.largeStep)}
      >
        <img src="icons/big-step.png" class="flip-h" alt="«" />
      </button>
      <button
        class="btn-icon"
        title="Small step back"
        onClick={() => onRateChange(rate - settings.smallStep)}
      >
        <img src="icons/small-step.png" class="flip-h" alt="‹" />
      </button>

      <div class="speed-circle">
        <input
          type="number"
          id="speed"
          min={settings.minSpeed}
          max={settings.maxSpeed}
          step={settings.smallStep}
          value={rate}
          onChange={handleInputChange}
          onWheel={handleWheel}
        />
      </div>

      <button
        class="btn-icon"
        title="Small step forward"
        onClick={() => onRateChange(rate + settings.smallStep)}
      >
        <img src="icons/small-step.png" alt="›" />
      </button>
      <button
        class="btn-icon large"
        title="Large step forward"
        onClick={() => onRateChange(rate + settings.largeStep)}
      >
        <img src="icons/big-step.png" alt="»" />
      </button>

      <style>{`
        .controls {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          margin-bottom: 14px;
        }
        .btn-icon {
          background: none;
          border: none;
          outline: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          opacity: 0.65;
          transition: opacity 0.15s, background 0.15s;
        }
        .btn-icon:hover { opacity: 1; background: var(--blue-faint); }
        .btn-icon img { height: 28px; width: auto; display: block; }
        .btn-icon.large img { height: 30px; }
        .flip-h { transform: scaleX(-1); }
        .speed-circle {
          width: 60px;
          height: 60px;
          background: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        #speed {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: none;
          background: transparent;
          text-align: center;
          font-family: "Montserrat", sans-serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          color: var(--ink);
          outline: none;
          -moz-appearance: textfield;
        }
        #speed::-webkit-outer-spin-button,
        #speed::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  )
}
