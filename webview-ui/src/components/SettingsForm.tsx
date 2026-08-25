import { useEffect, useState, type ReactElement } from 'react';
import type { PomoCodeSettings } from '../../../shared/protocol';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { playCompletionBeep } from '../audio';

const NATIVE_NOTIFICATION_SOUNDS: PomoCodeSettings['nativeNotificationSound'][] = [
  'None',
  'Basso',
  'Blow',
  'Bottle',
  'Frog',
  'Funk',
  'Glass',
  'Hero',
  'Morse',
  'Ping',
  'Pop',
  'Purr',
  'Sosumi',
  'Submarine',
  'Tink',
];

const COMPLETION_SOUNDS: { value: PomoCodeSettings['completionSound']; label: string }[] = [
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'digital', label: 'Digital' },
  { value: 'soft', label: 'Soft' },
];

interface SettingsFormProps {
  settings: PomoCodeSettings;
  onUpdate: (partial: Partial<PomoCodeSettings>) => void;
  onExportJson: () => void;
  onCopyJson: () => void;
  onImportJson: () => void;
}

export function SettingsForm({
  settings,
  onUpdate,
  onExportJson,
  onCopyJson,
  onImportJson,
}: SettingsFormProps): ReactElement {
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

  function handleSelectChange<K extends keyof PomoCodeSettings>(key: K, value: PomoCodeSettings[K]): void {
    setLocal((previous) => ({ ...previous, [key]: value }));
    onUpdate({ [key]: value });
  }

  return (
    <div className="settings-form">
      <h2 className="section-title">Timer &amp; Targets</h2>

      <div className="settings-grid">
        <label className="settings-field">
          <span>Focus duration (min)</span>
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
          <span>Pomodoros per round</span>
          <input
            type="number"
            min={1}
            max={12}
            value={local.sessionsBeforeLongBreak}
            onChange={(event) => handleNumberChange('sessionsBeforeLongBreak', event.target.value)}
          />
        </label>

        <label className="settings-field">
          <span>Daily pomodoro target</span>
          <input
            type="number"
            min={1}
            max={50}
            value={local.dailyTargetPomodoros}
            onChange={(event) => handleNumberChange('dailyTargetPomodoros', event.target.value)}
          />
        </label>
      </div>

      <h2 className="section-title" style={{ marginTop: '20px' }}>
        Notifications &amp; Sound
      </h2>

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
          <span>Show VS Code notifications</span>
        </label>

        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={local.enableNativeNotifications}
            onChange={(event) => handleToggle('enableNativeNotifications', event.target.checked)}
          />
          <span>Native macOS notifications (background alerts)</span>
        </label>

        {local.enableNativeNotifications && (
          <label className="settings-field settings-field--indented">
            <span>Native notification sound</span>
            <select
              value={local.nativeNotificationSound}
              onChange={(event) =>
                handleSelectChange(
                  'nativeNotificationSound',
                  event.target.value as PomoCodeSettings['nativeNotificationSound'],
                )
              }
            >
              {NATIVE_NOTIFICATION_SOUNDS.map((sound) => (
                <option key={sound} value={sound}>
                  {sound}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={local.enableSound}
            onChange={(event) => handleToggle('enableSound', event.target.checked)}
          />
          <span>Play audio sound in panel</span>
        </label>

        {local.enableSound && (
          <label className="settings-field settings-field--indented">
            <span>Panel completion sound</span>
            <select
              value={local.completionSound}
              onChange={(event) => {
                const value = event.target.value as PomoCodeSettings['completionSound'];
                handleSelectChange('completionSound', value);
                playCompletionBeep(value);
              }}
            >
              {COMPLETION_SOUNDS.map((sound) => (
                <option key={sound.value} value={sound.value}>
                  {sound.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <h2 className="section-title" style={{ marginTop: '20px' }}>
        Data Management (JSON Export &amp; Backup)
      </h2>

      <div className="data-management-card">
        <p className="data-management-desc">
          All your goals, session history, and settings can be exported to a portable JSON format or restored from backup.
        </p>

        <div className="data-actions-grid">
          <button type="button" className="btn btn--primary" onClick={onExportJson}>
            💾 Export JSON File
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCopyJson}>
            📋 Copy JSON to Clipboard
          </button>
          <button type="button" className="btn btn--secondary" onClick={onImportJson}>
            📥 Import Backup JSON
          </button>
        </div>
      </div>
    </div>
  );
}
