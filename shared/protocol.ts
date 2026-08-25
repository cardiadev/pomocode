export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused';

export type CompletionSound = 'chime' | 'bell' | 'digital' | 'soft';

export type NativeNotificationSound =
  | 'None'
  | 'Basso'
  | 'Blow'
  | 'Bottle'
  | 'Frog'
  | 'Funk'
  | 'Glass'
  | 'Hero'
  | 'Morse'
  | 'Ping'
  | 'Pop'
  | 'Purr'
  | 'Sosumi'
  | 'Submarine'
  | 'Tink';

export interface TimerSnapshot {
  status: TimerStatus;
  sessionType: SessionType;
  remainingSeconds: number;
  totalSeconds: number;
  completedFocusSessionsInCycle: number;
  sessionsBeforeLongBreak: number;
  cycleStep: number;
  totalCycleSteps: number;
  activeGoalIds: string[];
  justCompleted: boolean;
}

export interface PomoCodeSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  dailyTargetPomodoros: number;
  autoStartNextSession: boolean;
  enableNotifications: boolean;
  enableNativeNotifications: boolean;
  nativeNotificationSound: NativeNotificationSound;
  enableSound: boolean;
  completionSound: CompletionSound;
}

export interface HistoryEntry {
  id: string;
  type: SessionType;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  completed: boolean;
  goalIds?: string[];
  goalTitles?: string[];
}

export interface StatsSnapshot {
  todayCount: number;
  weekCount: number;
  allTimeCount: number;
  todayMinutes: number;
  weekMinutes: number;
  allTimeMinutes: number;
  currentStreakDays: number;
  roundsCompletedToday: number;
  roundsCompletedAllTime: number;
  dailyTargetPomodoros: number;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  pomodoroCount?: number;
}

export interface PomoCodeExportData {
  version: string;
  exportedAt: string;
  settings: PomoCodeSettings;
  goals: Goal[];
  history: HistoryEntry[];
}

export type TimerCommand = 'start' | 'pause' | 'resume' | 'reset' | 'skip';

export type HostMessage =
  | { type: 'timer/update'; payload: TimerSnapshot }
  | { type: 'settings/sync'; payload: PomoCodeSettings }
  | { type: 'history/sync'; payload: { entries: HistoryEntry[]; stats: StatsSnapshot } }
  | { type: 'goals/sync'; payload: Goal[] }
  | { type: 'meta/sync'; payload: { version: string } }
  | { type: 'notification'; payload: { type: 'info' | 'success' | 'error'; message: string } };

export type WebviewMessage =
  | { type: 'command'; payload: { command: TimerCommand } }
  | { type: 'settings/update'; payload: Partial<PomoCodeSettings> }
  | { type: 'goals/add'; payload: { text: string } }
  | { type: 'goals/toggle'; payload: { id: string } }
  | { type: 'goals/complete'; payload: { id: string } }
  | { type: 'goals/reopen'; payload: { id: string } }
  | { type: 'goals/remove'; payload: { id: string } }
  | { type: 'timer/setActiveGoals'; payload: { goalIds: string[] } }
  | { type: 'settings/previewNativeSound'; payload: { sound: NativeNotificationSound } }
  | { type: 'data/exportJson' }
  | { type: 'data/copyJson' }
  | { type: 'data/importJson' }
  | { type: 'data/clear'; payload: { scope: 'today' | 'week' | 'all' } }
  | { type: 'openExternal'; payload: { url: string } }
  | { type: 'webview/ready' };
