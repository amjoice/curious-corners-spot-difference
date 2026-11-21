// Bootstrap and screens for Curious Corners.
// Menu -> play -> level-complete / time-up. Best score per scene lives in
// localStorage. The test hooks under window.__spotGame let a headless driver
// start a level, click differences and read state without a real mouse.

import { SCENES } from './scenes.js';
import { HINT_COST, HINTS_PER_LEVEL, Level, toggleMute } from './engine.js';
import { isMuted, play } from './sound.js';

const BEST_KEY = 'curious-corners-best';

const $ = (id) => document.getElementById(id);
const hud = $('hud');
const menuScreen = $('screen-menu');
const playScreen = $('screen-play');
const overScreen = $('screen-over');
const leftCanvas = $('canvas-left');
const rightCanvas = $('canvas-right');

let level = null;
let levelIndex = 0;
let timerId = null;

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveBest(sceneId, score) {
  const best = loadBest();
  if (!best[sceneId] || score > best[sceneId]) {
    best[sceneId] = score;
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(best));
    } catch {
      // Best scores are a nicety; the game works without storage.
    }
  }
  return best[sceneId];
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function show(screen) {
  for (const el of [menuScreen, playScreen, overScreen]) el.hidden = el !== screen;
  hud.hidden = screen !== playScreen;
}

function refreshHud() {
  if (!level) return;
  const s = level.snapshot();
  $('level-name').textContent = level.scene.name;
  $('level-sub').textContent = `Level ${levelIndex + 1} of ${SCENES.length} · ${level.scene.blurb}`;
  $('timer-text').textContent = fmtTime(s.timeLeft);
  const bar = $('timer-bar');
  bar.style.width = `${(s.timeLeft / level.scene.seconds) * 100}%`;
  bar.classList.toggle('low', s.timeLeft <= 30);
  $('found-counter').textContent = `Found ${s.foundCount} / ${s.total} · ${s.remaining} remaining`;
  $('score').textContent = `Score ${s.score}`;
  $('hints-left').textContent = s.hintsLeft;
  $('mute-btn').textContent = s.muted ? '🔇' : '🔊';
}

function toast(message) {
  $('toast').textContent = message;
}

function renderFoundList() {
  const list = $('found-list');
  list.innerHTML = '';
  if (!level) return;
  for (const d of level.scene.diffs) {
    const chip = document.createElement('span');
    chip.className = 'found-chip' + (level.found.has(d.id) ? ' done' : '');
    chip.textContent = level.found.has(d.id) ? `✓ ${d.label}` : d.label;
    list.appendChild(chip);
  }
}

function onLevelEvent(event) {
  if (!level) return;
  if (event.type === 'found') {
    toast(`Found it — ${event.diff.label}! +${event.gained} points${event.streak > 1 ? ` (streak x${event.streak})` : ''}`);
  } else if (event.type === 'miss') {
    toast(`Not a difference — ${event.penalty}s penalty. Look closer!`);
  } else if (event.type === 'hint') {
    toast(`Hint: something changed near the gold ring (−${HINT_COST} points)`);
  } else if (event.type === 'end') {
    finishLevel(event);
    return;
  }
  refreshHud();
  renderFoundList();
}

function finishLevel(event) {
  clearInterval(timerId);
  timerId = null;
  const s = level.snapshot();
  const best = saveBest(level.scene.id, s.score);
  $('over-title').textContent = event.won ? 'Level complete!' : "Time's up!";
  $('over-sub').textContent = event.won
    ? `You found all ${s.total} differences in ${level.scene.name} — time bonus +${event.bonus}.`
    : `You found ${s.foundCount} of ${s.total} differences in ${level.scene.name}.`;
  $('over-stars').textContent = event.won ? '★'.repeat(event.stars) + '☆'.repeat(3 - event.stars) : '☆☆☆';
  $('over-stats').innerHTML = `
    <div><dt>Score</dt><dd>${s.score}</dd></div>
    <div><dt>Best</dt><dd>${best}</dd></div>
    <div><dt>Found</dt><dd>${s.foundCount} / ${s.total}</dd></div>
    <div><dt>Time left</dt><dd>${fmtTime(s.timeLeft)}</dd></div>`;
  $('over-next').hidden = !(event.won && levelIndex + 1 < SCENES.length);
  show(overScreen);
  refreshHud();
}

function startLevel(index) {
  clearInterval(timerId);
  levelIndex = index;
  level = new Level(SCENES[index], onLevelEvent);
  level.attach(leftCanvas, rightCanvas);
  show(playScreen);
  toast(`Find all ${level.scene.diffs.length} differences before the clock runs out!`);
  renderFoundList();
  refreshHud();
  timerId = setInterval(() => level.tick(), 100);
}

function toMenu() {
  clearInterval(timerId);
  timerId = null;
  level = null;
  buildMenu();
  show(menuScreen);
}

function buildMenu() {
  const best = loadBest();
  const cards = $('level-cards');
  cards.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'level-card';
    card.innerHTML = `<b>${i + 1}. ${scene.name}</b>
      <span>${scene.blurb}</span>
      <span>${scene.diffs.length} differences · ${fmtTime(scene.seconds)}</span>
      <span class="card-best">Best: ${best[scene.id] ?? '—'}</span>`;
    card.addEventListener('click', () => {
      play('click');
      startLevel(i);
    });
    cards.appendChild(card);
  });
  const totals = Object.values(best);
  $('menu-best').textContent = totals.length
    ? `Best scores — ${SCENES.map((s) => `${s.name}: ${best[s.id] ?? '—'}`).join(' · ')}`
    : 'No scores yet — pick a scene and start spotting!';
}

function canvasClick(canvas) {
  return (event) => {
    if (!level || !level.running) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 640;
    const y = ((event.clientY - rect.top) / rect.height) * 420;
    level.click(x, y);
  };
}

leftCanvas.addEventListener('click', canvasClick(leftCanvas));
rightCanvas.addEventListener('click', canvasClick(rightCanvas));
$('hint-btn').addEventListener('click', () => level && level.hint());
$('mute-btn').addEventListener('click', () => {
  toggleMute();
  refreshHud();
});
$('menu-btn').addEventListener('click', toMenu);
$('over-next').addEventListener('click', () => startLevel(levelIndex + 1));
$('over-retry').addEventListener('click', () => startLevel(levelIndex));
$('over-menu').addEventListener('click', toMenu);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!playScreen.hidden) toMenu();
    return;
  }
  if (event.key === 'h' || event.key === 'H') {
    if (level) level.hint();
  } else if (event.key === 'm' || event.key === 'M') {
    toggleMute();
    refreshHud();
  } else if (event.key === 'r' || event.key === 'R') {
    if (level) startLevel(levelIndex);
  } else if (['1', '2', '3'].includes(event.key)) {
    const i = Number(event.key) - 1;
    if (i < SCENES.length) startLevel(i);
  }
});

// Headless-driver hooks: start a level, read state, list the scenes.
window.__spotGame = {
  scenes: SCENES,
  start: (i) => startLevel(i),
  state: () => (level ? level.snapshot() : null),
  hint: () => level && level.hint(),
  hintsPerLevel: HINTS_PER_LEVEL,
};

buildMenu();
show(menuScreen);
