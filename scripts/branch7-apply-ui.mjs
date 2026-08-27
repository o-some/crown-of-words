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
  "import { clearStandaloneSave, loadStandaloneSave, saveStandaloneSave } from './adapters/standalone-storage.js';",
  "import { clearStandaloneSave, loadStandaloneSave, saveStandaloneSave } from './adapters/standalone-storage.js';\nimport { createCardHand, deriveCardBonuses, resolveSelectedCard, selectCard } from './game/card-core.js';\nimport { HELPER_DEFINITIONS, applyHelperEvent, createHelperState, helperDefinition, selectHelper } from './game/helper-core.js';\nimport { GARDEN_CARDS } from './content/garden-cards.js';",
  'imports',
);

main = replaceOnce(
  main,
  "let state;",
  "let state;\nlet draggedTokenIndex = null;",
  'drag state',
);

main = replaceOnce(
  main,
  "    helpOpen: false,\n  };",
  "    helpOpen: false,\n    cardHand: createCardHand(GARDEN_CARDS),\n    helper: createHelperState('helper-meli-food'),\n    helperPressureReduction: 0,\n    cardNotice: '',\n    helperNotice: '',\n  };",
  'fresh loadout state',
);

main = replaceOnce(
  main,
  "  state.builtTokens = [];\n  state.screen = 'challenge';",
  "  state.builtTokens = [];\n  state.cardHand = createCardHand(GARDEN_CARDS);\n  state.helper = createHelperState(state.helper?.helperId ?? 'helper-meli-food');\n  state.helperPressureReduction = 0;\n  state.cardNotice = '';\n  state.helperNotice = '';\n  const helperStart = applyHelperEvent(state.helper, 'encounter-start', { regionId: 'garden' });\n  state.helper = helperStart.state;\n  if (helperStart.effect) state.helperNotice = helperStart.effect.label;\n  state.screen = 'challenge';",
  'standard reset loadout',
);

main = replaceOnce(
  main,
  "  state.swapNotice = null;\n  state.screen = 'boss';",
  "  state.swapNotice = null;\n  state.cardHand = createCardHand(GARDEN_CARDS);\n  state.helper = createHelperState(state.helper?.helperId ?? 'helper-meli-food');\n  state.helperPressureReduction = 0;\n  state.cardNotice = '';\n  state.helperNotice = '';\n  const helperStart = applyHelperEvent(state.helper, 'encounter-start', { regionId: 'garden' });\n  state.helper = helperStart.state;\n  if (helperStart.effect) state.helperNotice = helperStart.effect.label;\n  state.screen = 'boss';",
  'boss reset loadout',
);

main = replaceOnce(
  main,
  "state.helpOpen = Boolean(state.helpOpen);",
  "state.helpOpen = Boolean(state.helpOpen);\nstate.cardHand = state.cardHand ?? createCardHand(GARDEN_CARDS);\nstate.helper = state.helper ?? createHelperState('helper-meli-food');\nstate.helperPressureReduction = Number(state.helperPressureReduction ?? 0);\nstate.cardNotice = state.cardNotice ?? '';\nstate.helperNotice = state.helperNotice ?? '';",
  'restore loadout state',
);

