import { readFile, writeFile } from 'node:fs/promises';

const mainPath = 'src/main.js';
let main = await readFile(mainPath, 'utf8');
main = main.replace(', helperDefinition, selectHelper', ', selectHelper');
await writeFile(mainPath, main);

const cssPath = 'src/styles.css';
let css = await readFile(cssPath, 'utf8');
css += `

/* Branch 7 visual evidence polish */
.helper-picker { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.helper-option { min-height: 58px; grid-template-columns: 34px minmax(0, 1fr); padding: 6px 8px; }
.helper-option img { width: 34px; height: 42px; }
.helper-option strong { font-size: .76rem; }
.helper-option small { font-size: .6rem; }
.card-hand:not(.card-hand--compact) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.tactic-card strong { padding-right: 17px; overflow-wrap: anywhere; hyphens: auto; }
.card-hand:not(.card-hand--compact) .tactic-card { min-height: 86px; }
.card-hand:not(.card-hand--compact) .tactic-card strong { font-size: .74rem; }
@media (max-width: 520px) {
  .card-hand:not(.card-hand--compact) .tactic-card { min-height: 78px; }
}
@media (max-height: 700px) and (max-width: 900px) {
  .helper-option { min-height: 48px; grid-template-columns: 28px minmax(0, 1fr); padding-block: 4px; }
  .helper-option img { width: 28px; height: 34px; }
  .helper-option small { display: none; }
  .card-hand:not(.card-hand--compact) .tactic-card { min-height: 64px; }
  .card-hand:not(.card-hand--compact) .tactic-card small { display: none; }
}
`;
await writeFile(cssPath, css);
