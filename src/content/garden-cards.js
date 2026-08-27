import { createCardDefinition } from '../game/card-core.js';

export const GARDEN_CARDS = Object.freeze([
  createCardDefinition({ id: 'card-garden-scout', name: 'Blätterspäher', description: 'Deckt die nächste Gegnerabsicht auf.', effect: { type: 'reveal-intent' } }),
  createCardDefinition({ id: 'card-garden-shield', name: 'Rankenschild', description: 'Reduziert Gegnerdruck um 1.', effect: { type: 'pressure-reduction', amount: 1 } }),
  createCardDefinition({ id: 'card-garden-supply', name: 'Samenkiste', description: 'Sichert Versorgung und gibt 1 Taktikkraft.', effect: { type: 'tactic-power', amount: 1 } }),
  createCardDefinition({ id: 'card-garden-rally', name: 'Sonnenruf', description: 'Gibt 1 Taktikkraft.', effect: { type: 'tactic-power', amount: 1 } }),
]);
