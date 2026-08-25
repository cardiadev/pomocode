import { useEffect, useReducer, useRef, useState, type ReactElement } from 'react';
import type { HostMessage, PomoCodeSettings, TimerCommand } from '../../shared/protocol';
import { getVsCodeApi } from './hooks/useVsCodeApi';
import { appReducer, initialAppState } from './state/appReducer';
import { unlockAudio, playCompletionBeep } from './audio';
import { TabBar, type ActiveTab } from './components/TabBar';
import { TimerDisplay } from './components/TimerDisplay';
import { ControlButtons } from './components/ControlButtons';
import { CycleTracker } from './components/CycleTracker';
import { SessionGoalSelector } from './components/SessionGoalSelector';
import { StreakBadge } from './components/StreakBadge';
import { StatsSummary } from './components/StatsSummary';
import { GoalsList } from './components/GoalsList';
import { HistoryList } from './components/HistoryList';
import { CalendarView } from './components/CalendarView';
import { SettingsForm } from './components/SettingsForm';
import { Footer } from './components/Footer';
import { TomatoIcon } from './components/Icons';

export function App(): ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [activeTab, setActiveTab] = useState<ActiveTab>('timer');
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
    if (state.settings) {
      const updatedSettings = { ...state.settings, ...partial };
      dispatch({ type: 'settings/sync', payload: updatedSettings });

      if (state.timer && state.timer.status === 'idle') {
        let durationMinutes = updatedSettings.focusDuration;
        if (state.timer.sessionType === 'shortBreak') durationMinutes = updatedSettings.shortBreakDuration;
        if (state.timer.sessionType === 'longBreak') durationMinutes = updatedSettings.longBreakDuration;
        const totalSec = durationMinutes * 60;
        dispatch({
          type: 'timer/update',
          payload: {
            ...state.timer,
            totalSeconds: totalSec,
            remainingSeconds: totalSec,
            sessionsBeforeLongBreak: updatedSettings.sessionsBeforeLongBreak,
            totalCycleSteps: updatedSettings.sessionsBeforeLongBreak * 2,
          },
        });
      }
    }
    vscodeApi.postMessage({ type: 'settings/update', payload: partial });
  }

  function handleAddGoal(text: string): void {
    vscodeApi.postMessage({ type: 'goals/add', payload: { text } });
  }

  function handleCompleteGoal(id: string): void {
    vscodeApi.postMessage({ type: 'goals/complete', payload: { id } });
  }

  function handleReopenGoal(id: string): void {
    vscodeApi.postMessage({ type: 'goals/reopen', payload: { id } });
  }

  function handleRemoveGoal(id: string): void {
    vscodeApi.postMessage({ type: 'goals/remove', payload: { id } });
  }

  function handleSelectGoals(goalIds: string[]): void {
    vscodeApi.postMessage({ type: 'timer/setActiveGoals', payload: { goalIds } });
  }

  function handleExportJson(): void {
    vscodeApi.postMessage({ type: 'data/exportJson' });
  }

  function handleCopyJson(): void {
    vscodeApi.postMessage({ type: 'data/copyJson' });
  }

  function handleImportJson(): void {
    vscodeApi.postMessage({ type: 'data/importJson' });
  }

  function handlePreviewNativeSound(sound: PomoCodeSettings['nativeNotificationSound']): void {
    vscodeApi.postMessage({ type: 'settings/previewNativeSound', payload: { sound } });
  }

  function handleClearData(scope: 'today' | 'week' | 'all'): void {
    vscodeApi.postMessage({ type: 'data/clear', payload: { scope } });
  }

  function handleOpenExternal(url: string): void {
    vscodeApi.postMessage({ type: 'openExternal', payload: { url } });
  }

  if (!state.timer || !state.settings || !state.stats) {
    return (
      <div className="app app--loading">
        <div className="loading-spinner" />
        <p>Loading PomoCode…</p>
      </div>
    );
  }

  const activeGoalsCount = state.goals.filter((g) => !g.completed).length;

  const dynamicStyles = {
    '--pomocode-accent': state.settings.accentColor || '#f97316',
    '--pomocode-focus': state.settings.focusColor || '#f97316',
    '--pomocode-short-break': state.settings.shortBreakColor || '#22c55e',
    '--pomocode-long-break': state.settings.longBreakColor || '#38bdf8',
    '--pomocode-font': state.settings.fontFamily
      ? `"${state.settings.fontFamily}", "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      : '"Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties;

  return (
    <div className="app" style={dynamicStyles}>
      {/* Top Header */}
      <header className="app-header">
        <div className="app-brand">
          <TomatoIcon size={20} className="app-logo-svg" />
          <h1>PomoCode</h1>
        </div>
        <StreakBadge
          currentStreakDays={state.stats.currentStreakDays}
          completedToday={state.stats.todayCount > 0}
          onClick={() => setActiveTab('calendar')}
        />
      </header>

      {/* Main Tab Navigation */}
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        goalCount={activeGoalsCount}
        historyCount={state.history.length}
      />

      {/* Tab 1: Timer / Dashboard */}
      {activeTab === 'timer' && (
        <main className="tab-pane tab-pane--timer">
          <TimerDisplay timer={state.timer} todayCount={state.stats.todayCount} />

          <ControlButtons timer={state.timer} onCommand={handleCommand} />

          <CycleTracker
            completedFocusSessionsInCycle={state.timer.completedFocusSessionsInCycle}
            sessionsBeforeLongBreak={state.timer.sessionsBeforeLongBreak}
            sessionType={state.timer.sessionType}
            cycleStep={state.timer.cycleStep}
            totalCycleSteps={state.timer.totalCycleSteps}
            todayCount={state.stats.todayCount}
            dailyTargetPomodoros={state.settings.dailyTargetPomodoros}
            roundsCompletedToday={state.stats.roundsCompletedToday}
          />

          <SessionGoalSelector
            goals={state.goals}
            activeGoalIds={state.timer.activeGoalIds}
            onSelectGoals={handleSelectGoals}
            onAddGoal={handleAddGoal}
          />

          <GoalsList
            goals={state.goals}
            onAdd={handleAddGoal}
            onComplete={handleCompleteGoal}
            onReopen={handleReopenGoal}
            onRemove={handleRemoveGoal}
          />

          <StatsSummary stats={state.stats} />
        </main>
      )}

      {/* Tab 2: Calendar & Streaks */}
      {activeTab === 'calendar' && (
        <main className="tab-pane tab-pane--calendar">
          <CalendarView entries={state.history} stats={state.stats} />
        </main>
      )}

      {/* Tab 3: History (Day by Day) */}
      {activeTab === 'history' && (
        <main className="tab-pane tab-pane--history">
          <HistoryList entries={state.history} />
        </main>
      )}

      {/* Tab 4: Settings & Data */}
      {activeTab === 'settings' && (
        <main className="tab-pane tab-pane--settings">
          <SettingsForm
            settings={state.settings}
            onUpdate={handleSettingsUpdate}
            onPreviewNativeSound={handlePreviewNativeSound}
            onExportJson={handleExportJson}
            onCopyJson={handleCopyJson}
            onImportJson={handleImportJson}
            onClearData={handleClearData}
          />
        </main>
      )}

      {/* App Footer */}
      <Footer onOpenExternal={handleOpenExternal} version={state.version} />
    </div>
  );
}
