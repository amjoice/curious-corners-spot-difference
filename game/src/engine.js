// Level state: timer, clicks, hints, scoring and found markers.
// The engine owns no DOM except the two canvases it draws into; the UI
// layer (main.js) reads snapshots from here and renders the HUD.

import { SCENE_H, SCENE_W, paintScene } from './scenes.js';
import { isMuted, play, setMuted } from './sound.js';

export const WRONG_CLICK_PENALTY_S = 3;
export const HINT_COST = 50;
export const HINTS_PER_LEVEL = 3;

function emptyChanged(scene) {
  return new Set();
}

function fullChanged(scene) {
  return new Set(scene.diffs.map((d) => d.id));
}

export class Level {
  constructor(scene, onEvent) {
    this.scene = scene;
    this.onEvent = onEvent; // (event) => void, for HUD refreshes and sounds
    this.found = new Set();
    this.markers = []; // {x, y, r, kind: 'found'|'miss', born}
    this.hintPulse = null; // {x, y, r, until}
    this.streak = 0;
    this.score = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = scene.seconds;
    this.running = true;
    this.finished = false;
    this.won = false;
    this.startedAt = Date.now();
    this._lastTick = Date.now();
    this._left = null; // offscreen canvases, painted once per level
    this._right = null;
    this._leftCtx = null;
    this._rightCtx = null;
  }

  attach(leftCanvas, rightCanvas) {
    this._left = paintScene(this.scene, emptyChanged(this.scene));
    this._right = paintScene(this.scene, fullChanged(this.scene));
    this._leftCtx = leftCanvas.getContext('2d');
    this._rightCtx = rightCanvas.getContext('2d');
    this.redraw();
  }

  redraw() {
    if (!this._leftCtx) return;
    const now = Date.now();
    this._leftCtx.drawImage(this._left, 0, 0);
    this._rightCtx.drawImage(this._right, 0, 0);
    for (const m of this.markers) {
      const age = now - m.born;
      if (age > 1200) continue;
      const alpha = age < 800 ? 1 : 1 - (age - 800) / 400;
      for (const c of [this._leftCtx, this._rightCtx]) {
        c.save();
        c.globalAlpha = alpha;
        c.strokeStyle = m.kind === 'found' ? '#2e7d32' : '#c62828';
        c.lineWidth = m.kind === 'found' ? 5 : 4;
        c.beginPath();
        c.ellipse(m.x, m.y, m.r + 4, (m.r + 4) * 0.72, -0.12, 0, Math.PI * 2);
        c.stroke();
        if (m.kind === 'found') {
          c.fillStyle = '#2e7d32';
          c.font = 'bold 20px "Trebuchet MS", sans-serif';
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText('✓', m.x, m.y);
        }
        c.restore();
      }
    }
    if (this.hintPulse && now < this.hintPulse.until) {
      const pulse = 1 + 0.12 * Math.sin((now / 160) * Math.PI);
      for (const c of [this._leftCtx, this._rightCtx]) {
        c.save();
        c.strokeStyle = '#f6a609';
        c.lineWidth = 4;
        c.setLineDash([8, 6]);
        c.beginPath();
        c.arc(this.hintPulse.x, this.hintPulse.y, this.hintPulse.r * pulse, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }
    }
  }

  // One game tick: drain the timer, expire markers, redraw.
  tick() {
    if (!this.running) return;
    const now = Date.now();
    const dt = (now - this._lastTick) / 1000;
    this._lastTick = now;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) this.end(false);
    this.redraw();
    this.onEvent({ type: 'tick' });
  }

  // A click in scene coordinates (0..640, 0..420) on either panel.
  click(x, y) {
    if (!this.running) return null;
    if (x < 0 || y < 0 || x > SCENE_W || y > SCENE_H) return null;
    const diff = this.scene.diffs.find(
      (d) => !this.found.has(d.id) && Math.hypot(x - d.x, y - d.y) <= d.r,
    );
    if (diff) {
      this.found.add(diff.id);
      this.streak += 1;
      const base = 100 + Math.min(this.streak - 1, 5) * 20;
      this.score += base;
      this.markers.push({ x: diff.x, y: diff.y, r: diff.r, kind: 'found', born: Date.now() });
      play('find');
      this.onEvent({ type: 'found', diff, streak: this.streak, gained: base });
      if (this.found.size === this.scene.diffs.length) {
        const bonus = Math.round(this.timeLeft) * 5;
        this.score += bonus;
        this.end(true, bonus);
      }
      this.redraw();
      return diff;
    }
    this.streak = 0;
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_PENALTY_S);
    this.markers.push({ x, y, r: 16, kind: 'miss', born: Date.now() });
    play('miss');
    this.onEvent({ type: 'miss', penalty: WRONG_CLICK_PENALTY_S });
    if (this.timeLeft <= 0) this.end(false);
    this.redraw();
    return null;
  }

  hint() {
    if (!this.running || this.hintsLeft <= 0) return null;
    const remaining = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return null;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_COST);
    this.hintPulse = { x: pick.x, y: pick.y, r: pick.r, until: Date.now() + 3500 };
    play('hint');
    this.onEvent({ type: 'hint', diff: pick });
    this.redraw();
    return pick;
  }

  stars() {
    if (!this.won) return 0;
    const frac = this.timeLeft / this.scene.seconds;
    if (frac >= 0.5) return 3;
    if (frac >= 0.25) return 2;
    return 1;
  }

  end(won, bonus = 0) {
    if (this.finished) return;
    this.running = false;
    this.finished = true;
    this.won = won;
    play(won ? 'win' : 'lose');
    this.onEvent({ type: 'end', won, bonus, stars: this.stars(), score: this.score });
  }

  snapshot() {
    return {
      sceneId: this.scene.id,
      foundCount: this.found.size,
      total: this.scene.diffs.length,
      remaining: this.scene.diffs.length - this.found.size,
      score: this.score,
      streak: this.streak,
      hintsLeft: this.hintsLeft,
      timeLeft: Math.ceil(this.timeLeft),
      running: this.running,
      finished: this.finished,
      won: this.won,
      muted: isMuted(),
    };
  }
}

export function toggleMute() {
  const muted = setMuted(!isMuted());
  if (!muted) play('click');
  return muted;
}
