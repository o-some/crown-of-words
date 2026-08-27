import { readFile, writeFile } from 'node:fs/promises';

const mainPath = 'src/main.js';
let main = await readFile(mainPath, 'utf8');

function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0) throw new Error(`missing patch target: ${label}`);
  if (source.indexOf(needle, first + needle.length) >= 0) throw new Error(`ambiguous patch target: ${label}`);
  return source.slice(0, first) + replacement + source.slice(first + needle.length);
}

main = replaceOnce(
  main,
  "import { GARDEN_BOSS_CHALLENGES, GARDEN_STANDARD_CHALLENGES } from './content/garden-content.js';",
  "import { GARDEN_BOSS_CHALLENGES, GARDEN_STANDARD_CHALLENGES } from './content/garden-content.js';\nimport { createSaveEnvelope, restoreSaveEnvelope } from './game/save-contract.js';\nimport { clearStandaloneSave, loadStandaloneSave, saveStandaloneSave } from './adapters/standalone-storage.js';",
  'imports',
);

main = replaceOnce(
  main,
  "    swapNotice: null,\n  };",
  "    swapNotice: null,\n    paused: false,\n    helpOpen: false,\n  };",
  'fresh state overlays',
);

main = replaceOnce(main, "state = freshState();", "const restoredState = restoreSaveEnvelope(loadStandaloneSave());\nstate = restoredState ?? freshState();\nstate.paused = Boolean(state.paused);\nstate.helpOpen = Boolean(state.helpOpen);", 'restore state');

main = replaceOnce(
  main,
  "function shell(content, { world = false } = {}) {\n  return `",
  "function shell(content, { world = false } = {}) {\n  const overlay = state.paused\n    ? `<section class=\"game-overlay\" data-testid=\"pause-overlay\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"pause-title\"><div class=\"game-overlay__card glass-card\"><span class=\"eyebrow\">Spiel angehalten</span><h2 id=\"pause-title\">Pause</h2><p>Dein aktueller Auftrag bleibt exakt erhalten.</p><button class=\"primary-button\" data-action=\"resume\" data-testid=\"resume-game\">Weiterspielen</button></div></section>`\n    : state.helpOpen\n      ? `<section class=\"game-overlay\" data-testid=\"help-overlay\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"help-title\"><div class=\"game-overlay__card glass-card\"><span class=\"eyebrow\">Tulas Hilfe</span><h2 id=\"help-title\">So gewinnst du</h2><p>Löse Wörter und Sätze. Hinweise helfen, geben aber weniger Wortkraft. Bei Kai bleibt die richtige Antwort immer unverändert.</p><button class=\"primary-button\" data-action=\"close-help\" data-testid=\"close-help\">Verstanden</button></div></section>`\n      : '';\n  return `",
  'shell overlay',
);

main = replaceOnce(
  main,
  "        <div class=\"topbar__seal\" aria-label=\"Kronensiegel 0 von 10\">0 / 10</div>\n      </header>\n      ${content}\n    </main>",
  "        <div class=\"topbar__tools\"><button class=\"topbar__tool\" data-action=\"help\" aria-label=\"Hilfe öffnen\">Hilfe</button><button class=\"topbar__tool\" data-action=\"pause\" aria-label=\"Spiel pausieren\">Pause</button><div class=\"topbar__seal\" aria-label=\"Kronensiegel 0 von 10\">0 / 10</div></div>\n      </header>\n      ${content}\n      ${overlay}\n    </main>",
  'topbar tools and overlay',
);

main = replaceOnce(
  main,
  "function render() {\n  switch (state.screen) {",
  "function render() {\n  saveStandaloneSave(createSaveEnvelope(state));\n  switch (state.screen) {",
  'persist on render',
);

main = replaceOnce(
  main,
  "  switch (target.dataset.action) {\n    case 'open-garden':",
  "  switch (target.dataset.action) {\n    case 'pause': state.paused = true; state.helpOpen = false; render(); break;\n    case 'resume': state.paused = false; render(); break;\n    case 'help': state.helpOpen = true; state.paused = false; render(); break;\n    case 'close-help': state.helpOpen = false; render(); break;\n    case 'open-garden':",
  'overlay actions',
);

main = replaceOnce(
  main,
  "    case 'campaign-reset': state = freshState(); render(); break;",
  "    case 'campaign-reset': clearStandaloneSave(); state = freshState(); render(); break;",
  'campaign reset clear',
);

await writeFile(mainPath, main);

const cssPath = 'src/styles.css';
let css = await readFile(cssPath, 'utf8');
css += `\n\n/* Branch 6 PlayBrain gate: pause/help and reload-safe interaction chrome */\n.topbar__tools { display: flex; align-items: center; gap: 6px; }\n.topbar__tool { min-height: 38px; padding: 7px 10px; border: 1px solid var(--line); border-radius: 999px; color: #eef8f4; font-weight: 850; font-size: .72rem; background: rgb(255 255 255 / 8%); cursor: pointer; }\n.game-overlay { position: fixed; z-index: 100; inset: 0; display: grid; place-items: center; padding: max(18px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(18px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); background: rgb(4 17 24 / 78%); backdrop-filter: blur(8px); }\n.game-overlay__card { width: min(100%, 430px); padding: 22px; border-radius: 26px; display: grid; gap: 12px; text-align: left; }\n.game-overlay__card h2 { margin: 0; font-size: clamp(1.8rem, 8vw, 2.8rem); }\n.game-overlay__card p { margin: 0 0 4px; color: #dcebe7; line-height: 1.5; }\n@media (max-width: 430px) { .topbar__tool { padding-inline: 8px; font-size: .67rem; } .topbar__seal { min-width: 50px; padding-inline: 9px; } }\n`;
await writeFile(cssPath, css);

console.log('Branch 6 gate fixes applied');