main = replaceOnce(
  main,
  "function renderGarden() {",
  `function helperPickerHTML() {
  return \`<section class="loadout-block" aria-labelledby="helper-title">
    <div class="loadout-block__head"><span class="eyebrow">Kommandant</span><strong id="helper-title">Wähle deinen Helfer</strong></div>
    <div class="helper-picker" data-testid="helper-picker">
      \${HELPER_DEFINITIONS.map((helper) => {
        const selected = state.helper?.helperId === helper.id;
        return \`<button class="helper-option \${selected ? 'helper-option--selected' : ''}" data-helper-id="\${helper.id}" aria-pressed="\${selected}">
          <img src="\${asset(helper.asset)}" alt="\${helper.name}" />
          <span><strong>\${helper.name}</strong><small>\${helper.focus}</small></span>
        </button>\`;
      }).join('')}
    </div>
  </section>\`;
}

function cardHandHTML({ compact = false } = {}) {
  return \`<section class="card-hand \${compact ? 'card-hand--compact' : ''}" data-testid="card-hand" aria-label="Vier Taktikkarten">
    \${state.cardHand.cards.map((entry) => {
      const card = entry.definition;
      const selected = state.cardHand.selectedId === card.id;
      const disabled = entry.status !== 'ready';
      const statusLabel = entry.status === 'played' ? 'gespielt' : entry.status === 'exhausted' ? 'erschöpft' : selected ? 'gewählt' : 'bereit';
      return \`<button class="tactic-card tactic-card--\${entry.status} \${selected ? 'tactic-card--selected' : ''}" data-card-id="\${card.id}" aria-pressed="\${selected}" \${disabled ? 'disabled' : ''}>
        <span class="tactic-card__cost">\${card.cost}</span>
        <strong>\${card.name}</strong>
        <small>\${compact ? statusLabel : card.description}</small>
        <span class="tactic-card__status">\${statusLabel}</span>
      </button>\`;
    }).join('')}
  </section>\`;
}

function renderGarden() {`,
  'loadout render helpers',
);

main = replaceOnce(
  main,
  "          <p>Fünf Aufgaben. Die letzte ist eine Crown Sentence. Deine Lernleistung entscheidet über den Sieg.</p>\n        </div>\n        <button class=\"primary-button\" data-action=\"start-standard\" data-testid=\"start-standard\">Wortduell starten</button>",
  "          <p>Fünf Aufgaben. Die letzte ist eine Crown Sentence. Deine Lernleistung entscheidet über den Sieg.</p>\n        </div>\n        ${helperPickerHTML()}\n        <div class=\"loadout-block\"><div class=\"loadout-block__head\"><span class=\"eyebrow\">Vier-Karten-Hand</span><strong>Sprache schaltet Taktik frei</strong></div>${cardHandHTML()}</div>\n        <button class=\"primary-button\" data-action=\"start-standard\" data-testid=\"start-standard\">Mit diesem Team starten</button>",
  'garden loadout',
);

main = replaceOnce(
  main,
  "        <div class=\"sentence-builder__zone\" aria-label=\"Gebauter Satz\">",
  "        <div class=\"sentence-builder__zone\" data-token-dropzone tabindex=\"0\" aria-label=\"Gebauter Satz – Wörter können getippt oder hierher gezogen werden\">",
  'sentence dropzone',
);

main = replaceOnce(
  main,
  "${challenge.tokens.map((token, index) => `<button class=\"token\" data-token-index=\"${index}\" ${built.includes(token) ? 'disabled' : ''}>${token}</button>`).join('')}",
  "${challenge.tokens.map((token, index) => `<button class=\"token\" data-token-index=\"${index}\" data-drag-token-index=\"${index}\" draggable=\"true\" ${built.includes(token) ? 'disabled' : ''}>${token}</button>`).join('')}",
  'draggable sentence tokens',
);

main = replaceOnce(
  main,
  "      ${state.swapNotice ? `<div class=\"cheat-notice\">Kai schummelt! ${state.swapNotice}</div>` : ''}\n      <button class=\"primary-button\"",
  "      ${state.swapNotice ? `<div class=\"cheat-notice\">Kai schummelt! ${state.swapNotice}</div>` : ''}\n      ${state.cardNotice ? `<div class=\"tactic-notice\">${state.cardNotice}</div>` : ''}\n      ${state.helperNotice ? `<div class=\"helper-notice\">${state.helperNotice}</div>` : ''}\n      <button class=\"primary-button\"",
  'feedback notices',
);

