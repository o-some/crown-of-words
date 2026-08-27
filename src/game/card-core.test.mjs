import assert from 'node:assert/strict';
import test from 'node:test';
import { createCardDefinition, createCardHand, deriveCardBonuses, resolveSelectedCard, selectCard } from './card-core.js';

const cards = [
  createCardDefinition({ id: 'a', name: 'A', effect: { type: 'tactic-power', amount: 1 } }),
  createCardDefinition({ id: 'b', name: 'B', effect: { type: 'pressure-reduction', amount: 1 } }),
  createCardDefinition({ id: 'c', name: 'C', effect: { type: 'reveal-intent' } }),
  createCardDefinition({ id: 'd', name: 'D', effect: { type: 'tactic-power', amount: 5 } }),
];

test('hand supports at most four unique cards', () => {
  assert.equal(createCardHand(cards).cards.length, 4);
  assert.throws(() => createCardHand([...cards, cards[0]]));
});

test('correct language resolution plays selected card exactly once', () => {
  let hand = selectCard(createCardHand(cards), 'a');
  const resolved = resolveSelectedCard(hand, { correct: true });
  hand = resolved.state;
  assert.equal(resolved.outcome.type, 'played');
  assert.equal(hand.cards[0].status, 'played');
  assert.equal(deriveCardBonuses(hand).tacticPower, 1);
  assert.equal(resolveSelectedCard(hand, { correct: true }).outcome, null);
});

test('wrong answer uses explorer refund once, then exhausts', () => {
  let hand = selectCard(createCardHand(cards), 'a');
  let resolved = resolveSelectedCard(hand, { correct: false });
  assert.equal(resolved.outcome.type, 'refunded');
  assert.equal(resolved.state.cards[0].status, 'ready');
  hand = selectCard(resolved.state, 'a');
  resolved = resolveSelectedCard(hand, { correct: false });
  assert.equal(resolved.outcome.type, 'exhausted');
  assert.equal(resolved.state.cards[0].status, 'exhausted');
});

test('tactical bonuses remain capped and never contain answer data', () => {
  let hand = createCardHand(cards, { mode: 'captain' });
  for (const id of ['a', 'd']) {
    hand = selectCard(hand, id);
    hand = resolveSelectedCard(hand, { correct: true }).state;
  }
  const bonus = deriveCardBonuses(hand);
  assert.equal(bonus.tacticPower, 4);
  assert.equal('correctAnswer' in bonus, false);
});
