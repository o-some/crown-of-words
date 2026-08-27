import { clearStandaloneSave, loadStandaloneSave, saveStandaloneSave } from './standalone-storage.js';
import { createTulasIslandHostAdapter } from './tulas-island-host.js';

export function createRuntimeAdapter(hostCapabilities = globalThis.__TULAS_ISLAND_CROWN_HOST__) {
  if (hostCapabilities) {
    const host = createTulasIslandHostAdapter(hostCapabilities);
    return Object.freeze({
      mode: 'host',
      loadSave: host.loadSave,
      saveSave: host.saveSave,
      clearSave: host.clearSave,
      commitProgressEvent: host.commitProgressEvent,
      exitGame: host.exitGame,
      host,
    });
  }
  return Object.freeze({
    mode: 'standalone',
    loadSave: () => loadStandaloneSave(),
    saveSave: envelope => saveStandaloneSave(envelope),
    clearSave: () => clearStandaloneSave(),
    commitProgressEvent: async () => ({ ok: true, standalone: true, skippedHostCommit: true }),
    exitGame: () => false,
    host: null,
  });
}
