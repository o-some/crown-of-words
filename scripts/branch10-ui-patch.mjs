import fs from 'node:fs';

function replaceOnce(text, needle, replacement, label) {
  const count=text.split(needle).length-1;
  if(count!==1) throw new Error(`${label}: expected one match, got ${count}`);
  return text.replace(needle,replacement);
}

const mainPath='src/main.js';
let main=fs.readFileSync(mainPath,'utf8');
const oldLaunch=`          <button data-region24="library"><b>2 · Bibliothek</b><span>Brax · Satzgrundlagen</span></button>\n          <button data-region24="wildlife"><b>3 · Tierwelt</b><span>Blackfinn · Tiere & Vergleiche</span></button>\n          <button data-region24="home"><b>4 · Zuhause</b><span>Roderick · Präpositionen</span></button>`;
const newLaunch=oldLaunch+`\n          <button data-region24="family"><b>5 · Familie</b><span>Vargas · Pronomen & Besitz</span></button>\n          <button data-region24="body"><b>6 · Körper</b><span>Ironhook · Zustände & Modalverben</span></button>\n          <button data-region24="travel"><b>7 · Unterwegs</b><span>Thorne · Reise & Richtungen</span></button>\n          <button data-region24="movement"><b>8 · Bewegung</b><span>Corvin · Verben & Imperative</span></button>`;
main=replaceOnce(main,oldLaunch,newLaunch,'campaign launch block');

const anchor='function renderRegion24(){';
const helper=`function region10MechanicHTML(session){
  const m=session?.bossMechanic;if(!m||!['family','body','travel','movement'].includes(session.regionId))return '';
  if(session.regionId==='family')return '<div class="regional-mechanic regional-mechanic--pearls"><b>● '+m.commandPearls+'</b><span>verfügbar</span><b>◌ '+m.stolenPearls+'</b><span>von Vargas gehalten</span></div>';
  if(session.regionId==='body')return '<div class="regional-mechanic"><b>⛓ Kettenblockade</b><span>'+(m.chainActive?'Gesperrt: '+m.blockedTarget:'Kette gebrochen – taktische Slots frei.')+'</span></div>';
  if(session.regionId==='travel')return '<div class="regional-mechanic"><b>Doppelziel</b><div class="thorne-targets">'+m.targets.map(t=>'<span class="'+(m.shieldedTarget===t?'is-shielded':'')+'">'+(m.shieldedTarget===t?'🛡 ':'')+t.split(':')[1]+'</span>').join('')+'</div></div>';
  return '<div class="regional-mechanic"><b>Corvins 3×3-Taktikkarte</b><div class="corvin-grid">'+m.grid.map(id=>'<span>'+id.toUpperCase()+'</span>').join('')+'</div><small>'+(m.move.axis==='row'?'Reihe':'Spalte')+' '+(m.move.index+1)+' wird sichtbar verschoben; Adjazenz folgt der neuen Position.</small></div>';
}

`;
main=replaceOnce(main,anchor,helper+anchor,'region render anchor');
const intro='<h2>${t.label}</h2><p>${t.detail}</p><button class="primary-button" data-action="region24-boss-start">';
main=replaceOnce(main,intro,'<h2>${t.label}</h2><p>${t.detail}</p>${region10MechanicHTML(s)}<button class="primary-button" data-action="region24-boss-start">','boss intro mechanic');
const fight='<p class="regional-telegraph"><b>Sichtbar angekündigt:</b> ${t.detail}</p><div class="challenge-card glass-card">';
main=replaceOnce(main,fight,'<p class="regional-telegraph"><b>Sichtbar angekündigt:</b> ${t.detail}</p>${region10MechanicHTML(s)}<div class="challenge-card glass-card">','boss fight mechanic');
fs.writeFileSync(mainPath,main);

const regionPath='src/content/regions-5-8.js';
let regions=fs.readFileSync(regionPath,'utf8');
for(const [oldPath,newPath] of [
 ['bosses/boss-05-vargas.png','bosses/boss-05-vargas.webp'],
 ['bosses/boss-06-ironhook.png','bosses/boss-06-ironhook.webp'],
 ['bosses/boss-07-thorne.png','bosses/boss-07-thorne.webp'],
 ['bosses/boss-08-corvin.png','bosses/boss-08-corvin.webp'],
]) regions=replaceOnce(regions,oldPath,newPath,oldPath);
fs.writeFileSync(regionPath,regions);

