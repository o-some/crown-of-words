import test from 'node:test';
import assert from 'node:assert/strict';
import { anchorKaiTask, createKaiState, resolveKaiTask, visibleKaiQueue } from './kai-core.js';

const ids = ['a','b','c','d','e'];

test('Kai swaps only unresolved non-anchored tasks and never current resolved task', () => {
  const start = createKaiState(ids, 42);
  const next = resolveKaiTask(start, 'a');
  assert.deepEqual(next.resolved, ['a']);
  assert.equal(next.order.includes('a'), true);
  assert.ok(next.lastSwap);
  assert.notEqual(next.lastSwap.a, 'a');
  assert.notEqual(next.lastSwap.b, 'a');
  assert.equal(visibleKaiQueue(next).length, 4);
});

test('Ankerblick protects one unresolved task for one resolution', () => {
  const anchored = anchorKaiTask(createKaiState(ids, 42), 'b');
  const next = resolveKaiTask(anchored, 'a');
  assert.ok(!next.lastSwap || (next.lastSwap.a !== 'b' && next.lastSwap.b !== 'b'));
  assert.equal(next.anchoredId, null);
});

test('Crown Sentence can be fixed outside Kai swaps', () => {
  const start = createKaiState(ids, 42, { fixedIds: ['e'] });
  let next = resolveKaiTask(start, 'a');
  assert.ok(!next.lastSwap || (next.lastSwap.a !== 'e' && next.lastSwap.b !== 'e'));
  next = resolveKaiTask(next, next.order.find((id) => !next.resolved.includes(id) && id !== 'e'));
  assert.ok(!next.lastSwap || (next.lastSwap.a !== 'e' && next.lastSwap.b !== 'e'));
  assert.equal(next.order.at(-1), 'e');
});

test('same seed and actions produce same Kai order', () => {
  const left = resolveKaiTask(createKaiState(ids, 777), 'a');
  const right = resolveKaiTask(createKaiState(ids, 777), 'a');
  assert.deepEqual(left, right);
});
