// The three hand-drawn scenes of Curious Corners.
// Each scene is 640x420 and painted by draw(ctx, changed), where `changed`
// is a Set of difference ids applied to the right-hand picture only. The
// left picture always uses an empty set. Every difference's click zone is
// centred on the thing that visibly changes, so a find is always fair.

import { box, cloud, disc, flower, label, oval, ring, seg, shape, star5 } from './helpers.js';

export const SCENE_W = 640;
export const SCENE_H = 420;

// ---------------------------------------------------------- Sunny Park
function paintPark(ctx, c) {
  // Sky and sun.
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#6ec1f5');
  sky.addColorStop(1, '#d8f1ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 280);
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * i) / 4;
    seg(ctx, 78 + Math.cos(a) * 40, 66 + Math.sin(a) * 40, 78 + Math.cos(a) * 52, 66 + Math.sin(a) * 52, '#ffd93b', 5);
  }
  disc(ctx, 78, 66, 32, '#ffd93b');
  disc(ctx, 68, 60, 4, '#7a5b00');
  disc(ctx, 88, 60, 4, '#7a5b00');
  ctx.strokeStyle = '#7a5b00';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(78, 72, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  if (c.has('sun-shades')) {
    box(ctx, 56, 56, 44, 12, '#222222');
    seg(ctx, 56, 62, 48, 58, '#222222', 3);
    seg(ctx, 100, 62, 108, 58, '#222222', 3);
    disc(ctx, 64, 62, 3, '#ffffff');
    disc(ctx, 92, 62, 3, '#ffffff');
  }
  // Clouds, kite and butterfly in the sky.
  cloud(ctx, 205, 58, 1);
  if (!c.has('cloud-gone')) cloud(ctx, 425, 46, 0.9);
  cloud(ctx, 540, 96, 0.75);
  const kite = c.has('kite-color') ? '#0f766e' : '#e4572e';
  shape(ctx, [[305, 82], [333, 112], [305, 142], [277, 112]], kite);
  seg(ctx, 305, 82, 305, 142, '#ffffff', 2);
  seg(ctx, 277, 112, 333, 112, '#ffffff', 2);
  seg(ctx, 305, 142, 288, 190, '#8a7a66', 2);
  disc(ctx, 300, 158, 4, '#f6a609');
  disc(ctx, 292, 176, 4, '#f6a609');
  if (!c.has('butterfly-gone')) {
    oval(ctx, 172, 142, 12, 8, '#b388ff');
    oval(ctx, 198, 142, 12, 8, '#b388ff');
    oval(ctx, 174, 158, 9, 6, '#d1b3ff');
    oval(ctx, 196, 158, 9, 6, '#d1b3ff');
    seg(ctx, 185, 140, 185, 162, '#4a2d6b', 3);
  }
  // Ground: hills, path, pond.
  oval(ctx, 130, 470, 320, 190, '#7cc24a');
  oval(ctx, 540, 480, 340, 200, '#69b13c');
  box(ctx, 0, 330, 640, 90, '#79bd48');
  shape(ctx, [[285, 420], [355, 420], [335, 300], [305, 300]], '#e8dcc0');
  oval(ctx, 330, 362, 92, 24, '#4db2e8');
  oval(ctx, 330, 360, 80, 19, '#7cc8f0');
  oval(ctx, 310, 356, 18, 6, '#bfe6fb');
  // Tree on the right.
  box(ctx, 532, 190, 22, 110, '#7a4a21');
  disc(ctx, 543, 165, 52, '#2e7d32');
  disc(ctx, 505, 190, 34, '#388e3c');
  disc(ctx, 582, 190, 34, '#43a047');
  disc(ctx, 543, 140, 30, '#4caf50');
  // Bench with three slats.
  box(ctx, 108, 268, 84, 10, '#8d5a2b');
  box(ctx, 108, 288, 84, 10, '#8d5a2b');
  if (!c.has('bench-slat')) box(ctx, 108, 278, 84, 8, '#a06a35');
  box(ctx, 116, 298, 8, 34, '#6d4420');
  box(ctx, 176, 298, 8, 34, '#6d4420');
  box(ctx, 108, 258, 8, 40, '#6d4420');
  box(ctx, 184, 258, 8, 40, '#6d4420');
  // Dog and its ball.
  oval(ctx, 452, 330, 30, 22, '#c68a4b');
  disc(ctx, 478, 306, 17, '#c68a4b');
  shape(ctx, [[466, 292], [472, 276], [480, 292]], '#8a5a2b');
  disc(ctx, 484, 302, 2.5, '#222222');
  disc(ctx, 490, 308, 4, '#5d3a1a');
  seg(ctx, 424, 322, 408, 306, '#8a5a2b', 6);
  if (!c.has('ball-gone')) {
    disc(ctx, 502, 364, 13, '#e4572e');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(502, 364, 13, -0.6, 0.9);
    ctx.stroke();
  }
  // Flowers along the bottom.
  if (!c.has('flower-gone')) flower(ctx, 60, 378, '#e4572e');
  flower(ctx, 120, 392, '#ffd93b');
  flower(ctx, 210, 384, '#ff7eb6');
  flower(ctx, 470, 392, '#ffffff');
  flower(ctx, 580, 380, '#ff8c42');
  flower(ctx, 255, 398, '#b388ff');
}

