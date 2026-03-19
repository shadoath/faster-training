import { useEffect, useRef, useState } from "preact/hooks"
import { DEFAULT_KB_SETTINGS, DEFAULT_RATE } from "../../shared/defaults"
import { getAll, setRate, setSettings } from "../../shared/storage"
import type { KbSettings, Message } from "../../shared/types"
import { SpeedControl } from "./components/SpeedControl"
import { SettingsPanel } from "./components/SettingsPanel"

export function App() {
  const [rate, setLocalRate] = useState(DEFAULT_RATE)
  const [settings, setLocalSettings] = useState<KbSettings>(DEFAULT_KB_SETTINGS)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Refs for access inside event listeners without stale closure
  const rateRef = useRef(rate)
  const settingsRef = useRef(settings)
  rateRef.current = rate
  settingsRef.current = settings

  const lastWheelRef = useRef(0)

  useEffect(() => {
    getAll().then(({ rate: r, settings: s }) => {
      setLocalRate(r)
      setLocalSettings(s)
    })

    const onChanged = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (changes.playbackRate) setLocalRate(changes.playbackRate.newValue as number)
      if (changes.kbSettings) {
        setLocalSettings({
          ...DEFAULT_KB_SETTINGS,
          ...((changes.kbSettings.newValue as Partial<KbSettings>) ?? {}),
        })
      }
    }
    chrome.storage.onChanged.addListener(onChanged)

    // Body-level wheel: adjust speed when not scrolling inside a form element
    function onWheel(e: WheelEvent) {
      if ((e.target as Element).closest("input, select, textarea")) return
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheelRef.current < 200) return
      lastWheelRef.current = now
      const raw = e.shiftKey ? -e.deltaX : e.deltaY
      const step = e.shiftKey ? settingsRef.current.largeStep : settingsRef.current.smallStep
      applyRateImmediate(rateRef.current + (raw < 0 ? step : -step))
    }

    // Body-level arrow keys: increment/decrement when not focused on a form element
    function onKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement as Element)?.tagName
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return
      if (e.key === "ArrowUp") {
        e.preventDefault()
        applyRateImmediate(rateRef.current + settingsRef.current.smallStep)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        applyRateImmediate(rateRef.current - settingsRef.current.smallStep)
      }
    }

    document.addEventListener("wheel", onWheel, { passive: false })
    document.addEventListener("keydown", onKeyDown)

    return () => {
      chrome.storage.onChanged.removeListener(onChanged)
      document.removeEventListener("wheel", onWheel)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  function applyRateImmediate(newRate: number) {
    const s = settingsRef.current
    const clamped = Math.max(s.minSpeed, Math.min(s.maxSpeed, Math.round(newRate * 100) / 100))
    rateRef.current = clamped
    setLocalRate(clamped)
    setRate(clamped)
    chrome.runtime.sendMessage({ type: "rateChanged", rate: clamped } as Message).catch(() => {})
  }

  function applyRate(newRate: number) {
    applyRateImmediate(newRate)
  }

  function applySettings(updated: KbSettings) {
    setLocalSettings(updated)
    setSettings(updated)
  }

  return (
    <div class="popup-wrapper">
      <div class="top-icon">
        <img src="icons/playfaster-icon.png" alt="" />
      </div>

      <button
        id="gearBtn"
        class={settingsOpen ? "open" : ""}
        title="Settings"
        onClick={() => setSettingsOpen((o) => !o)}
      >
        <img src="icons/gear.png" alt="Settings" />
      </button>

      <a href="https://playfaster.app" target="_blank" rel="noopener" class="title">
        <span class="title-play">Play</span>
        <span class="title-faster">Faster</span>
      </a>

      <SpeedControl rate={rate} settings={settings} onRateChange={applyRate} />

      <p class="scroll-hint">Scroll to adjust speed</p>

      {settingsOpen && <SettingsPanel settings={settings} onSettingsChange={applySettings} />}

      <div class="footer">
        <a href="https://whiteboardworks.com" target="_blank" rel="noopener">
          whiteboardworks.com
        </a>
      </div>

      <style>{`
        .popup-wrapper {
          border: 2px solid var(--blue-border);
          border-radius: 20px;
          padding: 16px 20px 16px;
          position: relative;
        }
        .top-icon {
          position: absolute;
          top: -17px;
          left: 50%;
          transform: translateX(-50%);
          width: 48px;
          height: 28px;
          background: var(--bg);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .top-icon img {
          width: 35px;
          height: 35px;
          margin-bottom: -8px;
        }
        .title {
          display: block;
          text-align: center;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          margin-top: 8px;
          text-decoration: none;
        }
        .title-play { color: var(--blue); font-style: italic; }
        .title-faster { color: var(--white); }
        #gearBtn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          padding: 4px;
          border: none;
          outline: none;
          background: none;
          cursor: pointer;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.75;
          transition: opacity 0.15s, background 0.15s;
        }
        #gearBtn:hover { opacity: 1; background: var(--blue-faint); }
        #gearBtn.open { opacity: 1; }
        #gearBtn img { width: 24px; height: 24px; }
        .scroll-hint {
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--blue);
          letter-spacing: 0.01em;
          margin-bottom: 16px;
          -webkit-font-smoothing: antialiased;
        }
        .footer {
          margin-top: 14px;
          text-align: center;
          font-size: 10px;
          color: #374151;
        }
        .footer a { color: #374151; text-decoration: none; }
        .footer a:hover { color: var(--muted); }
      `}</style>
    </div>
  )
}
