import { readFile, writeFile } from 'node:fs/promises';

function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0) throw new Error(`missing patch target: ${label}`);
  if (source.indexOf(needle, first + needle.length) >= 0) throw new Error(`ambiguous patch target: ${label}`);
  return source.slice(0, first) + replacement + source.slice(first + needle.length);
}

const mainPath = 'src/main.js';
let main = await readFile(mainPath, 'utf8');

main = replaceOnce(
  main,
  "import { GARDEN_CARDS } from './content/garden-cards.js';",
  "import { GARDEN_CARDS } from './content/garden-cards.js';\nimport { createCampaignState, endPlayerRound, resolveEnemyRound } from './game/campaign-core.js';\nimport { describeEnemyIntent } from './game/ai-director.js';",
  'Branch 8 imports',
);

main = replaceOnce(
  main,
  "function freshState() {\n  return {",
  "function freshState() {\n  const campaignAi = endPlayerRound(createCampaignState(808), { enemyIds: ['niko'] });\n  return {",
  'fresh AI setup',
);

main = replaceOnce(
  main,
  "    cardNotice: '',\n    helperNotice: '',\n  };",
  "    cardNotice: '',\n    helperNotice: '',\n    campaignAi,\n    enemyIntent: campaignAi.enemyIntents[0] ?? null,\n    enemyTurnResolved: false,\n    enemyOutcomeNotice: '',\n  };",
  'fresh AI fields',
);

main = replaceOnce(
  main,
  "  if (helperStart.effect) state.helperNotice = helperStart.effect.label;\n  state.screen = 'challenge';",
  "  if (helperStart.effect) state.helperNotice = helperStart.effect.label;\n  state.campaignAi = endPlayerRound(createCampaignState(808), { enemyIds: ['niko'] });\n  state.enemyIntent = state.campaignAi.enemyIntents[0] ?? null;\n  state.enemyTurnResolved = false;\n  state.enemyOutcomeNotice = '';\n  state.screen = 'challenge';",
  'standard AI reset',
);

main = replaceOnce(
  main,
  "state.helperNotice = state.helperNotice ?? '';",
  "state.helperNotice = state.helperNotice ?? '';\nif (!state.campaignAi) state.campaignAi = endPlayerRound(createCampaignState(808), { enemyIds: ['niko'] });\nstate.enemyIntent = state.enemyIntent ?? state.campaignAi.enemyIntents?.[0] ?? null;\nstate.enemyTurnResolved = Boolean(state.enemyTurnResolved);\nstate.enemyOutcomeNotice = state.enemyOutcomeNotice ?? '';",
  'AI restore defaults',
);

const helperFunctions = [
  "function districtTitle(districtId) {",
  "  const labels = { 'garden:dock': 'Anlegestelle', 'garden:learning': 'Gartenhaus', 'garden:village': 'Dorf', 'garden:arena': 'Turnier', 'garden:boss': 'Kais Festung' };",
  "  return labels[districtId] ?? districtId;",
  "}",
  "",
  "function enemyIntentHTML({ compact = false } = {}) {",
  "  const intent = state.enemyIntent;",
  "  if (!intent) return '';",
  "  const info = describeEnemyIntent(intent);",
  "  const target = state.campaignAi?.districts?.[intent.targetId] ?? {};",
  "  const resolved = state.enemyTurnResolved;",
  "  return `<section class=\"enemy-intent ${compact ? 'enemy-intent--compact' : ''} ${resolved ? 'enemy-intent--resolved' : ''}\" data-testid=\"enemy-intent\" aria-label=\"Gegnerabsicht ${info.enemyName}\">",
  "    <div class=\"enemy-intent__avatar\" aria-hidden=\"true\">${info.enemyName.slice(0, 1)}</div>",
  "    <div class=\"enemy-intent__copy\"><span class=\"eyebrow\">${resolved ? 'Ausgeführt' : 'Sichtbarer Intent'}</span><strong>${info.enemyName} · ${info.role}</strong><p>${info.actionLabel}: <b>${districtTitle(info.targetId)}</b>${info.secondaryTargetId ? ` / ${districtTitle(info.secondaryTargetId)}` : ''}</p></div>",
  "    <div class=\"enemy-intent__stats\"><span>Versorgung <b>${Number(target.supply ?? 0)}/5</b></span><span>Verteidigung <b>${Number(target.fortification ?? 0)}/3</b></span></div>",
  "  </section>`;",
  "}",
  "",
].join('\n');

