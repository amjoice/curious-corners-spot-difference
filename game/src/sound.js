// Synthesised sound effects, WebAudio only — no audio files.
// A tiny helper builds short oscillator blips; the mute flag is persisted
// in localStorage so it survives a reload.

const KEY = 'curious-corners-muted';

let audioCtx = null;

export function isMuted() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem(KEY, muted ? '1' : '0');
  } catch {
    // Storage may be unavailable; the in-session flag still applies.
  }
  return muted;
}

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

function blip(freq, at, dur, type, gain) {
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0, ac.currentTime + at);
  amp.gain.linearRampToValueAtTime(gain, ac.currentTime + at + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function play(name) {
  if (isMuted()) return;
  try {
    if (name === 'find') {
      blip(660, 0, 0.12, 'sine', 0.18);
      blip(880, 0.09, 0.16, 'sine', 0.18);
    } else if (name === 'miss') {
      blip(160, 0, 0.18, 'sawtooth', 0.1);
    } else if (name === 'hint') {
      blip(520, 0, 0.1, 'triangle', 0.12);
      blip(780, 0.08, 0.14, 'triangle', 0.12);
    } else if (name === 'win') {
      [523, 659, 784, 1047].forEach((f, i) => blip(f, i * 0.11, 0.22, 'sine', 0.18));
    } else if (name === 'lose') {
      [392, 330, 262].forEach((f, i) => blip(f, i * 0.14, 0.24, 'triangle', 0.14));
    } else if (name === 'click') {
      blip(440, 0, 0.05, 'square', 0.06);
    }
  } catch {
    // Audio is best-effort; a failed blip never breaks the game.
  }
}