const cssPath='src/styles.css';
let css=fs.readFileSync(cssPath,'utf8');
if(!css.includes('.regional-mechanic {')) css+=`\n.regional-mechanic { display:grid; gap:7px; padding:10px 12px; border-radius:16px; border:1px solid rgb(247 200 93 / 28%); background:rgb(5 24 31 / 45%); color:#f9efd0; }\n.regional-mechanic--pearls { grid-template-columns:auto 1fr auto 1fr; align-items:center; }\n.thorne-targets { display:flex; gap:8px; flex-wrap:wrap; }\n.thorne-targets span { padding:6px 9px; border-radius:999px; background:rgb(255 255 255 / 9%); border:1px solid var(--line); }\n.thorne-targets .is-shielded { border-color:#ffe590; background:rgb(247 200 93 / 18%); }\n.corvin-grid { width:min(210px,100%); display:grid; grid-template-columns:repeat(3,1fr); gap:5px; }\n.corvin-grid span { aspect-ratio:1; display:grid; place-items:center; min-height:38px; border-radius:10px; background:rgb(255 255 255 / 10%); border:1px solid rgb(255 255 255 / 16%); font-weight:950; }\n@media (max-height:430px) and (orientation:landscape){ .regional-mechanic { padding:7px 9px; gap:4px; font-size:.78rem; } .corvin-grid { width:126px; } .corvin-grid span { min-height:28px; } }\n`;
fs.writeFileSync(cssPath,css);

