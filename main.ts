// Spot the Difference — Curious Corners: entrypoint.
//
// Hands the game in: copies game/ and screenshots/ from this repository
// into the output directory and writes /output/dossier.json with buildDossier
// from the kit's vendor/makefun-game.ts. Node 22, standard library only, no
// network, no build step. The grader runs this as `node /bot/main.ts` with
// MAKEFUN_OUTPUT_DIR=/output; locally, set MAKEFUN_OUTPUT_DIR to test.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function handIn() {
  mkdirSync(outDir, { recursive: true });
  // Start from a clean output directory so a stale dossier or screenshot
  // can never leak into the hand-in.
  for (const name of ['game', 'screenshots', 'dossier.json']) {
    const target = join(outDir, name);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }
  cpSync(join(repoDir, 'game'), join(outDir, 'game'), { recursive: true });
  cpSync(join(repoDir, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
  const dossier = buildDossier(outDir, DOSSIER_CAPS);
  writeFileSync(join(outDir, 'dossier.json'), dossier);
  console.log(`handed in: game/ + screenshots/ + dossier.json (${dossier.length} bytes) -> ${outDir}`);
}

handIn();