main = replaceOnce(main, 'function renderGarden() {', `${helperFunctions}function renderGarden() {`, 'enemy intent renderer');

main = replaceOnce(
  main,
  "        </div>\n        ${helperPickerHTML()}",
  "        </div>\n        ${enemyIntentHTML()}\n        ${helperPickerHTML()}",
  'garden visible intent',
);

main = replaceOnce(
  main,
  "      ${cardHandHTML({ compact: true })}\n      <div class=\"challenge-card",
  "      ${cardHandHTML({ compact: true })}\n      ${enemyIntentHTML({ compact: true })}\n      ${state.enemyOutcomeNotice ? `<p class=\"enemy-outcome\" role=\"status\">${state.enemyOutcomeNotice}</p>` : ''}\n      <div class=\"challenge-card",
  'challenge visible intent',
);

const enemyTurnFunction = [
  "function renderEnemyTurn() {",
  "  const intent = state.enemyIntent;",
  "  const info = intent ? describeEnemyIntent(intent) : null;",
  "  root.innerHTML = shell(`",
  "    <section class=\"enemy-turn-screen\" data-testid=\"enemy-turn-screen\">",
  "      <span class=\"eyebrow\">Gegnerzug · Runde ${state.campaignAi?.round ?? 1}</span>",
  "      <h1>${info ? `${info.enemyName} ist dran` : 'Gegnerzug'}</h1>",
  "      <p>Die Absicht wurde schon vor deinen Aufgaben gezeigt. Erst jetzt wird sie sichtbar aufgelöst.</p>",
  "      ${enemyIntentHTML()}",
  "      <div class=\"enemy-turn-rule glass-card\"><strong>Fairness-Regel</strong><p>Maximal eine Hauptaktion pro Gegner. Keine zukünftigen Antworten, kein heimlicher Zug und keine Gebietsübernahme während du offline bist.</p></div>",
  "      <button class=\"primary-button\" data-action=\"resolve-enemy-turn\" data-testid=\"resolve-enemy-turn\">Nikos Zug ansehen</button>",
  "    </section>",
  "  `, { world: true });",
  "}",
  "",
].join('\n');

main = replaceOnce(main, 'function renderStandardResult() {', `${enemyTurnFunction}function renderStandardResult() {`, 'enemy turn screen');

main = replaceOnce(
  main,
  "  const enemyPressure = Math.max(0, 1 - bonuses.pressureReduction - state.helperPressureReduction);",
  "  const campaignPressure = Math.min(2, Number(state.campaignAi?.supplyPressure?.garden ?? 0) + (state.campaignAi?.blockades?.some((entry) => entry.regionId === 'garden') ? 1 : 0));\n  const enemyPressure = Math.max(0, 1 + campaignPressure - bonuses.pressureReduction - state.helperPressureReduction);",
  'standard campaign pressure',
);

main = replaceOnce(
  main,
  "    case 'challenge': renderStandardChallenge(); break;\n    case 'standard-result': renderStandardResult(); break;",
  "    case 'challenge': renderStandardChallenge(); break;\n    case 'enemy-turn': renderEnemyTurn(); break;\n    case 'standard-result': renderStandardResult(); break;",
  'enemy turn route',
);

main = replaceOnce(
  main,
  "      state.standardIndex += 1;\n      state.screen = state.standard.completed ? 'standard-result' : 'challenge';",
  "      state.standardIndex += 1;\n      if (state.standard.completed) state.screen = 'standard-result';\n      else if (state.standardIndex === 2 && !state.enemyTurnResolved) state.screen = 'enemy-turn';\n      else state.screen = 'challenge';",
  'enemy turn timing',
);

main = replaceOnce(
  main,
  "    case 'boss-intro': state.screen = 'boss-intro'; render(); break;",
  "    case 'resolve-enemy-turn': {\n      const intent = state.enemyIntent;\n      state.campaignAi = resolveEnemyRound(state.campaignAi);\n      state.enemyTurnResolved = true;\n      state.enemyOutcomeNotice = intent?.type === 'scout'\n        ? `Niko hat ${districtTitle(intent.targetId)} ausgekundschaftet. Deine Sprachaufgaben bleiben unverändert.`\n        : `Nikos angekündigte Aktion wurde sichtbar ausgeführt. Deine Sprachaufgaben bleiben unverändert.`;\n      state.screen = 'challenge';\n      render();\n      break;\n    }\n    case 'boss-intro': state.screen = 'boss-intro'; render(); break;",
  'resolve visible enemy turn',
);

