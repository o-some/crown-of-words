import test from 'node:test';
import assert from 'node:assert/strict';
import { createAzrakState, createVarkosState, resolveAzrak, resolveVarkosPhase, telegraphAzrak, telegraphVarkos } from './finale-boss-core.js';

test('Azrak always has exactly one persistent shadow and can reveal it',()=>{
  let state=createAzrakState(909);assert.ok(state.shadowField);assert.equal(state.fields.filter(id=>id===state.shadowField).length,1);
  const first=state.shadowField;state=resolveAzrak(state);assert.ok(state.shadowField);assert.notEqual(state.shadowField,first);assert.equal(state.revealed,false);
  state=resolveAzrak(state,{mixedCorrect:true});assert.equal(state.revealed,true);assert.match(telegraphAzrak(state).detail,/enthüllt/);
});

test('Varkos progresses through four phases with at most two hazards',()=>{
  let state=createVarkosState(1010);assert.equal(state.phase,1);
  state=resolveVarkosPhase(state,{correct:true});assert.equal(state.phase,2);
  state=resolveVarkosPhase(state,{correct:true});assert.equal(state.phase,3);assert.ok(state.hazards.length<=2);
  state=resolveVarkosPhase(state,{correct:true});assert.equal(state.phase,4);assert.equal(state.hazards.length,0);
  state=resolveVarkosPhase(state,{correct:true,crownCorrect:true});assert.equal(state.complete,true);assert.match(telegraphVarkos(state).label,/Phase 4/);
});

test('Varkos formation changes adjacency without changing language truth',()=>{
  let state=createVarkosState(10);state=resolveVarkosPhase(state,{correct:true});state=resolveVarkosPhase(state,{correct:true});
  const before=structuredClone(state.adjacency);state=resolveVarkosPhase(state,{correct:true});assert.notDeepEqual(state.adjacency,before);
});
