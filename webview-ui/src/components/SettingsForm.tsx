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
  onPreviewNativeSound: (sound: PomoCodeSettings['nativeNotificationSound']) => void;
  onExportJson: () => void;
  onCopyJson: () => void;
  onImportJson: () => void;
  onClearData: (scope: 'today' | 'week' | 'all') => void;
}

export function SettingsForm({
  settings,
  onUpdate,
  onPreviewNativeSound,
  onExportJson,
  onCopyJson,
  onImportJson,
  onClearData,
}: SettingsFormProps): ReactElement {
  const [local, setLocal] = useState(settings);
  const [clearScopeToConfirm, setClearScopeToConfirm] = useState<'today' | 'week' | 'all' | null>(null);

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

  function handleConfirmClear(): void {
    if (clearScopeToConfirm) {
      onClearData(clearScopeToConfirm);
      setClearScopeToConfirm(null);
    }
  }

  const clearScopeLabels: Record<'today' | 'week' | 'all', { title: string; desc: string; btn: string }> = {
    today: {
      title: "Clear Today's History",
      desc: 'Are you sure you want to delete all session history recorded today? This cannot be undone.',
      btn: "Delete Today's Data",
    },
    week: {
      title: "Clear This Week's History",
      desc: 'Are you sure you want to delete all session history from this current week? This cannot be undone.',
      btn: "Delete Week's Data",
    },
    all: {
      title: 'Clear All Session History',
      desc: 'Are you sure you want to permanently erase ALL session history? This action is permanent and cannot be undone.',
      btn: 'Delete All History',
    },
  };

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
          <div className="settings-field settings-field--indented">
            <span>Native notification sound</span>
            <div className="sound-select-row">
              <select
                value={local.nativeNotificationSound}
                onChange={(event) => {
                  const sound = event.target.value as PomoCodeSettings['nativeNotificationSound'];
                  handleSelectChange('nativeNotificationSound', sound);
                  onPreviewNativeSound(sound);
                }}
              >
                {NATIVE_NOTIFICATION_SOUNDS.map((sound) => (
                  <option key={sound} value={sound}>
                    {sound}
                  </option>
                ))}
              </select>
              {local.nativeNotificationSound !== 'None' && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  title="Test notification sound"
                  onClick={() => onPreviewNativeSound(local.nativeNotificationSound)}
                >
                  🔊 Test
                </button>
              )}
            </div>
          </div>
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
          <div className="settings-field settings-field--indented">
            <span>Panel completion sound</span>
            <div className="sound-select-row">
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
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                title="Test panel sound"
                onClick={() => playCompletionBeep(local.completionSound)}
              >
                🔊 Test
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 className="section-title" style={{ marginTop: '20px' }}>
        Data Management &amp; Backup
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

      <h2 className="section-title section-title--danger" style={{ marginTop: '20px' }}>
        Clear History &amp; Data
      </h2>

      <div className="data-management-card data-management-card--danger">
        <p className="data-management-desc">
          Remove historical records to reset your daily, weekly, or overall stats. Confirmation is required.
        </p>

        <div className="data-actions-grid">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setClearScopeToConfirm('today')}
          >
            🗑️ Clear Today's History
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setClearScopeToConfirm('week')}
          >
            🗑️ Clear This Week's History
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => setClearScopeToConfirm('all')}
          >
            ⚠️ Clear All History
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {clearScopeToConfirm && (
        <div className="confirm-modal-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <div className="confirm-modal-icon">⚠️</div>
            <div className="confirm-modal-content">
              <h4>{clearScopeLabels[clearScopeToConfirm].title}</h4>
              <p>{clearScopeLabels[clearScopeToConfirm].desc}</p>
            </div>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setClearScopeToConfirm(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleConfirmClear}
              >
                {clearScopeLabels[clearScopeToConfirm].btn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
