import fs from 'node:fs';
const path='scripts/branch11-integrate.mjs';
let text=fs.readFileSync(path,'utf8');
text=text.replace('aria-label="Kronensiegel ${state.campaignComplete ?', 'aria-label="Kronensiegel \\${state.campaignComplete ?');
text=text.replace('von 10">${state.campaignComplete ?', 'von 10">\\${state.campaignComplete ?');
fs.writeFileSync(path,text);
