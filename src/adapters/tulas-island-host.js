const GAME_ID = 'crown-of-words';
const HOST_CONTRACT_VERSION = 1;

const clone = (value) => value == null ? value : structuredClone(value);
const safeInt = (value) => Math.max(0, Math.floor(Number(value || 0)));

export function createStableEventId(kind, id) {
  const normalizedKind = String(kind || 'event').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const normalizedId = String(id || 'unknown').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  return `${GAME_ID}:${normalizedKind}:${normalizedId}:v1`;
}

export function createTulasIslandHostAdapter(capabilities) {
  const { getState, setState, creditGameplayShells } = capabilities || {};
  if (typeof getState !== 'function') throw new Error('host getState capability required');
  if (typeof setState !== 'function') throw new Error('host setState capability required');
  if (typeof creditGameplayShells !== 'function') throw new Error('host creditGameplayShells capability required');

  function readIntegrationState() {
    const host = getState();
    return host?.session?.activeGame?.id === GAME_ID
      ? clone(host.session.activeGame.integration || {})
      : {};
  }

  function loadSave() {
    const host = getState();
    const active = host?.session?.activeGame;
    if (active?.id !== GAME_ID) return null;
    return clone(active.saveEnvelope || null);
  }

  function saveSave(envelope) {
    setState(draft => {
      draft.session ??= {};
      const previous = draft.session.activeGame?.id === GAME_ID ? draft.session.activeGame : {};
      draft.session.activeGame = {
        ...previous,
        id: GAME_ID,
        contractVersion: HOST_CONTRACT_VERSION,
        saveEnvelope: clone(envelope),
        integration: previous.integration || { committedEventIds: [] },
      };
      return draft;
    });
    return true;
  }

  function clearSave() {
    setState(draft => {
      if (draft.session?.activeGame?.id === GAME_ID) draft.session.activeGame = null;
      return draft;
    });
    return true;
  }

  function hasCommitted(eventId) {
    return (readIntegrationState().committedEventIds || []).includes(eventId);
  }

  async function commitProgressEvent(event) {
    const eventId = String(event?.eventId || '');
    if (!eventId) throw new Error('stable eventId required');
    if (hasCommitted(eventId)) return { ok: true, duplicate: true, eventId };

    const xp = safeInt(event.xp);
    const shells = Math.min(300, safeInt(event.shells));
    const stars = Math.min(3, safeInt(event.stars));
    const mastery = Math.max(0, Math.min(1, Number(event.mastery ?? 0)));
    const regionId = String(event.regionId || 'campaign');

    // Wallet credit goes through the host economy boundary. Its event id is stable,
    // so a retry is idempotent on the server ledger.
    if (shells > 0) {
      await creditGameplayShells(shells, `crown-${event.kind || 'learning'}`, eventId);
    }

    setState(draft => {
      draft.progress ??= {};
      draft.progress.xp = safeInt(draft.progress.xp) + xp;
      draft.progress.stars ??= {};
      draft.progress.mastery ??= {};
      if (stars > 0) draft.progress.stars[`${GAME_ID}:${regionId}`] = Math.max(safeInt(draft.progress.stars[`${GAME_ID}:${regionId}`]), stars);
      if (mastery > 0) draft.progress.mastery[`${GAME_ID}:${regionId}`] = Math.max(Number(draft.progress.mastery[`${GAME_ID}:${regionId}`] || 0), mastery);
      draft.session ??= {};
      const previous = draft.session.activeGame?.id === GAME_ID ? draft.session.activeGame : { id: GAME_ID, contractVersion: HOST_CONTRACT_VERSION };
      const committed = new Set(previous.integration?.committedEventIds || []);
      committed.add(eventId);
      draft.session.activeGame = {
        ...previous,
        integration: { ...(previous.integration || {}), committedEventIds: [...committed] },
      };
      return draft;
    });

    return { ok: true, duplicate: false, eventId, xp, shells, stars, mastery };
  }

  function exitGame() {
    setState(draft => {
      draft.route = { name: 'home', params: {} };
      return draft;
    });
  }

  return Object.freeze({
    gameId: GAME_ID,
    contractVersion: HOST_CONTRACT_VERSION,
    loadSave,
    saveSave,
    clearSave,
    commitProgressEvent,
    exitGame,
    getIntegrationState: readIntegrationState,
  });
}

export { GAME_ID, HOST_CONTRACT_VERSION };