await writeFile(mainPath, main);

const cssPath = 'src/styles.css';
let css = await readFile(cssPath, 'utf8');
css += `

/* Branch 8 – visible enemy intents, supply and defense */
.enemy-intent { display:grid; grid-template-columns:42px minmax(0,1fr) auto; align-items:center; gap:9px; padding:10px 11px; border:1px solid rgb(255 213 117 / 30%); border-radius:18px; background:linear-gradient(135deg, rgb(73 46 52 / 82%), rgb(35 58 63 / 88%)); box-shadow:0 10px 24px rgb(0 0 0 / 15%); }
.enemy-intent__avatar { width:42px; height:42px; display:grid; place-items:center; border-radius:50%; background:#f0bb5c; color:#263c35; font-weight:950; font-size:1.05rem; box-shadow:inset 0 0 0 3px rgb(255 255 255 / 22%); }
.enemy-intent__copy { min-width:0; display:grid; gap:2px; }
.enemy-intent__copy strong { color:#fff6dc; font-size:.82rem; line-height:1.15; }
.enemy-intent__copy p { margin:0; color:#d9e7e2; font-size:.72rem; line-height:1.3; }
.enemy-intent__stats { display:grid; gap:3px; text-align:right; }
.enemy-intent__stats span { color:#bdd4ce; font-size:.62rem; white-space:nowrap; }
.enemy-intent__stats b { color:#fff1ba; }
.enemy-intent--resolved { border-color:rgb(116 205 155 / 34%); background:linear-gradient(135deg, rgb(35 83 65 / 84%), rgb(28 57 62 / 88%)); }
.enemy-intent--compact { padding:7px 9px; grid-template-columns:32px minmax(0,1fr) auto; border-radius:15px; }
.enemy-intent--compact .enemy-intent__avatar { width:32px; height:32px; font-size:.82rem; }
.enemy-intent--compact .enemy-intent__copy p { font-size:.66rem; }
.enemy-intent--compact .enemy-intent__stats span { font-size:.56rem; }
.enemy-outcome { margin:0; padding:8px 10px; border-radius:13px; color:#dff6e5; background:rgb(42 105 76 / 58%); border:1px solid rgb(122 210 153 / 26%); font-size:.72rem; font-weight:800; line-height:1.35; }
.enemy-turn-screen { min-height:calc(100dvh - 92px); display:grid; align-content:center; gap:14px; width:min(620px,100%); margin:0 auto; padding:22px 16px 28px; }
.enemy-turn-screen h1 { margin:0; color:#fff8e6; font-size:clamp(1.8rem,7vw,3rem); }
.enemy-turn-screen > p { margin:0; color:#d7e5df; line-height:1.5; }
.enemy-turn-rule { padding:13px 15px; display:grid; gap:4px; }
.enemy-turn-rule strong { color:#ffe6a2; }
.enemy-turn-rule p { margin:0; color:#d4e4de; font-size:.8rem; line-height:1.4; }
@media (max-width:520px) {
  .enemy-intent { grid-template-columns:36px minmax(0,1fr); }
  .enemy-intent__avatar { width:36px; height:36px; }
  .enemy-intent__stats { grid-column:1 / -1; grid-template-columns:1fr 1fr; text-align:left; padding-left:45px; }
  .enemy-intent--compact { grid-template-columns:28px minmax(0,1fr); }
  .enemy-intent--compact .enemy-intent__avatar { width:28px; height:28px; }
  .enemy-intent--compact .enemy-intent__stats { display:none; }
}
@media (max-height:700px) and (max-width:900px) {
  .enemy-turn-screen { min-height:auto; padding-block:8px 12px; gap:8px; }
  .enemy-turn-screen h1 { font-size:1.45rem; }
  .enemy-turn-rule { padding:8px 10px; }
  .enemy-turn-rule p { font-size:.7rem; }
}
`;
await writeFile(cssPath, css);
