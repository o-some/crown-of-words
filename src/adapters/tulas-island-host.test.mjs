import assert from 'node:assert/strict';
import test from 'node:test';
import { createStableEventId, createTulasIslandHostAdapter } from './tulas-island-host.js';

function makeHost({ guest = false, failEconomy = false } = {}) {
  let state = {
    route: { name: 'game', params: { id: 'crown-of-words' } },
    progress: { xp: 10, shells: 150, stars: {}, mastery: {} },
    session: { activeGame: null },
  };
  const rewards = [];
  return {
    get state() { return state; },
    rewards,
    capabilities: {
      getState: () => state,
      setState: updater => { state = updater(structuredClone(state)); return state; },
      creditGameplayShells: async (amount, reason, eventId) => {
        if (failEconomy) throw new Error('offline');
        if (guest) return null;
        if (!rewards.some(item => item.eventId === eventId)) rewards.push({ amount, reason, eventId });
        return true;
      },
    },
  };
}

test('host save is stored only through host state boundary and round-trips', () => {
  const host = makeHost();
  const adapter = createTulasIslandHostAdapter(host.capabilities);
  const envelope = { schemaVersion: 1, gameState: { screen: 'boss', bossHp: 2 } };
  assert.equal(adapter.loadSave(), null);
  assert.equal(adapter.saveSave(envelope), true);
  assert.deepEqual(adapter.loadSave(), envelope);
  assert.equal(host.state.session.activeGame.id, 'crown-of-words');
  assert.equal(host.state.session.activeGame.contractVersion, 1);
  adapter.clearSave();
  assert.equal(adapter.loadSave(), null);
});

test('stable reward id is deterministic and duplicate does not double progress or wallet', async () => {
  const host = makeHost();
  const adapter = createTulasIslandHostAdapter(host.capabilities);
  const eventId = createStableEventId('boss', 'kai');
  const event = { eventId, kind: 'boss', regionId: 'garden', xp: 25, shells: 12, stars: 3, mastery: 1 };
  const first = await adapter.commitProgressEvent(event);
  const second = await adapter.commitProgressEvent(event);
  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(host.state.progress.xp, 35);
  assert.equal(host.state.progress.shells, 150);
  assert.equal(host.state.progress.stars['crown-of-words:garden'], 3);
  assert.equal(host.state.progress.mastery['crown-of-words:garden'], 1);
  assert.equal(host.rewards.length, 1);
  assert.equal(host.rewards[0].eventId, eventId);
});

test('guest host receives local shells exactly once when economy boundary returns null', async () => {
  const host = makeHost({ guest: true });
  const adapter = createTulasIslandHostAdapter(host.capabilities);
  const eventId = createStableEventId('campaign-clear', 'crown-of-words');
  const event = { eventId, kind: 'campaign', regionId: 'crown-castle', xp: 250, shells: 100, stars: 3, mastery: 1 };
  const first = await adapter.commitProgressEvent(event);
  const second = await adapter.commitProgressEvent(event);
  assert.equal(first.walletHandledByEconomy, false);
  assert.equal(second.duplicate, true);
  assert.equal(host.state.progress.shells, 250);
  assert.equal(host.state.progress.xp, 260);
  assert.equal(host.rewards.length, 0);
});

test('economy failure is retryable and does not partially commit progress', async () => {
  const host = makeHost({ failEconomy: true });
  const adapter = createTulasIslandHostAdapter(host.capabilities);
  const eventId = createStableEventId('campaign-clear', 'retry-case');
  const result = await adapter.commitProgressEvent({ eventId, kind: 'campaign', regionId: 'crown-castle', xp: 250, shells: 100, stars: 3, mastery: 1 });
  assert.equal(result.ok, false);
  assert.equal(result.retryable, true);
  assert.equal(host.state.progress.xp, 10);
  assert.equal(host.state.progress.shells, 150);
  assert.equal(adapter.getIntegrationState().committedEventIds?.includes(eventId) ?? false, false);
});

test('replay can improve stars/mastery without duplicating first-loot event', async () => {
  const host = makeHost();
  const adapter = createTulasIslandHostAdapter(host.capabilities);
  await adapter.commitProgressEvent({ eventId: createStableEventId('region-first-clear', 'library'), kind: 'region', regionId: 'library', xp: 20, shells: 8, stars: 1, mastery: 0.5 });
  await adapter.commitProgressEvent({ eventId: createStableEventId('region-replay-3star', 'library'), kind: 'replay', regionId: 'library', xp: 5, shells: 0, stars: 3, mastery: 0.9 });
  assert.equal(host.state.progress.stars['crown-of-words:library'], 3);
  assert.equal(host.state.progress.mastery['crown-of-words:library'], 0.9);
  assert.equal(host.rewards.length, 1);
});

test('exit uses host route boundary instead of navigation globals', () => {
  const host = makeHost();
  const adapter = createTulasIslandHostAdapter(host.capabilities);
  adapter.exitGame();
  assert.deepEqual(host.state.route, { name: 'home', params: {} });
});
