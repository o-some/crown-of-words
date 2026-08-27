import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const sourcePath = 'scripts/branch7-apply-ui.mjs';
let source = await readFile(sourcePath, 'utf8');
const replacements = [
  ["\\`${card.name} aktiviert – \\${card.description}\\`", "\\`\\${card.name} aktiviert – \\${card.description}\\`"],
  ["\\`Entdecker-Rückerstattung: ${card.name} bleibt bereit.\\`", "\\`Entdecker-Rückerstattung: \\${card.name} bleibt bereit.\\`"],
  ["\\`${card.name} ist für diese Begegnung erschöpft.\\`", "\\`\\${card.name} ist für diese Begegnung erschöpft.\\`"],
];
for (const [from, to] of replacements) {
  if (!source.includes(from)) throw new Error(`Branch 7 patch escape target missing: ${from}`);
  source = source.replace(from, to);
}
const fixedPath = '/tmp/branch7-apply-ui-fixed.mjs';
await writeFile(fixedPath, source);
await import(`${pathToFileURL(fixedPath).href}?v=${Date.now()}`);
