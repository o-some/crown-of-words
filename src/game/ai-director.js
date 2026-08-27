const clone = (value) => structuredClone(value);

export const ENEMY_ARCHETYPES = Object.freeze([
  Object.freeze({ id: 'niko', name: 'Niko', role: 'Leichter Deckhand', behavior: 'weak-neutral', actions: Object.freeze(['scout', 'contest']) }),
  Object.freeze({ id: 'lio', name: 'Lio', role: 'Schneller Kundschafter', behavior: 'recon-feint', actions: Object.freeze(['scout', 'feint']) }),
  Object.freeze({ id: 'mako', name: 'Mako', role: 'Robuster Räuber', behavior: 'fortifier', actions: Object.freeze(['fortify', 'raid']) }),
  Object.freeze({ id: 'taro', name: 'Taro', role: 'Schild-Bukanier', behavior: 'defender', actions: Object.freeze(['fortify', 'contest']) }),
  Object.freeze({ id: 'piko', name: 'Piko', role: 'Wellen-Skater', behavior: 'route-runner', actions: Object.freeze(['scout', 'contest']) }),
  Object.freeze({ id: 'koda', name: 'Koda', role: 'Anker-Brute', behavior: 'blockader', actions: Object.freeze(['blockade', 'fortify']) }),
  Object.freeze({ id: 'yara', name: 'Yara', role: 'Gezeitenruferin', behavior: 'supporter', actions: Object.freeze(['fortify', 'scout']) }),
  Object.freeze({ id: 'riven', name: 'Riven', role: 'Kanonen-Korsarin', behavior: 'pressure', actions: Object.freeze(['raid', 'blockade']) }),
]);

const ENEMY_BY_ID = new Map(ENEMY_ARCHETYPES.map((enemy) => [enemy.id, enemy]));
const PLAYER_HELD = new Set(['controlled', 'mastered', 'contested']);
const OPEN = new Set(['neutral', 'scouted']);

export function enemyDefinition(enemyId) {
  return ENEMY_BY_ID.get(enemyId) ?? null;
}

function stepRng(rngState) {
  let x = rngState || 1;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const next = x >>> 0;
  return { rngState: next, value: next / 4294967296 };
}

function regionIdOf(districtId) {
  return String(districtId).split(':')[0];
}

function districtEntries(state) {
  return Object.entries(state.districts ?? {}).filter(([, district]) => district && district.status !== 'locked' && district.status !== 'boss_locked');
}

function scoreTarget(enemy, districtId, district) {
  const playerHeld = district.owner === 'player' && PLAYER_HELD.has(district.status);
  const enemyHeld = district.owner === 'enemy' && ['controlled', 'mastered'].includes(district.status);
  const open = OPEN.has(district.status) && district.owner !== 'player';
  const supply = Number(district.supply ?? 0);
  const fortification = Number(district.fortification ?? 0);

  switch (enemy.behavior) {
    case 'weak-neutral': return (open ? 80 : playerHeld ? 45 : 0) - fortification * 8 - supply * 2;
    case 'recon-feint': return (open ? 75 : playerHeld ? 62 : 0) + (district.status === 'scouted' ? 7 : 0) - fortification * 3;
    case 'fortifier': return (enemyHeld ? 90 : playerHeld ? 52 : 0) - fortification * 14 + supply;
    case 'defender': return (enemyHeld ? 96 : playerHeld ? 42 : 0) - fortification * 18;
    case 'route-runner': return (open ? 78 : playerHeld ? 55 : 0) - supply * 5;
    case 'blockader': return (playerHeld ? 92 : enemyHeld ? 45 : 0) + supply * 6;
    case 'supporter': return (enemyHeld ? 88 : open ? 44 : 0) - fortification * 10;
    case 'pressure': return (playerHeld ? 98 : open ? 30 : 0) + supply * 8 - fortification * 2;
    default: return 0;
  }
}

