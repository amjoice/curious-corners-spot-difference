# curious-corners-spot-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/amjoice/curious-corners-spot-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/amjoice/curious-corners-spot-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Spot the Difference — Curious Corners**: an original spot-the-difference game that runs entirely from static files in a desktop browser — no build step, no network, no image or audio files. All three scenes are drawn in code on canvas.

## Run it

```sh
python3 -m http.server 8080 --directory game
# then open http://localhost:8080 in a desktop browser
```

Or serve `game/` with any static HTTP server and open `index.html`.

## How to play

Two pictures sit side by side. They look the same — they are not. Click a difference on **either** picture to circle it in green on both. Find them all before the clock runs out.

- **3 scenes, 29 differences**: Sunny Park (7, 2:30), Cozy Kitchen (10, 3:30), Midnight Observatory (12, 4:30)
- **Timer pressure**: the bar drains; wrong clicks cost 3 seconds
- **Hints (H)**: 3 per level, each pulses a gold ring around one unfound difference for a few seconds (−50 points)
- **Streaks**: consecutive finds earn bonus points; finishing a level pays a time bonus and 1–3 stars
- **Sound**: fully synthesised WebAudio chimes and buzzes (M to mute), no audio files
- **Keys**: H hint · M sound · R restart level · Esc menu · 1/2/3 pick a scene
- Best score per scene is kept in your browser (localStorage)

## Layout

- `game/index.html` — page shell, HUD, screens
- `game/styles.css` — all styling
- `game/src/main.js` — bootstrap, menu, keyboard, best scores
- `game/src/engine.js` — level state, timer, clicks, hints, scoring, markers
- `game/src/scenes.js` — the three hand-drawn scenes and their differences
- `game/src/helpers.js` — canvas drawing helpers
- `game/src/sound.js` — synthesised sound effects
- `screenshots/` — 4 real playthrough captures (the first is the cover)
- `main.ts` — hands the game in: copies `game/` + `screenshots/` to `/output` and writes `dossier.json` via the kit's `vendor/makefun-game.ts`

## Check the hand-in

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/game, out/screenshots, out/dossier.json
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=wab5mbny&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
