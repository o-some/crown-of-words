export const CARD_STATUSES = Object.freeze(['ready', 'played', 'exhausted']);

export function createCardDefinition({ id, name, description, effect, cost = 1 }) {
  if (!id || !name || !effect?.type) throw new Error('invalid card definition');
  return Object.freeze({ id, name, description: description ?? '', cost, effect: Object.freeze({ ...effect }) });
}

export function createCardHand(definitions, { mode = 'explorer' } = {}) {
  if (!Array.isArray(definitions) || definitions.length < 1 || definitions.length > 4) throw new Error('card hand must contain 1-4 cards');
  const ids = definitions.map((card) => card.id);
  if (new Set(ids).size !== ids.length) throw new Error('card ids must be unique');
  return {
    mode,
    selectedId: null,
    explorerRefundAvailable: mode === 'explorer',
    cards: definitions.map((definition) => ({ definition, status: 'ready' })),
    history: [],
  };
}

export function selectCard(state, cardId) {
  const card = state.cards.find((entry) => entry.definition.id === cardId);
  if (!card || card.status !== 'ready') return state;
  const next = structuredClone(state);
  next.selectedId = cardId;
  return next;
}

export function resolveSelectedCard(state, { correct }) {
  if (!state.selectedId) return { state, outcome: null };
  const next = structuredClone(state);
  const card = next.cards.find((entry) => entry.definition.id === next.selectedId);
  if (!card || card.status !== 'ready') return { state, outcome: null };

  let outcome;
  if (correct) {
    card.status = 'played';
    outcome = { type: 'played', cardId: card.definition.id, effect: card.definition.effect };
  } else if (next.explorerRefundAvailable) {
    next.explorerRefundAvailable = false;
    outcome = { type: 'refunded', cardId: card.definition.id, effect: null };
  } else {
    card.status = 'exhausted';
    outcome = { type: 'exhausted', cardId: card.definition.id, effect: null };
  }

  next.history.push({ cardId: card.definition.id, correct: Boolean(correct), outcome: outcome.type });
  next.selectedId = null;
  return { state: next, outcome };
}

export function deriveCardBonuses(state) {
  const totals = { tacticPower: 0, pressureReduction: 0, revealIntent: false, supplyShield: 0 };
  for (const card of state.cards) {
    if (card.status !== 'played') continue;
    const effect = card.definition.effect;
    if (effect.type === 'tactic-power') totals.tacticPower += Number(effect.amount ?? 0);
    if (effect.type === 'pressure-reduction') totals.pressureReduction += Number(effect.amount ?? 0);
    if (effect.type === 'reveal-intent') totals.revealIntent = true;
    if (effect.type === 'supply-shield') totals.supplyShield += Number(effect.amount ?? 0);
  }
  totals.tacticPower = Math.min(4, Math.max(0, totals.tacticPower));
  totals.pressureReduction = Math.max(0, totals.pressureReduction);
  return totals;
}
