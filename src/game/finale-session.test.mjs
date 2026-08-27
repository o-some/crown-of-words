import test from 'node:test';
import assert from 'node:assert/strict';
import { getRegion910 } from '../content/regions-9-10.js';
import { answerFinale, createFinaleSession, currentFinaleChallenge, finishFinaleBoss, finishFinaleStandard, startFinaleBoss } from './finale-session.js';

for (const regionId of ['harbor','crown-castle']) {
  test(`${regionId} can be completed only through its language path`,()=>{
    const region=getRegion910(regionId);let state=createFinaleSession(regionId);
    for(const challenge of region.standard){state=answerFinale(state,challenge.correct).state;}
    const standard=finishFinaleStandard(state);assert.equal(standard.won,true);
    state=startFinaleBoss(standard.state);
    for(const challenge of region.boss){state=answerFinale(state,challenge.correct).state;}
    const boss=finishFinaleBoss(state);assert.equal(boss.won,true);
    assert.equal(boss.campaignComplete,regionId==='crown-castle');
  });
}

test('Varkos cannot complete campaign without final Crown Sentence',()=>{
  const region=getRegion910('crown-castle');let state=createFinaleSession('crown-castle');
  for(const challenge of region.standard){state=answerFinale(state,challenge.correct).state;}
  state=startFinaleBoss(state);
  for(const challenge of region.boss.slice(0,-1)){state=answerFinale(state,challenge.correct).state;}
  state=answerFinale(state,['wrong','sentence']).state;
  const boss=finishFinaleBoss(state);assert.equal(boss.won,false);assert.equal(boss.campaignComplete,false);
});

test('wrong Varkos phase answer keeps the same phase challenge',()=>{
  const region=getRegion910('crown-castle');let state=createFinaleSession('crown-castle');
  for(const challenge of region.standard){state=answerFinale(state,challenge.correct).state;}
  state=startFinaleBoss(state);
  const before=currentFinaleChallenge(state);state=answerFinale(state,'definitely wrong').state;
  assert.equal(state.bossMechanic.phase,1);assert.equal(currentFinaleChallenge(state).id,before.id);
});