const registryPath='.masterbrain/asset-registry.json';
const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
registry.branch='branch-10-regions-5-8';
const additions=[
 {id:'world-coral-reef',kind:'region-background',status:'ready',runtimePath:'public/assets/worlds/world-coral-reef.webp',sourceRepository:'o-some/tulasisland',sourceCommit:'cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0',sourceRepoPath:'assets/creative/world_coral_reef.webp',sourceRepoBlob:'309f9b0cf091447a5e877d9bdd4386ad21fbb46d',dropboxPath:'/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Worlds/world_coral_reef.webp',dropboxContentHash:'367d829c696dae80cd9fc681aab8e87accd2b9aa13c37e98845f60632e30bd20',size:473394,sha256:'2da54c0a20d2ae643e5482b700fdc018a59ef45a4dc1c3455b986e80007a641c'},
 {id:'world-crystal-cove',kind:'region-background',status:'ready',runtimePath:'public/assets/worlds/world-crystal-cove.webp',sourceRepository:'o-some/tulasisland',sourceCommit:'cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0',sourceRepoPath:'assets/creative/world_crystal_cove.webp',sourceRepoBlob:'7974cd8ac55e8b5e8afa30755648f7a745da2e60',dropboxPath:'/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Worlds/world_crystal_cove.webp',dropboxContentHash:'159c27a4fec0e0223bb1878c833806c8cdc2d30e51f8b7698f721a9629c05268',size:370588,sha256:'4730902758bb64f7fa1ac339c309538c73539e699a74557c4bdbc42cd5b13cce'},
 {id:'world-desert-oasis',kind:'region-background',status:'ready',runtimePath:'public/assets/worlds/world-desert-oasis.webp',sourceRepository:'o-some/tulasisland',sourceCommit:'cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0',sourceRepoPath:'assets/creative/world_desert_oasis.webp',sourceRepoBlob:'c193713389381865fe0cb76f7adb7cb802ae14b6',dropboxPath:'/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Worlds/world_desert_oasis.webp',dropboxContentHash:'1aa9b0a90bd610a3660d6674c92c5e39599828c416a9e283c586f782738f81a8',size:386840,sha256:'beb29310956e6094722f8fb095ae51b6cdfe02e45d17afc81d40b785044dbf75'},
 {id:'world-ice-peak',kind:'region-background',status:'ready',runtimePath:'public/assets/worlds/world-ice-peak.webp',sourceRepository:'o-some/tulasisland',sourceCommit:'cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0',sourceRepoPath:'assets/creative/world_ice_peak.webp',sourceRepoBlob:'fe5e25bd8dbe25fb9d4710d2735b4ec3098329cb',dropboxPath:'/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Worlds/world_ice_peak.webp',dropboxContentHash:'208ba70828a3f6885d48575b9835733f3a865c075acb07e3a3f90e26f2e8584a',size:378706,sha256:'293f50c69764c17ea780ba347ba41901b7e3173cfabf18ab01583fd220a9e40f'},
 {id:'boss-05-vargas',kind:'boss',status:'ready',runtimePath:'public/assets/bosses/boss-05-vargas.webp',sourceRepository:'o-some/word-scramble',sourceCommit:'ac594046c99ac63954164fe6da0a89ff92c29cf4',sourceRepoPath:'assets/bosses/level-05-piratenbaron-vargas.webp',sourceRepoBlob:'4d05bab6313c22e5c402f9c9ac70888234359d9b',dropboxPath:'/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/Level 5 - Piratenbaron Vargas.png',dropboxContentHash:'bf933d3b7c64807d1cd6d3826831c60c2106f765781c08f56a0228e9532cb002',size:152314,sha256:'f2c6a911ec0d16fca68c2c2102a30e8692d8306faca50355375fd4e75c7c257f',transparent:true},
 {id:'boss-06-ironhook',kind:'boss',status:'ready',runtimePath:'public/assets/bosses/boss-06-ironhook.webp',sourceRepository:'o-some/word-scramble',sourceCommit:'ac594046c99ac63954164fe6da0a89ff92c29cf4',sourceRepoPath:'assets/bosses/level-06-kapitaen-ironhook.webp',sourceRepoBlob:'b4d2a50d703206f69eda32ebc865327afe1ea17d',dropboxPath:'/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/Level 6 - Kapitän Ironhook.png',dropboxContentHash:'ba446b417dc69096015f85b876d137d4915a3715e95e609a1e6bcb4a8a84508f',size:138660,sha256:'59a06b7bf708e5fa7aef4f43dcabdd06581d2ac35f1799e8fdcb369063346956',transparent:true},
 {id:'boss-07-thorne',kind:'boss',status:'ready',runtimePath:'public/assets/bosses/boss-07-thorne.webp',sourceRepository:'o-some/word-scramble',sourceCommit:'ac594046c99ac63954164fe6da0a89ff92c29cf4',sourceRepoPath:'assets/bosses/level-07-admiral-thorne.webp',sourceRepoBlob:'dd456e65dd6eef373e4863a10c8055c1dd377d69',dropboxPath:'/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/Level 7 - Admiral Thorne.png',dropboxContentHash:'a11843141683ed848f4b1969ec2e1f3f525f060712032b737c2660cb55dc3840',size:160626,sha256:'58e005733b0aa5e02589f9218c27b4102c70a6d3fa880437b27b3ec567dca3a1',transparent:true},
 {id:'boss-08-corvin',kind:'boss',status:'ready',runtimePath:'public/assets/bosses/boss-08-corvin.webp',sourceRepository:'o-some/word-scramble',sourceCommit:'ac594046c99ac63954164fe6da0a89ff92c29cf4',sourceRepoPath:'assets/bosses/level-08-kartenmeister-corvin.webp',sourceRepoBlob:'f3884e0dc8ff9c86900daa89e444c5c61463d04a',dropboxPath:'/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/Level 8 - Kartenmeister Corvin.png',dropboxContentHash:'7cc942a8bd23f20a326606d2f2ac5f17262b88b7f452f665390fddceefa8280f',size:132080,sha256:'3240b5691f3037337064962c9c78e98c71b837297634afa59e428b50fd4cce45',transparent:true}
];
const existing=new Set(registry.assets.map(a=>a.id));
for(const item of additions) if(!existing.has(item.id)) registry.assets.push(item);
fs.writeFileSync(registryPath,JSON.stringify(registry,null,2)+'\n');
console.log(`Branch 10 integration ready with ${registry.assets.length} registered assets`);