main = replaceOnce(
  main,
  "      ${progressHTML(state.standard, state.standardIndex + 1, GARDEN_STANDARD_CHALLENGES.length)}\n      <div class=\"challenge-card",
  "      ${progressHTML(state.standard, state.standardIndex + 1, GARDEN_STANDARD_CHALLENGES.length)}\n      ${cardHandHTML({ compact: true })}\n      <div class=\"challenge-card",
  'standard card hand',
);

main = replaceOnce(
  main,
  "function renderStandardResult() {\n  const result = resolveStandardEncounter(state.standard, { tacticPower: 1, enemyPressure: 1 });",
  "function renderStandardResult() {\n  const bonuses = deriveCardBonuses(state.cardHand);\n  const enemyPressure = Math.max(0, 1 - bonuses.pressureReduction - state.helperPressureReduction);\n  const result = resolveStandardEncounter(state.standard, { tacticPower: bonuses.tacticPower, enemyPressure });",
  'standard tactical result',
);

main = replaceOnce(
  main,
  "      ${bossQueueHTML()}\n      ${state.anchorMessage ? `<p class=\"anchor-message\">${state.anchorMessage}</p>` : ''}\n      <div class=\"challenge-card",
  "      ${bossQueueHTML()}\n      ${cardHandHTML({ compact: true })}\n      ${state.anchorMessage ? `<p class=\"anchor-message\">${state.anchorMessage}</p>` : ''}\n      <div class=\"challenge-card",
  'boss card hand',
);

main = replaceOnce(
  main,
  "function renderBossResult() {\n  const result = resolveBossEncounter(state.boss, { tacticPower: 4, enemyPressure: 1, bossHp: state.bossHp });",
  "function renderBossResult() {\n  const bonuses = deriveCardBonuses(state.cardHand);\n  const enemyPressure = Math.max(0, 1 - bonuses.pressureReduction - state.helperPressureReduction);\n  const result = resolveBossEncounter(state.boss, { tacticPower: bonuses.tacticPower, enemyPressure, bossHp: state.bossHp });",
  'boss tactical result',
);

const submitStart = main.indexOf('function submitAnswer(answer) {');
const clickStart = main.indexOf("root.addEventListener('click'", submitStart);
if (submitStart < 0 || clickStart < 0) throw new Error('submitAnswer block not found');
main = main.slice(0, submitStart) + `function submitAnswer(answer) {
  if (state.feedback) return;
  const bossMode = state.screen === 'boss';
  const challenge = bossMode ? bossCurrent() : standardCurrent();
  if (!challenge) return;

  const attempt = { answer, hintLevel: state.hintLevel };
  let result;
  if (bossMode) {
    state.boss = evaluateChallenge(state.boss, challenge.id, attempt);
    result = state.boss.results[challenge.id];
    if (result.solved) {
      state.bossHp = Math.max(0, state.bossHp - 1);
      if (!challenge.crown) state.anchorReady = true;
    }
    state.kai = resolveKaiTask(state.kai, challenge.id);
    state.swapNotice = state.kai.lastSwap ? 'Zwei kommende Aufträge haben ihre Plätze getauscht.' : null;
  } else {
    state.standard = evaluateChallenge(state.standard, challenge.id, attempt);
    result = state.standard.results[challenge.id];
  }

  const cardResolution = resolveSelectedCard(state.cardHand, { correct: result.solved });
  state.cardHand = cardResolution.state;
  state.cardNotice = '';
  if (cardResolution.outcome) {
    const card = GARDEN_CARDS.find((item) => item.id === cardResolution.outcome.cardId);
    if (cardResolution.outcome.type === 'played') state.cardNotice = \`${card.name} aktiviert – \${card.description}\`;
    if (cardResolution.outcome.type === 'refunded') state.cardNotice = \`Entdecker-Rückerstattung: ${card.name} bleibt bereit.\`;
    if (cardResolution.outcome.type === 'exhausted') state.cardNotice = \`${card.name} ist für diese Begegnung erschöpft.\`;
  }

  state.helperNotice = '';
  if (!result.solved) {
    const helperResolution = applyHelperEvent(state.helper, 'answer-wrong', { regionId: 'garden' });
    state.helper = helperResolution.state;
    if (helperResolution.effect) {
      state.helperNotice = helperResolution.effect.label;
      if (helperResolution.effect.type === 'pressure-reduction') state.helperPressureReduction += Number(helperResolution.effect.amount ?? 0);
    }
  }

  state.feedback = { ...result, correctAnswer: challenge.correctAnswer };
  state.builtTokens = [];
  render();
}

` + main.slice(clickStart);

