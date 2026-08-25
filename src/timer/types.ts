import type { SessionType } from '../../shared/protocol';

export interface EngineDurationsSeconds {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

export interface SessionCompletedEvent {
  sessionType: SessionType;
  nextSessionType: SessionType;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  completed: boolean;
  goalIds?: string[];
}
