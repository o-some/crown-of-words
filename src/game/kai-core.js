function nextSeed(seed) {
  return (Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0;
}

export function createKaiState(challengeIds, seed = 1201, { fixedIds = [] } = {}) {
  if (!Array.isArray(challengeIds) || challengeIds.length < 3) throw new Error('Kai needs at least three tasks');
  const fixed = fixedIds.filter((id) => challengeIds.includes(id));
  return {
    order: [...challengeIds],
    resolved: [],
    seed: seed >>> 0,
    lastSwap: null,
    anchoredId: null,
    fixedIds: fixed,
  };
}

export function anchorKaiTask(state, challengeId) {
  if (!state.order.includes(challengeId)) throw new Error('unknown Kai task');
  if (state.fixedIds.includes(challengeId)) return state;
  return { ...state, anchoredId: challengeId };
}

export function resolveKaiTask(state, challengeId) {
  if (!state.order.includes(challengeId)) throw new Error('unknown Kai task');
  if (state.resolved.includes(challengeId)) throw new Error('Kai task already resolved');

  const resolved = [...state.resolved, challengeId];
  const candidates = state.order.filter((id) => !resolved.includes(id) && id !== state.anchoredId && !state.fixedIds.includes(id));
  let seed = nextSeed(state.seed);
  let order = [...state.order];
  let lastSwap = null;

  if (candidates.length >= 2) {
    const firstIndex = seed % candidates.length;
    seed = nextSeed(seed);
    let secondIndex = seed % (candidates.length - 1);
    if (secondIndex >= firstIndex) secondIndex += 1;
    const a = candidates[firstIndex];
    const b = candidates[secondIndex];
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    [order[ai], order[bi]] = [order[bi], order[ai]];
    lastSwap = { a, b };
  }

  return {
    ...state,
    order,
    resolved,
    seed,
    lastSwap,
    anchoredId: null,
  };
}

export function visibleKaiQueue(state, limit = 4) {
  return state.order.filter((id) => !state.resolved.includes(id)).slice(0, limit);
}
