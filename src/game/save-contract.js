export const SAVE_SCHEMA_VERSION = 1;
export const GAME_VERSION = '0.1.0';
export const CONTENT_VERSION = 'garden-v1';
export const ASSET_VERSION = 'branch-5-assets-v1';

export function createSaveEnvelope(gameState) {
  if (!gameState || typeof gameState !== 'object') throw new Error('game state required');
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    gameVersion: GAME_VERSION,
    contentVersion: CONTENT_VERSION,
    assetVersion: ASSET_VERSION,
    savedAt: new Date().toISOString(),
    gameState: structuredClone(gameState),
  };
}

export function restoreSaveEnvelope(envelope) {
  if (!envelope || typeof envelope !== 'object') return null;
  if (envelope.schemaVersion !== SAVE_SCHEMA_VERSION) return null;
  if (!envelope.gameState || typeof envelope.gameState !== 'object') return null;
  return structuredClone(envelope.gameState);
}
