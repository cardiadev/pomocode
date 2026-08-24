export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerSnapshot {
  status: TimerStatus;
  sessionType: SessionType;
  remainingSeconds: number;
  totalSeconds: number;
  completedFocusSessionsInCycle: number;
  justCompleted: boolean;
}

export interface PomoCodeSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartNextSession: boolean;
  enableNotifications: boolean;
  enableSound: boolean;
}

export interface HistoryEntry {
  id: string;
  type: SessionType;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  completed: boolean;
}

export interface StatsSnapshot {
  todayCount: number;
  weekCount: number;
  allTimeCount: number;
  todayMinutes: number;
  weekMinutes: number;
  allTimeMinutes: number;
  currentStreakDays: number;
}

export type TimerCommand = 'start' | 'pause' | 'resume' | 'reset' | 'skip';

export type HostMessage =
  | { type: 'timer/update'; payload: TimerSnapshot }
  | { type: 'settings/sync'; payload: PomoCodeSettings }
  | { type: 'history/sync'; payload: { entries: HistoryEntry[]; stats: StatsSnapshot } };

export type WebviewMessage =
  | { type: 'command'; payload: { command: TimerCommand } }
  | { type: 'settings/update'; payload: Partial<PomoCodeSettings> }
  | { type: 'webview/ready' };