main = replaceOnce(
  main,
  "  if (target.dataset.answer) {",
  "  if (target.dataset.helperId) {\n    state.helper = selectHelper(state.helper, target.dataset.helperId);\n    state.helperNotice = '';\n    render();\n    return;\n  }\n\n  if (target.dataset.cardId) {\n    state.cardHand = selectCard(state.cardHand, target.dataset.cardId);\n    const selected = state.cardHand.cards.find((entry) => entry.definition.id === state.cardHand.selectedId);\n    state.cardNotice = selected ? `${selected.definition.name} wartet auf eine richtige Sprachantwort.` : '';\n    render();\n    return;\n  }\n\n  if (target.dataset.answer) {",
  'loadout click handling',
);

main = replaceOnce(
  main,
  "    case 'next-standard':\n      state.feedback = null;\n      state.hintLevel = 0;",
  "    case 'next-standard':\n      state.feedback = null;\n      state.hintLevel = 0;\n      state.cardNotice = '';\n      state.helperNotice = '';",
  'standard notice cleanup',
);

main = replaceOnce(
  main,
  "    case 'next-boss':\n      state.feedback = null;\n      state.hintLevel = 0;",
  "    case 'next-boss':\n      state.feedback = null;\n      state.hintLevel = 0;\n      state.cardNotice = '';\n      state.helperNotice = '';",
  'boss notice cleanup',
);

main = replaceOnce(
  main,
  "});\n\nrender();",
  `});

root.addEventListener('dragstart', (event) => {
  const token = event.target.closest('[data-drag-token-index]');
  if (!token || token.disabled) return;
  draggedTokenIndex = Number(token.dataset.dragTokenIndex);
  event.dataTransfer?.setData('text/plain', String(draggedTokenIndex));
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
});

root.addEventListener('dragover', (event) => {
  if (event.target.closest('[data-token-dropzone]')) event.preventDefault();
});

root.addEventListener('drop', (event) => {
  if (!event.target.closest('[data-token-dropzone]')) return;
  event.preventDefault();
  const raw = event.dataTransfer?.getData('text/plain');
  const index = raw !== '' && raw != null ? Number(raw) : draggedTokenIndex;
  const challenge = state.screen === 'boss' ? bossCurrent() : standardCurrent();
  if (!challenge || !Number.isInteger(index) || index < 0 || index >= challenge.tokens.length) return;
  const token = challenge.tokens[index];
  if (!state.builtTokens.includes(token)) state.builtTokens.push(token);
  draggedTokenIndex = null;
  render();
});

root.addEventListener('dragend', () => { draggedTokenIndex = null; });

render();`,
  'drag drop listeners',
);

await writeFile(mainPath, main);

