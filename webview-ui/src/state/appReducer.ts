import type { Goal, HistoryEntry, HostMessage, PomoCodeSettings, StatsSnapshot, TimerSnapshot } from '../../../shared/protocol';

export interface AppState {
  timer: TimerSnapshot | undefined;
  settings: PomoCodeSettings | undefined;
  history: HistoryEntry[];
  stats: StatsSnapshot | undefined;
  goals: Goal[];
}

export const initialAppState: AppState = {
  timer: undefined,
  settings: undefined,
  history: [],
  stats: undefined,
  goals: [],
};

export function appReducer(state: AppState, message: HostMessage): AppState {
  switch (message.type) {
    case 'timer/update':
      return { ...state, timer: message.payload };
    case 'settings/sync':
      return { ...state, settings: message.payload };
    case 'history/sync':
      return { ...state, history: message.payload.entries, stats: message.payload.stats };
    case 'goals/sync':
      return { ...state, goals: message.payload };
    default:
      return state;
  }
}
