import type { CompletionSound } from '../../shared/protocol';

type AudioContextConstructor = new () => AudioContext;

let sharedContext: AudioContext | undefined;

function getAudioContext(): AudioContext {
  if (!sharedContext) {
    const AudioContextClass: AudioContextConstructor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: AudioContextConstructor }).webkitAudioContext;
    sharedContext = new AudioContextClass();
  }
  return sharedContext;
}

/**
 * Browsers only allow audio to start after a user gesture. Call this from any
 * click/pointer handler so the shared AudioContext is already running by the
 * time a session completes and we need to play the beep.
 */
export function unlockAudio(): void {
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') {
      void context.resume();
    }
  } catch {
    // Ignore: audio is a non-essential enhancement.
  }
}

function playTone(
  context: AudioContext,
  startTime: number,
  frequency: number,
  type: OscillatorType,
  peakGain: number,
  duration: number,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + Math.min(0.02, duration / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playCompletionBeep(style: CompletionSound = 'chime'): void {
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') {
      void context.resume();
    }
    const now = context.currentTime;

    switch (style) {
      case 'bell':
        playTone(context, now, 660, 'triangle', 0.22, 0.8);
        playTone(context, now, 990, 'triangle', 0.12, 0.6);
        return;
      case 'digital':
        playTone(context, now, 1046, 'square', 0.12, 0.1);
        playTone(context, now + 0.15, 1046, 'square', 0.12, 0.1);
        return;
      case 'soft':
        playTone(context, now, 440, 'sine', 0.2, 0.9);
        return;
      case 'chime':
      default:
        playTone(context, now, 880, 'sine', 0.25, 0.7);
        return;
    }
  } catch {
    // Ignore: audio is a non-essential enhancement.
  }
}
