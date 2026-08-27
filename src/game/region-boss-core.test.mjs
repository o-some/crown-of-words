import test from 'node:test';
import assert from 'node:assert/strict';
import {createBraxState,resolveBrax,createBlackfinnState,resolveBlackfinn,createRoderickState,resolveRoderick,telegraphBoss} from './region-boss-core.js';

test('Brax always has exactly one persistent marker and sentence counter disarms one round',()=>{
 const start=createBraxState(9); assert.equal(Number.isInteger(start.markerIndex),true);
 const hit=resolveBrax(start); assert.equal(hit.pressure,1); assert.equal(Number.isInteger(hit.markerIndex),true);
 const safe=resolveBrax(hit,{counterCorrect:true}); assert.equal(safe.disarmed,true); assert.equal(safe.pressure,1);
 assert.match(telegraphBoss(safe).detail,/Genau ein Marker/);
});

test('Blackfinn fog hides tactic only and scout counter clears it for current turn',()=>{
 const start=createBlackfinnState(4); assert.equal(start.fogged,true);
 const clear=resolveBlackfinn(start,{scoutCorrect:true}); assert.equal(clear.fogged,false);
 assert.match(telegraphBoss(start).detail,/niemals die richtige Sprachantwort/);
});

test('Roderick uses only actual unique error concepts, max three, and revenge sentence removes extra shield',()=>{
 const start=createRoderickState(['preposition:in','room:kitchen','preposition:in','object:key','extra']);
 assert.deepEqual(start.revengeQueue,['room:kitchen','object:key','extra']);
 const after=resolveRoderick(start,{revengeCorrect:true}); assert.equal(after.shields,1);
 const empty=createRoderickState([]); assert.equal(empty.currentConcept,null); assert.match(telegraphBoss(empty).detail,/darf nichts erfinden/);
});
