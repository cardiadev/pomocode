import { useEffect, useReducer, useRef, useState, type ReactElement } from 'react';
import type { HostMessage, PomoCodeSettings, TimerCommand } from '../../shared/protocol';
import { getVsCodeApi } from './hooks/useVsCodeApi';
import { appReducer, initialAppState } from './state/appReducer';
import { unlockAudio, playCompletionBeep } from './audio';
import { TimerDisplay } from './components/TimerDisplay';
import { ControlButtons } from './components/ControlButtons';
import { RoundProgress } from './components/RoundProgress';
import { StreakBadge } from './components/StreakBadge';
import { StreakCalendarModal } from './components/StreakCalendarModal';
import { StatsSummary } from './components/StatsSummary';
import { GoalsList } from './components/GoalsList';
import { HistoryList } from './components/HistoryList';
import { SettingsForm } from './components/SettingsForm';
import { Footer } from './components/Footer';

export function App(): ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [isStreakModalOpen, setStreakModalOpen] = useState(false);
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
    function handleFirstInteraction(): void {
      unlockAudio();
      document.removeEventListener('pointerdown', handleFirstInteraction);
    }
    document.addEventListener('pointerdown', handleFirstInteraction);
    return () => document.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  useEffect(() => {
    if (state.timer?.justCompleted && state.settings?.enableSound) {
      playCompletionBeep(state.settings.completionSound);
    }
  }, [state.timer, state.settings?.enableSound, state.settings?.completionSound]);

  function handleCommand(command: TimerCommand): void {
    unlockAudio();
    vscodeApi.postMessage({ type: 'command', payload: { command } });
  }

  function handleSettingsUpdate(partial: Partial<PomoCodeSettings>): void {
    vscodeApi.postMessage({ type: 'settings/update', payload: partial });
  }

  function handleAddGoal(text: string): void {
    vscodeApi.postMessage({ type: 'goals/add', payload: { text } });
  }

  function handleToggleGoal(id: string): void {
    vscodeApi.postMessage({ type: 'goals/toggle', payload: { id } });
  }

  function handleRemoveGoal(id: string): void {
    vscodeApi.postMessage({ type: 'goals/remove', payload: { id } });
  }

  function handleOpenExternal(url: string): void {
    vscodeApi.postMessage({ type: 'openExternal', payload: { url } });
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
        <StreakBadge currentStreakDays={state.stats.currentStreakDays} onClick={() => setStreakModalOpen(true)} />
      </header>

      <TimerDisplay timer={state.timer} />
      <RoundProgress
        completedFocusSessionsInCycle={state.timer.completedFocusSessionsInCycle}
        sessionsBeforeLongBreak={state.timer.sessionsBeforeLongBreak}
        sessionType={state.timer.sessionType}
        roundsCompletedToday={state.stats.roundsCompletedToday}
      />
      <ControlButtons timer={state.timer} onCommand={handleCommand} />

      <GoalsList goals={state.goals} onAdd={handleAddGoal} onToggle={handleToggleGoal} onRemove={handleRemoveGoal} />
      <StatsSummary stats={state.stats} />
      <SettingsForm settings={state.settings} onUpdate={handleSettingsUpdate} />
      <HistoryList entries={state.history} />

      <Footer onOpenExternal={handleOpenExternal} version={state.version} />

      {isStreakModalOpen && (
        <StreakCalendarModal
          entries={state.history}
          stats={state.stats}
          onClose={() => setStreakModalOpen(false)}
        />
      )}
    </div>
  );
}
