export const HELPER_DEFINITIONS = Object.freeze([
  Object.freeze({ id: 'helper-meli-food', name: 'Meli', focus: 'Früchte / Essen', effect: 'first-garden-miss-softened', asset: 'helpers/meli.webp' }),
  Object.freeze({ id: 'helper-neri-nature', name: 'Neri', focus: 'Natur', effect: 'reveal-enemy-intent', asset: 'helpers/neri.webp' }),
  Object.freeze({ id: 'helper-skippi-travel', name: 'Skippi', focus: 'Reise', effect: 'alternative-sea-route', asset: 'helpers/skippi.webp' }),
  Object.freeze({ id: 'helper-fino-home', name: 'Fino', focus: 'Zuhause', effect: 'territory-shield', asset: 'helpers/fino.webp' }),
]);

export function createHelperState(helperId = 'helper-meli-food') {
  const definition = HELPER_DEFINITIONS.find((item) => item.id === helperId);
  if (!definition) throw new Error('unknown helper');
  return { helperId, consumed: false, events: [] };
}

export function selectHelper(state, helperId) {
  if (!HELPER_DEFINITIONS.some((item) => item.id === helperId)) return state;
  return { helperId, consumed: false, events: [] };
}

export function helperDefinition(state) {
  return HELPER_DEFINITIONS.find((item) => item.id === state.helperId) ?? HELPER_DEFINITIONS[0];
}

export function applyHelperEvent(state, event, context = {}) {
  const next = structuredClone(state);
  const definition = helperDefinition(next);
  let effect = null;

  if (definition.id === 'helper-meli-food' && event === 'answer-wrong' && context.regionId === 'garden' && !next.consumed) {
    next.consumed = true;
    effect = { type: 'pressure-reduction', amount: 1, label: 'Meli federt den ersten Gartenfehler ab.' };
  }
  if (definition.id === 'helper-neri-nature' && event === 'encounter-start' && !next.consumed) {
    next.consumed = true;
    effect = { type: 'reveal-intent', label: 'Neri deckt die gegnerische Absicht auf.' };
  }
  if (definition.id === 'helper-skippi-travel' && event === 'route-request' && !next.consumed) {
    next.consumed = true;
    effect = { type: 'alternative-route', label: 'Skippi öffnet einmal eine alternative Seeroute.' };
  }
  if (definition.id === 'helper-fino-home' && event === 'defense-start' && !next.consumed) {
    next.consumed = true;
    effect = { type: 'territory-shield', amount: 1, label: 'Fino gibt dem Bezirk einen Schutzschild.' };
  }

  if (effect) next.events.push({ event, effect });
  return { state: next, effect };
}