const cssPath = 'src/styles.css';
let css = await readFile(cssPath, 'utf8');
css += `

/* Branch 7 – cards, helpers and accessible sentence input */
.loadout-block { display: grid; gap: 9px; }
.loadout-block__head { display: flex; align-items: end; justify-content: space-between; gap: 10px; }
.loadout-block__head > strong { font-size: .9rem; color: #fff8dc; }
.helper-picker { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
.helper-option { min-width: 0; min-height: 72px; padding: 7px; display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 7px; border: 1px solid var(--line); border-radius: 17px; color: #eff8f4; text-align: left; background: rgb(255 255 255 / 7%); cursor: pointer; }
.helper-option img { width: 42px; height: 50px; object-fit: contain; filter: drop-shadow(0 5px 8px rgb(0 0 0 / 22%)); }
.helper-option span { min-width: 0; display: grid; gap: 1px; }
.helper-option strong { font-size: .8rem; }
.helper-option small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #bfd8d1; font-size: .62rem; }
.helper-option--selected { border-color: #ffe590; background: rgb(247 200 93 / 13%); box-shadow: 0 0 0 2px rgb(247 200 93 / 12%); }
.card-hand { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
.tactic-card { position: relative; min-width: 0; min-height: 102px; padding: 12px 9px 8px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; border: 1px solid rgb(255 255 255 / 16%); border-radius: 17px; color: #fff9e5; text-align: left; background: linear-gradient(155deg, rgb(48 111 81 / 82%), rgb(17 52 55 / 92%)); cursor: pointer; overflow: hidden; }
.tactic-card::after { content: ''; position: absolute; width: 58px; height: 58px; right: -26px; bottom: -30px; border-radius: 50%; background: rgb(247 200 93 / 12%); }
.tactic-card strong { position: relative; z-index: 1; font-size: .78rem; line-height: 1.1; }
.tactic-card small { position: relative; z-index: 1; color: #cee0da; font-size: .62rem; line-height: 1.25; }
.tactic-card__cost { position: absolute; top: 7px; right: 7px; width: 21px; height: 21px; display: grid; place-items: center; border-radius: 50%; color: #183322; background: #f7c85d; font-size: .68rem; font-weight: 950; }
.tactic-card__status { margin-top: auto; position: relative; z-index: 1; color: #ffe590; font-size: .58rem; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
.tactic-card--selected { border-color: #ffe590; transform: translateY(-2px); box-shadow: 0 8px 18px rgb(247 200 93 / 15%); }
.tactic-card--played { background: linear-gradient(155deg, rgb(51 112 79 / 45%), rgb(17 52 55 / 65%)); opacity: .58; }
.tactic-card--exhausted { filter: grayscale(.8); opacity: .42; }
.card-hand--compact .tactic-card { min-height: 66px; padding: 8px 7px 6px; }
.card-hand--compact .tactic-card small { display: none; }
.card-hand--compact .tactic-card__cost { width: 18px; height: 18px; top: 5px; right: 5px; }
.tactic-notice, .helper-notice { padding: 10px 12px; border-radius: 14px; font-size: .82rem; font-weight: 850; line-height: 1.35; }
.tactic-notice { color: #fff2b9; background: rgb(44 88 70 / 70%); border: 1px solid rgb(247 200 93 / 32%); }
.helper-notice { color: #dff7e7; background: rgb(32 94 74 / 68%); border: 1px solid rgb(124 205 151 / 32%); }
.sentence-builder__zone[data-token-dropzone] { transition: border-color .18s ease, background .18s ease; }
.sentence-builder__zone[data-token-dropzone]:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
.token[draggable='true'] { touch-action: manipulation; }
@media (max-width: 520px) {
  .helper-picker { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .helper-option { min-height: 62px; grid-template-columns: 34px minmax(0, 1fr); }
  .helper-option img { width: 34px; height: 42px; }
  .card-hand { gap: 5px; }
  .tactic-card { min-height: 92px; padding-inline: 7px; }
  .tactic-card strong { font-size: .68rem; padding-right: 13px; }
  .tactic-card small { font-size: .56rem; }
  .card-hand--compact .tactic-card { min-height: 58px; }
  .card-hand--compact .tactic-card__status { font-size: .5rem; }
}
@media (max-height: 700px) and (max-width: 900px) {
  .card-hand--compact .tactic-card { min-height: 48px; padding-block: 6px 4px; }
  .card-hand--compact .tactic-card__status { display: none; }
}
`;
await writeFile(cssPath, css);
console.log('Branch 7 UI patch applied');
