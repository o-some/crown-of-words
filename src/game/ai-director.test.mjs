import assert from 'node:assert/strict';
import test from 'node:test';
import { ENEMY_ARCHETYPES, describeEnemyIntent, enemyDefinition, planEnemyIntent, planEnemyTurn, preserveOfflineState } from './ai-director.js';
import { createCampaignState, setDistrictStatus } from './campaign-core.js';

function tacticalState(seed = 77) {
  let state = createCampaignState(seed);
  state = setDistrictStatus(state, 'garden:dock', 'controlled', 'player');
  state = setDistrictStatus(state, 'garden:learning', 'controlled', 'enemy');
  state = setDistrictStatus(state, 'garden:village', 'neutral', null);
  state = setDistrictStatus(state, 'garden:arena', 'controlled', 'player');
  state.districts['garden:dock'].supply = 2;
  state.districts['garden:arena'].supply = 3;
  state.districts['garden:learning'].fortification = 1;
  return state;
}

test('all eight canonical enemy archetypes exist with unique ids', () => {
  assert.equal(ENEMY_ARCHETYPES.length, 8);
  assert.equal(new Set(ENEMY_ARCHETYPES.map((enemy) => enemy.id)).size, 8);
  assert.deepEqual(ENEMY_ARCHETYPES.map((enemy) => enemy.id), ['niko', 'lio', 'mako', 'taro', 'piko', 'koda', 'yara', 'riven']);
});

test('same seed and board produce identical visible intents and decision logs', () => {
  const a = tacticalState(4242);
  const b = tacticalState(4242);
  const turnA = planEnemyTurn(a, ENEMY_ARCHETYPES.map((enemy) => enemy.id));
  const turnB = planEnemyTurn(b, ENEMY_ARCHETYPES.map((enemy) => enemy.id));
  assert.deepEqual(turnA, turnB);
  assert.ok(turnA.intents.every((intent) => intent.telegraphed === true));
});

test('each enemy plans at most one main action and never receives answer data', () => {
  const state = tacticalState();
  for (const enemy of ENEMY_ARCHETYPES) {
    const planned = planEnemyIntent(state, enemy.id, { difficulty: 'captain', futurePlayerAnswer: 'forbidden' });
    assert.ok(planned.intent == null || typeof planned.intent.type === 'string');
    assert.equal(Array.isArray(planned.intent), false);
    assert.equal(JSON.stringify(planned).includes('futurePlayerAnswer'), false);
    assert.equal(JSON.stringify(planned).includes('correctAnswer'), false);
  }
});

test('archetype preferences are distinct on a mixed tactical board', () => {
  const state = tacticalState(5);
  assert.equal(planEnemyIntent(state, 'mako').intent.type, 'fortify');
  assert.equal(planEnemyIntent(state, 'taro').intent.type, 'fortify');
  assert.equal(planEnemyIntent(state, 'koda').intent.type, 'blockade');
  assert.equal(planEnemyIntent(state, 'riven').intent.type, 'raid');
  assert.ok(['scout', 'contest'].includes(planEnemyIntent(state, 'niko').intent.type));
  assert.ok(['scout', 'feint'].includes(planEnemyIntent(state, 'lio').intent.type));
});

test('intent descriptions are explicit and visible before resolution', () => {
  const planned = planEnemyIntent(tacticalState(9), 'riven');
  const description = describeEnemyIntent(planned.intent);
  assert.equal(description.enemyName, 'Riven');
  assert.equal(description.visible, true);
  assert.match(description.actionLabel, /Versorgungsdruck|blockiert/);
});

test('offline reconciliation performs no enemy turn and mutates nothing', () => {
  const state = tacticalState(1234);
  const snapshot = structuredClone(state);
  const restored = preserveOfflineState(state);
  assert.deepEqual(restored, snapshot);
  assert.notEqual(restored, state);
  assert.deepEqual(state, snapshot);
});

test('unknown enemy ids fail closed', () => {
  assert.equal(enemyDefinition('not-real'), null);
  assert.throws(() => planEnemyIntent(tacticalState(), 'not-real'), /unknown enemy archetype/);
});
