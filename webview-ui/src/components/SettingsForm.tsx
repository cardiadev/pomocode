import { useEffect, useState, type ReactElement } from 'react';
import type { PomoCodeSettings } from '../../../shared/protocol';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { playCompletionBeep } from '../audio';
import { NumberField } from './NumberField';
import { WarningIcon } from './Icons';

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

const FONT_OPTIONS: { value: string; label: string }[] = [
  { value: 'Google Sans', label: 'Google Sans (Default)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Fira Code', label: 'Fira Code (Monospace)' },
  { value: 'system-ui', label: 'System Default' },
];

const DEFAULT_COLORS = {
  accentColor: '#f97316',
  focusColor: '#f97316',
  shortBreakColor: '#22c55e',
  longBreakColor: '#38bdf8',
};

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

  function handleNumberChange(key: keyof PomoCodeSettings, value: number): void {
    setLocal((previous) => ({ ...previous, [key]: value }));
    debouncedUpdate({ [key]: value });
  }

  function handleColorChange(
    key: 'accentColor' | 'focusColor' | 'shortBreakColor' | 'longBreakColor',
    color: string
  ): void {
    setLocal((previous) => ({ ...previous, [key]: color }));
    debouncedUpdate({ [key]: color });
  }

  function handleResetColors(): void {
    setLocal((previous) => ({ ...previous, ...DEFAULT_COLORS }));
    onUpdate(DEFAULT_COLORS);
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

  const clearScopeLabels: Record<'today' | 'week' | 'all', { title: string; desc: string }> = {
    today: {
      title: "Clear Today's History",
      desc: 'Are you sure you want to delete all session history recorded today? This cannot be undone.',
    },
    week: {
      title: "Clear This Week's History",
      desc: 'Are you sure you want to delete all session history from this current week? This cannot be undone.',
    },
    all: {
      title: 'Clear All Session History',
      desc: 'Are you sure you want to permanently erase ALL session history? This action is permanent and cannot be undone.',
    },
  };

  return (
    <div className="settings-form">
      <h2 className="section-title">Timer &amp; Targets</h2>

      <div className="settings-grid">
        <NumberField
          label="Focus duration"
          unit="min"
          min={1}
          max={180}
          value={local.focusDuration}
          onChange={(val) => handleNumberChange('focusDuration', val)}
        />

        <NumberField
          label="Short break"
          unit="min"
          min={1}
          max={60}
          value={local.shortBreakDuration}
          onChange={(val) => handleNumberChange('shortBreakDuration', val)}
        />

        <NumberField
          label="Long break"
          unit="min"
          min={1}
          max={120}
          value={local.longBreakDuration}
          onChange={(val) => handleNumberChange('longBreakDuration', val)}
        />

        <NumberField
          label="Pomodoros per round"
          min={1}
          max={12}
          value={local.sessionsBeforeLongBreak}
          onChange={(val) => handleNumberChange('sessionsBeforeLongBreak', val)}
        />

        <NumberField
          label="Daily pomodoro target"
          min={1}
          max={50}
          value={local.dailyTargetPomodoros}
          onChange={(val) => handleNumberChange('dailyTargetPomodoros', val)}
        />
      </div>

      <h2 className="section-title" style={{ marginTop: '20px' }}>
        Appearance &amp; Theme
      </h2>

      <div className="theme-customization-card">
        <div className="settings-field">
          <span>Font family</span>
          <select
            value={local.fontFamily || 'Google Sans'}
            onChange={(e) => handleSelectChange('fontFamily', e.target.value)}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        <div className="color-pickers-grid">
          <div className="color-picker-item">
            <span className="color-picker-label">Accent / Active</span>
            <div className="color-picker-control">
              <input
                type="color"
                className="color-picker-input"
                value={local.accentColor || '#f97316'}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                aria-label="Accent Color"
              />
              <span className="color-picker-hex">{local.accentColor || '#f97316'}</span>
            </div>
          </div>

          <div className="color-picker-item">
            <span className="color-picker-label">Focus Session</span>
            <div className="color-picker-control">
              <input
                type="color"
                className="color-picker-input"
                value={local.focusColor || '#f97316'}
                onChange={(e) => handleColorChange('focusColor', e.target.value)}
                aria-label="Focus Session Color"
              />
              <span className="color-picker-hex">{local.focusColor || '#f97316'}</span>
            </div>
          </div>

          <div className="color-picker-item">
            <span className="color-picker-label">Short Break</span>
            <div className="color-picker-control">
              <input
                type="color"
                className="color-picker-input"
                value={local.shortBreakColor || '#22c55e'}
                onChange={(e) => handleColorChange('shortBreakColor', e.target.value)}
                aria-label="Short Break Color"
              />
              <span className="color-picker-hex">{local.shortBreakColor || '#22c55e'}</span>
            </div>
          </div>

          <div className="color-picker-item">
            <span className="color-picker-label">Long Break</span>
            <div className="color-picker-control">
              <input
                type="color"
                className="color-picker-input"
                value={local.longBreakColor || '#38bdf8'}
                onChange={(e) => handleColorChange('longBreakColor', e.target.value)}
                aria-label="Long Break Color"
              />
              <span className="color-picker-hex">{local.longBreakColor || '#38bdf8'}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn--secondary btn--sm reset-colors-btn"
          onClick={handleResetColors}
        >
          Reset Colors to Default
        </button>
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
                  Test
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
                Test
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
            Export JSON File
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCopyJson}>
            Copy JSON to Clipboard
          </button>
          <button type="button" className="btn btn--secondary" onClick={onImportJson}>
            Import Backup JSON
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
            Clear Today's History
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setClearScopeToConfirm('week')}
          >
            Clear This Week's History
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => setClearScopeToConfirm('all')}
          >
            Clear All History
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {clearScopeToConfirm && (
        <div className="confirm-modal-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <div className="confirm-modal-icon">
              <WarningIcon size={32} />
            </div>
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
