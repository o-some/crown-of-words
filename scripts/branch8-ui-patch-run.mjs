import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const sourcePath = 'scripts/branch8-ui-patch.mjs';
let source = await readFile(sourcePath, 'utf8');
const oldBlock = `main = replaceOnce(
  main,
  "  const enemyPressure = Math.max(0, 1 - bonuses.pressureReduction - state.helperPressureReduction);",
  "  const campaignPressure = Math.min(2, Number(state.campaignAi?.supplyPressure?.garden ?? 0) + (state.campaignAi?.blockades?.some((entry) => entry.regionId === 'garden') ? 1 : 0));\\n  const enemyPressure = Math.max(0, 1 + campaignPressure - bonuses.pressureReduction - state.helperPressureReduction);",
  'standard campaign pressure',
);`;
const newBlock = `main = replaceOnce(
  main,
  "function renderStandardResult() {\\n  const bonuses = deriveCardBonuses(state.cardHand);\\n  const enemyPressure = Math.max(0, 1 - bonuses.pressureReduction - state.helperPressureReduction);",
  "function renderStandardResult() {\\n  const bonuses = deriveCardBonuses(state.cardHand);\\n  const campaignPressure = Math.min(2, Number(state.campaignAi?.supplyPressure?.garden ?? 0) + (state.campaignAi?.blockades?.some((entry) => entry.regionId === 'garden') ? 1 : 0));\\n  const enemyPressure = Math.max(0, 1 + campaignPressure - bonuses.pressureReduction - state.helperPressureReduction);",
  'standard campaign pressure',
);`;
if (!source.includes(oldBlock)) throw new Error('Branch 8 standard result patch block not found');
source = source.replace(oldBlock, newBlock);
const fixedPath = '/tmp/branch8-ui-patch-fixed.mjs';
await writeFile(fixedPath, source);
await import(`${pathToFileURL(fixedPath).href}?v=${Date.now()}`);