const PARK_DIFFS = [
  { id: 'sun-shades', x: 78, y: 66, r: 42, label: 'Sunglasses on the sun' },
  { id: 'cloud-gone', x: 425, y: 46, r: 48, label: 'Missing cloud' },
  { id: 'kite-color', x: 305, y: 112, r: 36, label: 'Kite changed colour' },
  { id: 'ball-gone', x: 502, y: 364, r: 24, label: "Dog's ball is gone" },
  { id: 'flower-gone', x: 60, y: 378, r: 20, label: 'Missing red flower' },
  { id: 'bench-slat', x: 150, y: 280, r: 30, label: 'Bench slat is missing' },
  { id: 'butterfly-gone', x: 185, y: 150, r: 26, label: 'Butterfly flew away' },
];

// -------------------------------------------------------- Cozy Kitchen
function paintKitchen(ctx, c) {
  // Wall, wooden floor and the rug.
  box(ctx, 0, 0, 640, 300, '#f6e3c2');
  box(ctx, 0, 300, 640, 120, '#c89b6a');
  ctx.strokeStyle = '#b3854f';
  for (let x = 0; x <= 640; x += 80) seg(ctx, x, 300, x - 40, 420, '#b3854f', 2);
  seg(ctx, 0, 360, 640, 360, '#b3854f', 2);
  oval(ctx, 320, 396, 130, 18, '#e8dcc0');
  oval(ctx, 320, 396, 96, 12, c.has('rug-stripe') ? '#2a9d8f' : '#e4572e');
  // Window with red curtains and a potted plant.
  box(ctx, 50, 40, 140, 160, '#ffffff');
  box(ctx, 60, 50, 120, 140, '#aee3ff');
  disc(ctx, 90, 80, 18, '#ffd93b');
  oval(ctx, 140, 70, 26, 10, '#ffffff');
  oval(ctx, 160, 100, 20, 8, '#ffffff');
  seg(ctx, 120, 50, 120, 190, '#ffffff', 5);
  seg(ctx, 60, 120, 180, 120, '#ffffff', 5);
  box(ctx, 46, 34, 34, 166, '#e4572e');
  box(ctx, 160, 34, 34, 166, '#e4572e');
  if (!c.has('curtain-dot')) {
    disc(ctx, 177, 110, 7, '#ffffff');
    disc(ctx, 177, 150, 7, '#ffffff');
  }
  disc(ctx, 63, 80, 6, '#ffffff');
  disc(ctx, 63, 130, 6, '#ffffff');
  seg(ctx, 40, 34, 200, 34, '#7a4a21', 6);
  shape(ctx, [[104, 190], [136, 190], [130, 212], [110, 212]], '#c96f2e');
  seg(ctx, 120, 190, 120, 168, '#2e7d32', 4);
  oval(ctx, 106, 168, 12, 8, '#43a047');
  oval(ctx, 134, 168, 12, 8, '#43a047');
  disc(ctx, 120, 160, 8, c.has('flower-color') ? '#ffd93b' : '#ff7eb6');
  // Wall clock: 3:00 on the left, 4:30 on the right.
  disc(ctx, 480, 75, 34, '#ffffff');
  ring(ctx, 480, 75, 34, '#7a4a21', 4);
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * i) / 6;
    disc(ctx, 480 + Math.cos(a) * 28, 75 + Math.sin(a) * 28, 1.6, '#7a4a21');
  }
  if (c.has('clock-hands')) {
    seg(ctx, 480, 75, 497, 90, '#222222', 3);
    seg(ctx, 480, 75, 480, 98, '#222222', 3);
  } else {
    seg(ctx, 480, 75, 480, 52, '#222222', 3);
    seg(ctx, 480, 75, 500, 75, '#222222', 3);
    seg(ctx, 480, 75, 462, 88, '#e4572e', 2);
  }
  disc(ctx, 480, 75, 3, '#222222');
  // Shelf with three hanging pans.
  box(ctx, 320, 58, 260, 10, '#7a4a21');
  const pan = (x) => {
    disc(ctx, x, 112, 20, '#5b6770');
    disc(ctx, x, 112, 14, '#7c8a94');
    seg(ctx, x, 92, x, 78, '#5b6770', 5);
  };
  pan(372);
  if (!c.has('pan-gone')) pan(432);
  pan(492);
  // Table with fruit bowl, cookbook and mug.
  box(ctx, 180, 288, 300, 16, '#8d5a2b');
  box(ctx, 200, 304, 12, 60, '#6d4420');
  box(ctx, 448, 304, 12, 60, '#6d4420');
  oval(ctx, 330, 272, 34, 10, '#3d6db5');
  shape(ctx, [[296, 272], [364, 272], [352, 290], [308, 290]], '#3d6db5');
  disc(ctx, 318, 262, 10, '#e4572e');
  if (!c.has('apple-gone')) disc(ctx, 342, 260, 10, '#e4572e');
  disc(ctx, 330, 252, 10, '#ff8c42');
  seg(ctx, 330, 244, 334, 236, '#2e7d32', 2);
  ctx.save();
  ctx.translate(250, 278);
  ctx.rotate(-0.08);
  ctx.beginPath();
  ctx.roundRect(-26, -12, 52, 26, 4);
  ctx.fillStyle = c.has('book-color') ? '#3d6db5' : '#e4572e';
  ctx.fill();
  ctx.restore();
  label(ctx, 'COOK', 250, 278, 10, '#ffffff', 'center', '800');
  box(ctx, 404, 262, 26, 24, '#0f766e');
  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (c.has('mug-handle')) ctx.arc(404, 274, 8, Math.PI / 2, (Math.PI * 3) / 2);
  else ctx.arc(430, 274, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Stove, kettle and its steam.
  box(ctx, 452, 306, 130, 58, '#5b6770');
  disc(ctx, 482, 330, 12, '#222222');
  disc(ctx, 542, 330, 12, '#222222');
  disc(ctx, 512, 330, 12, '#e4572e');
  oval(ctx, 512, 292, 26, 18, '#b9c4cc');
  shape(ctx, [[500, 276], [524, 276], [518, 262], [506, 262]], '#b9c4cc');
  seg(ctx, 488, 286, 472, 272, '#8a97a0', 5);
  seg(ctx, 538, 284, 552, 272, '#8a97a0', 5);
  if (!c.has('steam-gone')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(512, 256);
    ctx.quadraticCurveTo(504, 242, 512, 230);
    ctx.quadraticCurveTo(520, 218, 512, 206);
    ctx.stroke();
  }
  // Cat on a chair, tail up or down.
  box(ctx, 560, 330, 60, 8, '#7a4a21');
  box(ctx, 566, 338, 8, 40, '#7a4a21');
  box(ctx, 606, 338, 8, 40, '#7a4a21');
  oval(ctx, 590, 318, 22, 16, '#f0a35e');
  disc(ctx, 606, 300, 12, '#f0a35e');
  shape(ctx, [[598, 290], [602, 280], [606, 290]], '#f0a35e');
  shape(ctx, [[608, 290], [612, 280], [616, 290]], '#f0a35e');
  disc(ctx, 610, 298, 2, '#222222');
  if (c.has('cat-tail')) seg(ctx, 570, 318, 552, 296, '#f0a35e', 6);
  else seg(ctx, 570, 318, 552, 330, '#f0a35e', 6);
}

