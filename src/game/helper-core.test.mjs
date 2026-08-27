import assert from 'node:assert/strict';
import test from 'node:test';
import { HELPER_DEFINITIONS, applyHelperEvent, createHelperState, selectHelper } from './helper-core.js';

test('four canonical helpers have unique technical ids', () => {
  assert.equal(HELPER_DEFINITIONS.length, 4);
  assert.equal(new Set(HELPER_DEFINITIONS.map((item) => item.id)).size, 4);
  assert.ok(HELPER_DEFINITIONS.some((item) => item.id === 'helper-neri-nature'));
  assert.notEqual('helper-neri-nature', 'card-neri-sea-scout');
});

test('Meli softens only the first garden miss', () => {
  let helper = createHelperState('helper-meli-food');
  let result = applyHelperEvent(helper, 'answer-wrong', { regionId: 'garden' });
  assert.equal(result.effect.type, 'pressure-reduction');
  helper = result.state;
  result = applyHelperEvent(helper, 'answer-wrong', { regionId: 'garden' });
  assert.equal(result.effect, null);
});

test('Neri reveals intent once and selection resets usage', () => {
  let helper = createHelperState('helper-meli-food');
  helper = selectHelper(helper, 'helper-neri-nature');
  const result = applyHelperEvent(helper, 'encounter-start');
  assert.equal(result.effect.type, 'reveal-intent');
  assert.equal(result.state.consumed, true);
});
