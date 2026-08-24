import { useEffect, useReducer, useRef, type ReactElement } from 'react';
import type { HostMessage, PomoCodeSettings, TimerCommand } from '../../shared/protocol';
import { getVsCodeApi } from './hooks/useVsCodeApi';
import { appReducer, initialAppState } from './state/appReducer';
import { TimerDisplay } from './components/TimerDisplay';
import { ControlButtons } from './components/ControlButtons';
import { StreakBadge } from './components/StreakBadge';
import { StatsSummary } from './components/StatsSummary';
import { HistoryList } from './components/HistoryList';
import { SettingsForm } from './components/SettingsForm';

function playCompletionBeep(): void {
  try {
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gain.gain.setValueAtTime(0.15, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.6);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.6);
    oscillator.onended = () => void context.close();
  } catch {
    // Audio is a non-essential enhancement; ignore failures silently.
  }
}

export function App(): ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const vscodeApi = useRef(getVsCodeApi()).current;

  useEffect(() => {
    function handleMessage(event: MessageEvent<HostMessage>): void {
      dispatch(event.data);
    }
    window.addEventListener('message', handleMessage);
    vscodeApi.postMessage({ type: 'webview/ready' });
    return () => window.removeEventListener('message', handleMessage);
  }, [vscodeApi]);

  useEffect(() => {
    if (state.timer?.justCompleted && state.settings?.enableSound) {
      playCompletionBeep();
    }
  }, [state.timer, state.settings?.enableSound]);

  function handleCommand(command: TimerCommand): void {
    vscodeApi.postMessage({ type: 'command', payload: { command } });
  }

  function handleSettingsUpdate(partial: Partial<PomoCodeSettings>): void {
    vscodeApi.postMessage({ type: 'settings/update', payload: partial });
  }

  if (!state.timer || !state.settings || !state.stats) {
    return (
      <div className="app app--loading">
        <p>Loading PomoCode…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>PomoCode</h1>
        <StreakBadge currentStreakDays={state.stats.currentStreakDays} />
      </header>

      <TimerDisplay timer={state.timer} />
      <ControlButtons timer={state.timer} onCommand={handleCommand} />

      <StatsSummary stats={state.stats} />
      <HistoryList entries={state.history} />
      <SettingsForm settings={state.settings} onUpdate={handleSettingsUpdate} />
    </div>
  );
}
