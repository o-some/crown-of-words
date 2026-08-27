import assert from 'node:assert/strict';
import { createChallenge, createEncounter, evaluateChallenge, resolveStandardEncounter, resolveBossEncounter, scoreAttempt } from './learning-core.js';

const challenges = [
  createChallenge({ id:'q1', type:'translation', conceptId:'garden-1', correctAnswer:'apple' }),
  createChallenge({ id:'q2', type:'translation', conceptId:'garden-2', correctAnswer:'green' }),
  createChallenge({ id:'q3', type:'scramble', conceptId:'garden-3', correctAnswer:'water' }),
  createChallenge({ id:'q4', type:'gap', conceptId:'garden-4', correctAnswer:'grows' }),
  createChallenge({ id:'q5', type:'sentence', conceptId:'garden-crown', crown:true, correctAnswer:'The flower grows.' }),
];

assert.equal(scoreAttempt({ correct:true }), 3);
assert.equal(scoreAttempt({ correct:true, hintLevel:1 }), 2);
assert.equal(scoreAttempt({ correct:true, correctedAfterError:true }), 1);
assert.equal(scoreAttempt({ correct:true, solutionShown:true }), 0);

let state = createEncounter(challenges);
for (const item of challenges) state = evaluateChallenge(state, item.id, { answer:item.correctAnswer });
assert.equal(state.wordPower, 15);
assert.equal(state.solvedCount, 5);
assert.equal(resolveStandardEncounter(state, { tacticPower:0, enemyPressure:4 }).won, true);
assert.equal(resolveBossEncounter(state, { tacticPower:3, enemyPressure:3, bossHp:0 }).won, true);
assert.throws(() => evaluateChallenge(state, 'q1', { answer:'apple' }), /already evaluated/);

let crownFail = createEncounter(challenges);
for (const item of challenges) crownFail = evaluateChallenge(crownFail, item.id, { answer:item.crown ? 'wrong' : item.correctAnswer });
assert.equal(resolveStandardEncounter(crownFail, { tacticPower:4 }).reason, 'crown-sentence-required');

let learningFail = createEncounter(challenges);
learningFail = evaluateChallenge(learningFail, 'q1', { answer:'apple' });
learningFail = evaluateChallenge(learningFail, 'q2', { answer:'wrong' });
learningFail = evaluateChallenge(learningFail, 'q3', { answer:'wrong' });
learningFail = evaluateChallenge(learningFail, 'q4', { answer:'wrong' });
learningFail = evaluateChallenge(learningFail, 'q5', { answer:'The flower grows.' });
assert.equal(learningFail.solvedCount, 2);
assert.equal(resolveStandardEncounter(learningFail, { tacticPower:4 }).reason, 'minimum-learning-not-met');

console.log('learning core tests passed');
