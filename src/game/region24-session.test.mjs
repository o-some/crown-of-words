import test from 'node:test';
import assert from 'node:assert/strict';
import { answerRegion24, createRegion24Session, currentRegion24Challenge, finishRegion24Boss, finishRegion24Standard, startRegion24Boss } from './region24-session.js';

function answerCorrect(session) {
  const challenge = currentRegion24Challenge(session);
  return answerRegion24(session, challenge.correct).state;
}

for (const regionId of ['library','wildlife','home']) {
  test(`${regionId} standard and boss are language-gated and completable`, () => {
    let state = createRegion24Session(regionId, { errorConcepts: ['prep:in','room:kitchen'] });
    for (let i = 0; i < 5; i += 1) state = answerCorrect(state);
    const standard = finishRegion24Standard(state);
    assert.equal(standard.won, true);
    assert.equal(standard.score, 15);
    state = startRegion24Boss(standard.state);
    for (let i = 0; i < 3; i += 1) state = answerCorrect(state);
    const boss = finishRegion24Boss(state);
    assert.equal(boss.won, true);
    assert.equal(boss.state.bossHp, 0);
  });
}

test('final Crown Sentence cannot be skipped for a standard win', () => {
  let state = createRegion24Session('library');
  for (let i = 0; i < 4; i += 1) state = answerCorrect(state);
  state = answerRegion24(state, 'wrong sentence').state;
  assert.equal(finishRegion24Standard(state).won, false);
});

test('Roderick receives only supplied or actually missed concepts before intro', () => {
  let state = createRegion24Session('home');
  state = answerRegion24(state, 'wrong').state;
  assert.deepEqual(state.errorConcepts, ['room:kitchen']);
  for (let i = 1; i < 5; i += 1) state = answerCorrect(state);
  const standard = finishRegion24Standard(state);
  assert.equal(standard.won, true);
  assert.deepEqual(standard.state.bossMechanic.revengeQueue, ['room:kitchen']);
  const supplied = createRegion24Session('home', { errorConcepts: ['prep:under','object:key'] });
  assert.deepEqual(supplied.bossMechanic.revengeQueue, ['prep:under','object:key']);
});
