import { useEffect, useState, type ReactElement } from 'react';
import type { PomoCodeSettings } from '../../../shared/protocol';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';

interface SettingsFormProps {
  settings: PomoCodeSettings;
  onUpdate: (partial: Partial<PomoCodeSettings>) => void;
}

export function SettingsForm({ settings, onUpdate }: SettingsFormProps): ReactElement {
  const [local, setLocal] = useState(settings);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const debouncedUpdate = useDebouncedCallback((partial: Partial<PomoCodeSettings>) => onUpdate(partial), 400);

  function handleNumberChange(key: keyof PomoCodeSettings, rawValue: string): void {
    const value = Number(rawValue);
    if (Number.isNaN(value)) {
      return;
    }
    setLocal((previous) => ({ ...previous, [key]: value }));
    debouncedUpdate({ [key]: value });
  }

  function handleToggle(key: keyof PomoCodeSettings, checked: boolean): void {
    setLocal((previous) => ({ ...previous, [key]: checked }));
    onUpdate({ [key]: checked });
  }

  return (
    <div className="settings-form">
      <h2 className="section-title">Settings</h2>

      <div className="settings-grid">
        <label className="settings-field">
          <span>Focus (min)</span>
          <input
            type="number"
            min={1}
            max={180}
            value={local.focusDuration}
            onChange={(event) => handleNumberChange('focusDuration', event.target.value)}
          />
        </label>

        <label className="settings-field">
          <span>Short break (min)</span>
          <input
            type="number"
            min={1}
            max={60}
            value={local.shortBreakDuration}
            onChange={(event) => handleNumberChange('shortBreakDuration', event.target.value)}
          />
        </label>

        <label className="settings-field">
          <span>Long break (min)</span>
          <input
            type="number"
            min={1}
            max={120}
            value={local.longBreakDuration}
            onChange={(event) => handleNumberChange('longBreakDuration', event.target.value)}
          />
        </label>

        <label className="settings-field">
          <span>Sessions before long break</span>
          <input
            type="number"
            min={1}
            max={12}
            value={local.sessionsBeforeLongBreak}
            onChange={(event) => handleNumberChange('sessionsBeforeLongBreak', event.target.value)}
          />
        </label>
      </div>

      <div className="settings-toggles">
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={local.autoStartNextSession}
            onChange={(event) => handleToggle('autoStartNextSession', event.target.checked)}
          />
          <span>Auto-start next session</span>
        </label>

        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={local.enableNotifications}
            onChange={(event) => handleToggle('enableNotifications', event.target.checked)}
          />
          <span>Show notifications</span>
        </label>

        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={local.enableNativeNotifications}
            onChange={(event) => handleToggle('enableNativeNotifications', event.target.checked)}
          />
          <span>Native macOS notifications (background alerts)</span>
        </label>

        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={local.enableSound}
            onChange={(event) => handleToggle('enableSound', event.target.checked)}
          />
          <span>Play sound (panel must be open)</span>
        </label>
      </div>
    </div>
  );
}
