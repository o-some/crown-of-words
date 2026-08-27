import assert from 'node:assert/strict';
import {createVargasState,resolveVargas,createIronhookState,resolveIronhook,createThorneState,resolveThorne,createCorvinState,resolveCorvin,telegraphRegion10Boss} from './region10-boss-core.js';

let v=createVargasState();
v=resolveVargas(v);assert.equal(v.stolenPearls,1);assert.equal(v.commandPearls,2);v=resolveVargas(v);assert.equal(v.stolenPearls,1,'cooldown prevents consecutive theft');v=resolveVargas(v,{treasureCorrect:true});assert.equal(v.stolenPearls,0);assert.equal(v.commandPearls,3,'Treasure Sentence returns only temporary pearl');

let i=createIronhookState(6);assert.ok(['card-slot','helper-slot','sea-route'].includes(i.blockedTarget));assert.equal(i.chainActive,true);i=resolveIronhook(i,{chainBreakCorrect:true});assert.equal(i.chainActive,false);assert.equal(i.blockedTarget,null);assert.match(telegraphRegion10Boss(createIronhookState(7)).detail,/Antwortweg bleibt frei/);

let t=createThorneState();assert.equal(t.targets.length,2);t=resolveThorne(t,{directionCorrect:true});assert.ok(t.targets.includes(t.shieldedTarget));assert.equal(t.targets.length,2,'Thorne never exceeds two targets');

let c=createCorvinState(8);const before=structuredClone(c.adjacency);c=resolveCorvin(c);assert.notDeepEqual(c.adjacency,before,'Corvin recalculates adjacency after actual grid shift');for(const [node,neighbors] of Object.entries(c.adjacency)){for(const n of neighbors)assert.ok(c.adjacency[n].includes(node),`${node}-${n} adjacency must remain symmetric`);}const shifted=[...c.grid];c=resolveCorvin(c,{counterCorrect:true});assert.deepEqual(c.grid,shifted,'counter fixes/counters without hidden extra shift');

console.log('Region 5-8 boss core PASS');
