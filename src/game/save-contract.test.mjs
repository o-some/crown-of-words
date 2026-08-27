import test from 'node:test';
import assert from 'node:assert/strict';
import { createSaveEnvelope, restoreSaveEnvelope, SAVE_SCHEMA_VERSION } from './save-contract.js';
import { clearStandaloneSave, loadStandaloneSave, saveStandaloneSave, STORAGE_KEY } from '../adapters/standalone-storage.js';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

test('save envelope round-trips game state without mutation', () => {
  const state = { screen: 'boss', bossHp: 3, feedback: { correct: false }, builtTokens: ['The'] };
  const envelope = createSaveEnvelope(state);
  assert.equal(envelope.schemaVersion, SAVE_SCHEMA_VERSION);
  assert.deepEqual(restoreSaveEnvelope(envelope), state);
  envelope.gameState.bossHp = 1;
  assert.equal(state.bossHp, 3);
});

test('incompatible save falls back safely', () => {
  assert.equal(restoreSaveEnvelope({ schemaVersion: 999, gameState: {} }), null);
  assert.equal(restoreSaveEnvelope(null), null);
});

test('standalone adapter stores, loads and clears only through adapter boundary', () => {
  const storage = memoryStorage();
  const envelope = createSaveEnvelope({ screen: 'challenge' });
  assert.equal(saveStandaloneSave(envelope, storage), true);
  assert.deepEqual(loadStandaloneSave(storage), envelope);
  assert.ok(storage.getItem(STORAGE_KEY));
  assert.equal(clearStandaloneSave(storage), true);
  assert.equal(loadStandaloneSave(storage), null);
});

test('storage failures do not crash the game', () => {
  const broken = { getItem(){ throw new Error('blocked'); }, setItem(){ throw new Error('blocked'); }, removeItem(){ throw new Error('blocked'); } };
  assert.equal(loadStandaloneSave(broken), null);
  assert.equal(saveStandaloneSave(createSaveEnvelope({ screen:'campaign' }), broken), false);
  assert.equal(clearStandaloneSave(broken), false);
});
