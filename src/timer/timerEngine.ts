import * as vscode from 'vscode';
import type { PomoCodeSettings, SessionType, TimerSnapshot, TimerStatus } from '../../shared/protocol';
import type { SessionCompletedEvent } from './types';

function durationSecondsFor(sessionType: SessionType, settings: PomoCodeSettings): number {
  switch (sessionType) {
    case 'focus':
      return settings.focusDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
}

export class TimerEngine {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<TimerSnapshot>();
  readonly onDidChangeState = this.onDidChangeEmitter.event;

  private readonly onSessionCompletedEmitter = new vscode.EventEmitter<SessionCompletedEvent>();
  readonly onSessionCompleted = this.onSessionCompletedEmitter.event;

  private readonly onSessionStartedEmitter = new vscode.EventEmitter<SessionType>();
  readonly onSessionStarted = this.onSessionStartedEmitter.event;

  private status: TimerStatus = 'idle';
  private sessionType: SessionType = 'focus';
  private remainingSeconds: number;
  private totalSeconds: number;
  private completedFocusSessionsInCycle = 0;
  private sessionStartedAt: string | undefined;
  private intervalHandle: ReturnType<typeof setInterval> | undefined;

  constructor(private getSettings: () => PomoCodeSettings) {
    this.totalSeconds = durationSecondsFor(this.sessionType, this.getSettings());
    this.remainingSeconds = this.totalSeconds;
  }

  getSnapshot(): TimerSnapshot {
    return {
      status: this.status,
      sessionType: this.sessionType,
      remainingSeconds: this.remainingSeconds,
      totalSeconds: this.totalSeconds,
      completedFocusSessionsInCycle: this.completedFocusSessionsInCycle,
      justCompleted: false,
    };
  }

  start(): void {
    if (this.status === 'running') {
      return;
    }
    const isFreshStart = this.status === 'idle';
    if (isFreshStart) {
      this.totalSeconds = durationSecondsFor(this.sessionType, this.getSettings());
      this.remainingSeconds = this.totalSeconds;
      this.sessionStartedAt = new Date().toISOString();
    }
    this.status = 'running';
    this.scheduleTick();
    this.emitState(false);
    if (isFreshStart) {
      this.onSessionStartedEmitter.fire(this.sessionType);
    }
  }

  pause(): void {
    if (this.status !== 'running') {
      return;
    }
    this.status = 'paused';
    this.clearTick();
    this.emitState(false);
  }

  resume(): void {
    if (this.status !== 'paused') {
      return;
    }
    this.status = 'running';
    this.scheduleTick();
    this.emitState(false);
  }

  reset(): void {
    this.clearTick();
    this.status = 'idle';
    this.sessionType = 'focus';
    this.completedFocusSessionsInCycle = 0;
    this.totalSeconds = durationSecondsFor(this.sessionType, this.getSettings());
    this.remainingSeconds = this.totalSeconds;
    this.sessionStartedAt = undefined;
    this.emitState(false);
  }

  skip(): void {
    this.completeCurrentSession(false);
  }

  dispose(): void {
    this.clearTick();
    this.onDidChangeEmitter.dispose();
    this.onSessionCompletedEmitter.dispose();
    this.onSessionStartedEmitter.dispose();
  }

  private scheduleTick(): void {
    this.clearTick();
    this.intervalHandle = setInterval(() => this.tick(), 1000);
  }

  private clearTick(): void {
    if (this.intervalHandle !== undefined) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = undefined;
    }
  }

  private tick(): void {
    if (this.status !== 'running') {
      return;
    }
    this.remainingSeconds -= 1;
    if (this.remainingSeconds <= 0) {
      this.completeCurrentSession(true);
      return;
    }
    this.emitState(false);
  }

  private completeCurrentSession(naturallyCompleted: boolean): void {
    this.clearTick();
    const startedAt = this.sessionStartedAt ?? new Date().toISOString();
    const endedAt = new Date().toISOString();
    const elapsedSeconds = this.totalSeconds - Math.max(this.remainingSeconds, 0);
    const durationMinutes = Math.round(elapsedSeconds / 60);
    const completedSessionType = this.sessionType;

    // Only a focus session that ran to completion counts toward the round of
    // sessionsBeforeLongBreak — skipping a session moves the timer forward
    // without advancing (or corrupting) the round progress.
    if (completedSessionType === 'focus' && naturallyCompleted) {
      this.completedFocusSessionsInCycle += 1;
    }

    const settings = this.getSettings();
    const nextSessionType = this.nextSessionType(settings);

    this.onSessionCompletedEmitter.fire({
      sessionType: completedSessionType,
      nextSessionType,
      startedAt,
      endedAt,
      durationMinutes,
      completed: naturallyCompleted,
    });

    this.sessionType = nextSessionType;
    this.totalSeconds = durationSecondsFor(this.sessionType, settings);
    this.remainingSeconds = this.totalSeconds;
    this.sessionStartedAt = undefined;

    if (settings.autoStartNextSession) {
      this.status = 'running';
      this.sessionStartedAt = new Date().toISOString();
      this.scheduleTick();
    } else {
      this.status = 'idle';
    }

    this.emitState(true);

    if (settings.autoStartNextSession) {
      this.onSessionStartedEmitter.fire(this.sessionType);
    }
  }

  private nextSessionType(settings: PomoCodeSettings): SessionType {
    if (this.sessionType === 'focus') {
      const reachedLongBreak = this.completedFocusSessionsInCycle >= settings.sessionsBeforeLongBreak;
      if (reachedLongBreak) {
        this.completedFocusSessionsInCycle = 0;
        return 'longBreak';
      }
      return 'shortBreak';
    }
    return 'focus';
  }

  private emitState(justCompleted: boolean): void {
    this.onDidChangeEmitter.fire({ ...this.getSnapshot(), justCompleted });
  }
}
