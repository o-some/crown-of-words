import fs from 'node:fs';
const path='src/main.js';let text=fs.readFileSync(path,'utf8');
const needle='state.campaignComplete=Boolean(res.campaignComplete);if(res.campaignComplete){';
const replacement='state.campaignComplete=Boolean(res.campaignComplete);saveStandaloneSave(createSaveEnvelope(state));if(res.campaignComplete){';
const count=text.split(needle).length-1;if(count!==1)throw new Error(`victory save patch expected 1 match, got ${count}`);
fs.writeFileSync(path,text.replace(needle,replacement));
