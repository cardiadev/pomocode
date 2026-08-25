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

  return (
    <div className="app">
      {/* Top Header */}
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">🍅</span>
          <h1>PomoCode</h1>
        </div>
        <StreakBadge
          currentStreakDays={state.stats.currentStreakDays}
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
          <TimerDisplay timer={state.timer} />

          <CycleTracker
            completedFocusSessionsInCycle={state.timer.completedFocusSessionsInCycle}
            sessionsBeforeLongBreak={state.timer.sessionsBeforeLongBreak}
            sessionType={state.timer.sessionType}
            cycleStep={state.timer.cycleStep}
            totalCycleSteps={state.timer.totalCycleSteps}
            todayCount={state.stats.todayCount}
            dailyTargetPomodoros={state.stats.dailyTargetPomodoros}
            roundsCompletedToday={state.stats.roundsCompletedToday}
          />

          <ControlButtons timer={state.timer} onCommand={handleCommand} />

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
            onExportJson={handleExportJson}
            onCopyJson={handleCopyJson}
            onImportJson={handleImportJson}
          />
        </main>
      )}

      {/* App Footer */}
      <Footer onOpenExternal={handleOpenExternal} version={state.version} />
    </div>
  );
}
