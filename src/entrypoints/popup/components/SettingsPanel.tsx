import type { KbSettings } from "../../../shared/types"
import { ShortcutRecorder } from "./ShortcutRecorder"
import { StepRow } from "./StepRow"

interface Props {
  settings: KbSettings
  onSettingsChange: (updated: KbSettings) => void
}

export function SettingsPanel({ settings, onSettingsChange }: Props) {
  function update(patch: Partial<KbSettings>) {
    onSettingsChange({ ...settings, ...patch })
  }

  return (
    <div id="settingsPanel">
      <div class="shortcut-row">
        <span class="setting-label">Activate Overlay</span>
        <ShortcutRecorder
          shortcut={settings.shortcut}
          onChange={(sc) => update({ shortcut: sc })}
        />
      </div>

      <p class="speeds-header">Customize your speeds</p>

      <StepRow
        label="Small Step"
        sublabel="(Scroll)"
        id="smallStep"
        value={settings.smallStep}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(v) => update({ smallStep: v })}
      />
      <StepRow
        label="Large Step"
        sublabel="(Shift+Scroll)"
        id="largeStep"
        value={settings.largeStep}
        min={0.1}
        max={4}
        step={0.1}
        onChange={(v) => update({ largeStep: v })}
      />
      <StepRow
        label="Min Speed"
        id="minSpeed"
        value={settings.minSpeed}
        min={0.1}
        max={settings.maxSpeed - 0.1}
        step={0.1}
        onChange={(v) => update({ minSpeed: v })}
      />
      <StepRow
        label="Max Speed"
        id="maxSpeed"
        value={settings.maxSpeed}
        min={settings.minSpeed + 0.1}
        max={64}
        step={0.5}
        onChange={(v) => update({ maxSpeed: v })}
      />

      <style>{`
        #settingsPanel {
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          padding-top: 14px;
        }
        .shortcut-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .setting-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--white);
          white-space: nowrap;
          min-width: 86px;
        }
        .setting-label small {
          display: block;
          font-weight: 400;
          color: var(--muted);
          font-size: 11px;
          margin-top: 2px;
        }
        #shortcutInput {
          flex: 1;
          height: 42px;
          background: var(--blue);
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          text-align: center;
          cursor: pointer;
          outline: none;
        }
        #shortcutInput.recording {
          background: #000000;
          color: #ffffff;
          border: 2px solid #ffffff;
        }
        .speeds-header {
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--blue);
          margin-bottom: 12px;
        }
        .setting-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .step-control {
          flex: 1;
          height: 42px;
          border: 1.5px solid var(--blue-border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .step-btn {
          background: none;
          border: none;
          outline: none;
          cursor: pointer;
          width: 36px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          opacity: 0.75;
          transition: opacity 0.15s, background 0.15s;
        }
        .step-btn:hover { opacity: 1; background: var(--blue-faint); }
        .step-btn img { width: 18px; height: auto; display: block; }
        .step-input {
          flex: 1;
          height: 100%;
          background: transparent;
          border: none;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--white);
          outline: none;
          -moz-appearance: textfield;
        }
        .step-input::-webkit-outer-spin-button,
        .step-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .flip-h { transform: scaleX(-1); }
      `}</style>
    </div>
  )
}