const KITCHEN_DIFFS = [
  { id: 'clock-hands', x: 480, y: 75, r: 36, label: 'Clock shows a different time' },
  { id: 'cat-tail', x: 560, y: 310, r: 30, label: "Cat's tail moved" },
  { id: 'steam-gone', x: 512, y: 228, r: 28, label: 'Kettle steam is gone' },
  { id: 'apple-gone', x: 342, y: 260, r: 20, label: 'Apple missing from the bowl' },
  { id: 'flower-color', x: 120, y: 160, r: 20, label: 'Plant flower changed colour' },
  { id: 'mug-handle', x: 417, y: 274, r: 24, label: 'Mug handle switched sides' },
  { id: 'curtain-dot', x: 177, y: 130, r: 24, label: 'Curtain spots vanished' },
  { id: 'pan-gone', x: 432, y: 112, r: 28, label: 'Hanging pan is missing' },
  { id: 'rug-stripe', x: 320, y: 396, r: 32, label: 'Rug stripe changed colour' },
  { id: 'book-color', x: 250, y: 278, r: 26, label: 'Cookbook changed colour' },
];

// -------------------------------------------------- Midnight Observatory
const STARS = [
  [40, 40], [120, 26], [205, 58], [270, 34], [430, 30], [470, 70], [610, 30],
  [30, 130], [150, 120], [250, 100], [420, 130], [600, 150], [90, 200], [560, 210],
  [180, 60], [330, 40], [520, 130], [60, 90], [380, 90], [230, 150],
];

