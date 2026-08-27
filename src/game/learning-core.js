export const HINT_LEVELS = Object.freeze([0,1,2,3]);

export function createChallenge({ id, type, conceptId, crown = false, correctAnswer, prompt = '', options = [], tokens = [] }) {
  if (!id || !type || !conceptId || correctAnswer == null) throw new Error('invalid challenge');
  return Object.freeze({
    id,
    type,
    conceptId,
    crown: Boolean(crown),
    correctAnswer,
    prompt,
    options: Object.freeze([...options]),
    tokens: Object.freeze([...tokens]),
  });
}

export function createEncounter(challenges) {
  if (!Array.isArray(challenges) || challenges.length < 1) throw new Error('encounter needs challenges');
  const crownCount = challenges.filter((item) => item.crown).length;
  if (crownCount !== 1) throw new Error('encounter needs exactly one Crown Sentence');
  return {
    challenges,
    results: {},
    wordPower: 0,
    solvedCount: 0,
    completed: false,
  };
}

export function scoreAttempt({ correct, hintLevel = 0, correctedAfterError = false, solutionShown = false, skipped = false }) {
  if (solutionShown || skipped || !correct) return 0;
  if (correctedAfterError) return 1;
  if (hintLevel >= 2) return 1;
  if (hintLevel === 1) return 2;
  return 3;
}

export function evaluateChallenge(state, challengeId, attempt) {
  if (state.results[challengeId]) throw new Error('challenge already evaluated');
  const challenge = state.challenges.find((item) => item.id === challengeId);
  if (!challenge) throw new Error('unknown challenge');
  const correct = attempt.answer === challenge.correctAnswer;
  const power = scoreAttempt({ ...attempt, correct });
  const solved = correct && !attempt.solutionShown && !attempt.skipped;
  const next = structuredClone(state);
  next.results[challengeId] = {
    correct,
    solved,
    power,
    crown: challenge.crown,
    hintLevel: attempt.hintLevel ?? 0,
    solutionShown: Boolean(attempt.solutionShown),
    skipped: Boolean(attempt.skipped),
  };
  next.wordPower += power;
  if (solved) next.solvedCount += 1;
  next.completed = Object.keys(next.results).length === next.challenges.length;
  return next;
}

export function resolveStandardEncounter(state, { tacticPower = 0, enemyPressure = 0 } = {}) {
  if (!state.completed) return { won: false, reason: 'encounter-incomplete' };
  const crown = Object.values(state.results).find((result) => result.crown);
  if (!crown?.solved) return { won: false, reason: 'crown-sentence-required' };
  if (state.solvedCount < 3) return { won: false, reason: 'minimum-learning-not-met' };
  const total = state.wordPower + Math.max(0, Math.min(4, tacticPower)) - Math.max(0, Math.min(6, enemyPressure));
  return { won: total >= 11, reason: total >= 11 ? 'victory' : 'insufficient-total', total };
}

export function resolveBossEncounter(state, { tacticPower = 0, enemyPressure = 0, bossHp = 1 } = {}) {
  if (!state.completed) return { won: false, reason: 'encounter-incomplete' };
  const crown = Object.values(state.results).find((result) => result.crown);
  if (!crown?.solved) return { won: false, reason: 'crown-sentence-required' };
  if (bossHp > 0) return { won: false, reason: 'boss-hp-remaining' };
  const total = state.wordPower + Math.max(0, Math.min(4, tacticPower)) - Math.max(0, Math.min(6, enemyPressure));
  return { won: total >= 14, reason: total >= 14 ? 'victory' : 'insufficient-total', total };
}
