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

export function playCompletionBeep(): void {
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') {
      void context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.7);
  } catch {
    // Ignore: audio is a non-essential enhancement.
  }
}