function pickTarget(state, enemy, rng) {
  const ranked = districtEntries(state)
    .map(([id, district]) => ({ id, district, score: scoreTarget(enemy, id, district) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  if (!ranked.length) return null;
  const topScore = ranked[0].score;
  const tied = ranked.filter((candidate) => candidate.score === topScore);
  return tied[Math.floor(rng.value * tied.length) % tied.length];
}

function chooseAction(enemy, target) {
  const district = target.district;
  const playerHeld = district.owner === 'player' && PLAYER_HELD.has(district.status);
  const enemyHeld = district.owner === 'enemy' && ['controlled', 'mastered'].includes(district.status);

  switch (enemy.id) {
    case 'niko': return playerHeld ? 'contest' : 'scout';
    case 'lio': return playerHeld ? 'feint' : 'scout';
    case 'mako': return enemyHeld ? 'fortify' : 'raid';
    case 'taro': return enemyHeld ? 'fortify' : 'contest';
    case 'piko': return playerHeld ? 'contest' : 'scout';
    case 'koda': return playerHeld ? 'blockade' : 'fortify';
    case 'yara': return enemyHeld ? 'fortify' : 'scout';
    case 'riven': return playerHeld ? 'raid' : 'blockade';
    default: return enemy.actions[0];
  }
}

function secondVisibleTarget(state, primaryId) {
  return districtEntries(state)
    .filter(([id, district]) => id !== primaryId && district.owner === 'player' && PLAYER_HELD.has(district.status))
    .map(([id]) => id)
    .sort()[0] ?? null;
}

export function describeEnemyIntent(intent) {
  if (!intent) return null;
  const enemy = enemyDefinition(intent.enemyId);
  const labels = {
    scout: 'kundschaftet aus',
    fortify: 'verstärkt die Verteidigung',
    raid: 'erzeugt Versorgungsdruck',
    contest: 'fordert den Bezirk heraus',
    blockade: 'blockiert die Route',
    feint: 'täuscht zwei Ziele an',
    recover: 'sammelt neue Kraft',
  };
  return {
    enemyName: enemy?.name ?? intent.enemyId,
    role: enemy?.role ?? 'Gegner',
    actionLabel: labels[intent.type] ?? intent.type,
    targetId: intent.targetId,
    secondaryTargetId: intent.secondaryTargetId ?? null,
    visible: true,
  };
}

export function planEnemyIntent(state, enemyId, { difficulty = 'explorer' } = {}) {
  const enemy = enemyDefinition(enemyId);
  if (!enemy) throw new Error(`unknown enemy archetype: ${enemyId}`);
  const rng = stepRng(state.rngState);
  const target = pickTarget(state, enemy, rng);
  const nextState = { ...state, rngState: rng.rngState };
  if (!target) return { state: nextState, intent: null, decision: { enemyId, reason: 'no-valid-target' } };

  const type = chooseAction(enemy, target);
  const secondaryTargetId = type === 'feint' ? secondVisibleTarget(state, target.id) : null;
  const intent = {
    enemyId,
    type,
    targetId: target.id,
    regionId: regionIdOf(target.id),
    telegraphed: true,
    ...(secondaryTargetId ? { secondaryTargetId } : {}),
  };
  return {
    state: nextState,
    intent,
    decision: {
      enemyId,
      behavior: enemy.behavior,
      chosenAction: type,
      targetId: target.id,
      score: target.score,
      difficulty,
      rngStateBefore: state.rngState,
      rngStateAfter: rng.rngState,
    },
  };
}

export function planEnemyTurn(state, enemyIds = ['niko'], options = {}) {
  let next = clone(state);
  const intents = [];
  const decisions = [];
  for (const enemyId of enemyIds) {
    const planned = planEnemyIntent(next, enemyId, options);
    next = planned.state;
    if (planned.intent) intents.push(planned.intent);
    decisions.push(planned.decision);
  }
  return { state: next, intents, decisions };
}

export function preserveOfflineState(state) {
  return clone(state);
}
