import type { HistoryEntry, HostMessage, PomoCodeSettings, StatsSnapshot, TimerSnapshot } from '../../../shared/protocol';

export interface AppState {
  timer: TimerSnapshot | undefined;
  settings: PomoCodeSettings | undefined;
  history: HistoryEntry[];
  stats: StatsSnapshot | undefined;
}

export const initialAppState: AppState = {
  timer: undefined,
  settings: undefined,
  history: [],
  stats: undefined,
};

export function appReducer(state: AppState, message: HostMessage): AppState {
  switch (message.type) {
    case 'timer/update':
      return { ...state, timer: message.payload };
    case 'settings/sync':
      return { ...state, settings: message.payload };
    case 'history/sync':
      return { ...state, history: message.payload.entries, stats: message.payload.stats };
    default:
      return state;
  }
}