function paintObservatory(ctx, c) {
  // Night sky, stars, constellation and comet.
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#0d1b3e');
  sky.addColorStop(1, '#274b7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 420);
  for (const [x, y] of STARS) {
    if (c.has('star-gone') && x === 205 && y === 58) continue;
    star5(ctx, x, y, 4, 2, '#ffffff');
  }
  if (!c.has('constellation')) {
    seg(ctx, 330, 55, 352, 70, 'rgba(255,255,255,0.7)', 1.5);
    seg(ctx, 352, 70, 372, 52, 'rgba(255,255,255,0.7)', 1.5);
  }
  star5(ctx, 330, 55, 6, 2.5, '#ffe27a');
  star5(ctx, 352, 70, 6, 2.5, '#ffe27a');
  star5(ctx, 372, 52, 6, 2.5, '#ffe27a');
  if (!c.has('comet-gone')) {
    seg(ctx, 585, 55, 540, 88, 'rgba(255,255,255,0.9)', 3);
    disc(ctx, 588, 52, 7, '#ffffff');
    disc(ctx, 588, 52, 3, '#ffe27a');
  }
  // The Moon, with an extra crater on the right.
  disc(ctx, 90, 75, 30, '#f4f1de');
  disc(ctx, 80, 68, 6, '#d8d2b8');
  disc(ctx, 100, 84, 8, '#d8d2b8');
  if (c.has('moon-crater')) disc(ctx, 96, 62, 5, '#d8d2b8');
  // Dome with a slit window, telescope and floor.
  ctx.fillStyle = '#1d3557';
  ctx.beginPath();
  ctx.arc(320, 330, 150, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#457b9d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(320, 330, 150, Math.PI, 0);
  ctx.stroke();
  if (c.has('dome-window')) {
    box(ctx, 306, 196, 28, 60, '#0d1b3e');
  } else {
    box(ctx, 306, 196, 28, 60, '#aee3ff');
    seg(ctx, 320, 196, 320, 256, '#457b9d', 2);
  }
  box(ctx, 0, 330, 640, 90, '#22304a');
  seg(ctx, 0, 330, 640, 330, '#457b9d', 3);
  // Telescope, tilted a little higher on the right.
  ctx.save();
  ctx.translate(320, 250);
  ctx.rotate(c.has('scope-angle') ? -0.5 : -0.18);
  ctx.beginPath();
  ctx.roundRect(-14, -90, 28, 110, 8);
  ctx.fillStyle = '#e9c46a';
  ctx.fill();
  disc(ctx, 0, -92, 14, '#457b9d');
  disc(ctx, 0, -92, 8, '#aee3ff');
  ctx.restore();
  box(ctx, 312, 250, 16, 80, '#5b6770');
  oval(ctx, 320, 334, 34, 8, '#3d4750');
  // Saturn poster on the wall.
  disc(ctx, 500, 85, 22, '#e9c46a');
  if (!c.has('ring-gone')) {
    ctx.strokeStyle = '#f4d58d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(500, 85, 38, 10, -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  label(ctx, 'SATURN', 500, 122, 11, '#ffffff', 'center', '800');
  // Rocket model on its stand.
  box(ctx, 552, 330, 26, 8, '#5b6770');
  const rocket = c.has('rocket-color') ? '#f4f1de' : '#e4572e';
  shape(ctx, [[565, 268], [577, 296], [553, 296]], rocket);
  box(ctx, 553, 296, 24, 34, rocket);
  shape(ctx, [[553, 330], [545, 342], [553, 330]], '#f6a609');
  shape(ctx, [[577, 330], [585, 342], [577, 330]], '#f6a609');
  disc(ctx, 565, 306, 6, '#aee3ff');
  // Bookshelf with five spines.
  box(ctx, 40, 240, 90, 110, '#7a4a21');
  const spines = ['#e4572e', '#2a9d8f', '#f6a609', '#3d6db5', '#b388ff'];
  spines.forEach((col, i) => {
    const bc = c.has('book-spine') && i === 2 ? '#7b2fbe' : col;
    box(ctx, 48 + i * 15, 252, 12, 44, bc);
  });
  box(ctx, 40, 296, 90, 8, '#5d3a1a');
  spines.forEach((col, i) => {
    box(ctx, 48 + i * 15, 308, 12, 34, i % 2 ? '#2a9d8f' : '#e4572e');
  });
  // Desk lamp with a warm glow, off on the right.
  oval(ctx, 200, 348, 26, 7, '#3d4750');
  seg(ctx, 200, 348, 200, 300, '#5b6770', 6);
  ctx.save();
  ctx.translate(200, 292);
  ctx.rotate(0.5);
  shape(ctx, [[-18, 0], [18, 0], [10, -26], [-10, -26]], '#f6a609');
  ctx.restore();
  if (!c.has('lamp-off')) {
    const glow = ctx.createRadialGradient(200, 292, 4, 200, 292, 70);
    glow.addColorStop(0, 'rgba(255, 233, 150, 0.55)');
    glow.addColorStop(1, 'rgba(255, 233, 150, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(120, 212, 160, 160);
  }
  // Control panel and the coffee cup beside it.
  ctx.beginPath();
  ctx.roundRect(380, 320, 150, 62, 10);
  ctx.fillStyle = '#1d3557';
  ctx.fill();
  ctx.strokeStyle = '#457b9d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(380, 320, 150, 62, 10);
  ctx.stroke();
  disc(ctx, 400, 340, 8, c.has('panel-light') ? '#e4572e' : '#43a047');
  disc(ctx, 425, 340, 8, '#f6a609');
  disc(ctx, 450, 340, 8, '#3d6db5');
  box(ctx, 480, 332, 34, 16, '#0d1b3e');
  seg(ctx, 484, 344, 510, 336, '#43a047', 2);
  disc(ctx, 400, 366, 6, '#ffffff');
  disc(ctx, 420, 366, 6, '#ffffff');
  box(ctx, 470, 348, 22, 18, '#f4f1de');
  ctx.strokeStyle = '#f4f1de';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(492, 357, 6, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  if (!c.has('steam-gone')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(481, 344);
    ctx.quadraticCurveTo(476, 334, 481, 326);
    ctx.quadraticCurveTo(486, 318, 481, 310);
    ctx.stroke();
  }
}

const OBSERVATORY_DIFFS = [
  { id: 'moon-crater', x: 90, y: 75, r: 32, label: 'Extra crater on the Moon' },
  { id: 'ring-gone', x: 500, y: 85, r: 38, label: "Saturn's ring is gone" },
  { id: 'scope-angle', x: 320, y: 210, r: 42, label: 'Telescope tilted higher' },
  { id: 'rocket-color', x: 565, y: 300, r: 26, label: 'Rocket changed colour' },
  { id: 'star-gone', x: 205, y: 58, r: 18, label: 'A bright star vanished' },
  { id: 'panel-light', x: 400, y: 340, r: 20, label: 'Console light turned red' },
  { id: 'book-spine', x: 90, y: 274, r: 22, label: 'Book spine changed colour' },
  { id: 'lamp-off', x: 200, y: 292, r: 30, label: 'Desk lamp went dark' },
  { id: 'steam-gone', x: 481, y: 328, r: 22, label: 'Coffee steam is gone' },
  { id: 'comet-gone', x: 585, y: 55, r: 30, label: 'Comet disappeared' },
  { id: 'constellation', x: 352, y: 62, r: 32, label: 'Constellation lines are gone' },
  { id: 'dome-window', x: 320, y: 226, r: 30, label: 'Dome window closed' },
];

export const SCENES = [
  {
    id: 'park',
    name: 'Sunny Park',
    blurb: 'A lazy afternoon in the park',
    seconds: 150,
    diffs: PARK_DIFFS,
    paint: paintPark,
  },
  {
    id: 'kitchen',
    name: 'Cozy Kitchen',
    blurb: 'Tea is on, the cat is watching',
    seconds: 210,
    diffs: KITCHEN_DIFFS,
    paint: paintKitchen,
  },
  {
    id: 'observatory',
    name: 'Midnight Observatory',
    blurb: 'Stars, Saturn and one sleepy astronomer',
    seconds: 270,
    diffs: OBSERVATORY_DIFFS,
    paint: paintObservatory,
  },
];

// Paint a scene onto a fresh offscreen canvas. `changed` holds the ids to
// apply (empty for the left panel, every id for the right).
export function paintScene(scene, changed) {
  const canvas = document.createElement('canvas');
  canvas.width = SCENE_W;
  canvas.height = SCENE_H;
  scene.paint(canvas.getContext('2d'), changed);
  return canvas;
}
