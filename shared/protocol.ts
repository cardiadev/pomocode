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
  enableNativeNotifications: boolean;
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

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type TimerCommand = 'start' | 'pause' | 'resume' | 'reset' | 'skip';

export type HostMessage =
  | { type: 'timer/update'; payload: TimerSnapshot }
  | { type: 'settings/sync'; payload: PomoCodeSettings }
  | { type: 'history/sync'; payload: { entries: HistoryEntry[]; stats: StatsSnapshot } }
  | { type: 'goals/sync'; payload: Goal[] };

export type WebviewMessage =
  | { type: 'command'; payload: { command: TimerCommand } }
  | { type: 'settings/update'; payload: Partial<PomoCodeSettings> }
  | { type: 'goals/add'; payload: { text: string } }
  | { type: 'goals/toggle'; payload: { id: string } }
  | { type: 'goals/remove'; payload: { id: string } }
  | { type: 'openExternal'; payload: { url: string } }
  | { type: 'webview/ready' };
