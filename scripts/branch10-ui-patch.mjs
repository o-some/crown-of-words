import fs from 'node:fs';

const mainPath='src/main.js';
let main=fs.readFileSync(mainPath,'utf8');
const launches=`          <button data-region24="library"><b>2 · Bibliothek</b><span>Brax · Satzgrundlagen</span></button>\n          <button data-region24="wildlife"><b>3 · Tierwelt</b><span>Blackfinn · Tiere & Vergleiche</span></button>\n          <button data-region24="home"><b>4 · Zuhause</b><span>Roderick · Präpositionen</span></button>`;
const expanded=`          <button data-region24="library"><b>2 · Bibliothek</b><span>Brax · Satzgrundlagen</span></button>\n          <button data-region24="wildlife"><b>3 · Tierwelt</b><span>Blackfinn · Tiere & Vergleiche</span></button>\n          <button data-region24="home"><b>4 · Zuhause</b><span>Roderick · Präpositionen</span></button>\n          <button data-region24="family"><b>5 · Familie</b><span>Vargas · Pronomen & Besitz</span></button>\n          <button data-region24="body"><b>6 · Körper</b><span>Ironhook · Zustände & Modalverben</span></button>\n          <button data-region24="travel"><b>7 · Unterwegs</b><span>Thorne · Reise & Richtungen</span></button>\n          <button data-region24="movement"><b>8 · Bewegung</b><span>Corvin · Verben & Imperative</span></button>`;
if(!main.includes(launches))throw new Error('launch block drifted');
main=main.replace(launches,expanded);
const anchor=`function renderRegion24(){`;
if(!main.includes(anchor))throw new Error('regional render anchor missing');
const mechanic=`function region10MechanicHTML(session){\n  const m=session?.bossMechanic;if(!m)return '';\n  if(session.regionId==='family')return \`<div class="regional-mechanic regional-mechanic--pearls" aria-label="Temporäre Befehlsperlen"><b>● ${m.commandPearls}</b><span>verfügbar</span><b>◌ ${m.stolenPearls}</b><span>von Vargas gehalten</span></div>\`;\n  if(session.regionId==='body')return \`<div class="regional-mechanic"><b>⛓ Kettenblockade</b><span>\${m.chainActive?'Gesperrt: '+m.blockedTarget:'Kette gebrochen – taktische Slots frei.'}</span></div>\`;\n  if(session.regionId==='travel')return \`<div class="regional-mechanic"><b>Doppelziel</b><div class="thorne-targets">\${m.targets.map(t=>\`<span class="\${m.shieldedTarget===t?'is-shielded':''}">\${m.shieldedTarget===t?'🛡 ':''}\${t.split(':')[1]}</span>\`).join('')}</div></div>\`;\n  if(session.regionId==='movement')return \`<div class="regional-mechanic"><b>Corvins 3×3-Taktikkarte</b><div class="corvin-grid" aria-label="Verschobene Taktikkarte">\${m.grid.map(id=>\`<span>\${id.toUpperCase()}</span>\`).join('')}</div><small>\${m.move.axis==='row'?'Reihe':'Spalte'} \${m.move.index+1} wird sichtbar verschoben; Adjazenz folgt der neuen Position.</small></div>\`;\n  return '';\n}\n\n`;
main=main.replace(anchor,mechanic+anchor);
const introNeedle=`<h2>\${t.label}</h2><p>\${t.detail}</p><button class="primary-button" data-action="region24-boss-start">`;
const introReplacement=`<h2>\${t.label}</h2><p>\${t.detail}</p>\${region10MechanicHTML(s)}<button class="primary-button" data-action="region24-boss-start">`;
if(!main.includes(introNeedle))throw new Error('boss intro block drifted');
main=main.replace(introNeedle,introReplacement);
const fightNeedle=`<p class="regional-telegraph"><b>Sichtbar angekündigt:</b> \${t.detail}</p><div class="challenge-card glass-card">`;
const fightReplacement=`<p class="regional-telegraph"><b>Sichtbar angekündigt:</b> \${t.detail}</p>\${region10MechanicHTML(s)}<div class="challenge-card glass-card">`;
if(!main.includes(fightNeedle))throw new Error('boss fight block drifted');
main=main.replace(fightNeedle,fightReplacement);
fs.writeFileSync(mainPath,main);

const cssPath='src/styles.css';
let css=fs.readFileSync(cssPath,'utf8');
if(!css.includes('.regional-mechanic {'))css+=`\n.regional-mechanic { display:grid; gap:7px; padding:10px 12px; border-radius:16px; border:1px solid rgb(247 200 93 / 28%); background:rgb(5 24 31 / 45%); color:#f9efd0; }\n.regional-mechanic--pearls { grid-template-columns:auto 1fr auto 1fr; align-items:center; }\n.thorne-targets { display:flex; gap:8px; flex-wrap:wrap; }\n.thorne-targets span { padding:6px 9px; border-radius:999px; background:rgb(255 255 255 / 9%); border:1px solid var(--line); }\n.thorne-targets .is-shielded { border-color:#ffe590; background:rgb(247 200 93 / 18%); }\n.corvin-grid { width:min(210px,100%); display:grid; grid-template-columns:repeat(3,1fr); gap:5px; }\n.corvin-grid span { aspect-ratio:1; display:grid; place-items:center; min-height:38px; border-radius:10px; background:rgb(255 255 255 / 10%); border:1px solid rgb(255 255 255 / 16%); font-weight:950; }\n@media (max-height: 430px) and (orientation: landscape){ .regional-mechanic { padding:7px 9px; gap:4px; font-size:.78rem; } .corvin-grid { width:126px; grid-template-columns:repeat(3,1fr); } .corvin-grid span { min-height:28px; } }\n`;
fs.writeFileSync(cssPath,css);
console.log('Branch 10 UI patch applied');
