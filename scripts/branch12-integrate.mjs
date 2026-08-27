import fs from 'node:fs';

const path='src/main.js';
let s=fs.readFileSync(path,'utf8');
const oldImport="import { clearStandaloneSave, loadStandaloneSave, saveStandaloneSave } from './adapters/standalone-storage.js';";
const newImport="import { createRuntimeAdapter } from './adapters/game-runtime-adapter.js';\nimport { createStableEventId } from './adapters/tulas-island-host.js';";
if(!s.includes(oldImport)) throw new Error('standalone import guard failed');
s=s.replace(oldImport,newImport);
const anchor="const challengeById = (list, id) => list.find((item) => item.id === id);";
if(!s.includes(anchor)) throw new Error('runtime anchor missing');
s=s.replace(anchor,`${anchor}\nconst runtime = createRuntimeAdapter();`);
s=s.replace('restoreSaveEnvelope(loadStandaloneSave())','restoreSaveEnvelope(runtime.loadSave())');
s=s.replaceAll('saveStandaloneSave(', 'runtime.saveSave(');
s=s.replaceAll('clearStandaloneSave()', 'runtime.clearSave()');
const victory="if(res.campaignComplete){root.innerHTML=shell(`";
if(!s.includes(victory)) throw new Error('victory guard missing');
s=s.replace(victory,"if(res.campaignComplete){void runtime.commitProgressEvent({ eventId:createStableEventId('campaign-clear','crown-of-words'), kind:'campaign', regionId:'crown-castle', xp:250, shells:100, stars:3, mastery:1 });root.innerHTML=shell(`");
fs.writeFileSync(path,s);
