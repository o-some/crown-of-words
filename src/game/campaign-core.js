import { createCampaignDefinition, validateCampaignDefinition } from './campaign-data.js';
import { planEnemyIntent, planEnemyTurn, preserveOfflineState } from './ai-director.js';

const DISTRICT_STATES = new Set(['locked', 'neutral', 'scouted', 'contested', 'controlled', 'mastered', 'boss_locked', 'boss_available']);
const PLAYER_HELD = new Set(['controlled', 'mastered', 'contested']);
const clone = (value) => structuredClone(value);
const regionIdOf = (districtId) => String(districtId).split(':')[0];

export function createCampaignState(seed = 1) {
  const definition = createCampaignDefinition();
  const errors = validateCampaignDefinition(definition);
  if (errors.length) throw new Error(errors.join('; '));
  const districts = Object.fromEntries(Object.keys(definition.districts).map((id) => [id, {
    status: id === 'garden:dock' ? 'neutral' : 'locked',
    owner: null,
    supply: 0,
    fortification: 0,
  }]));
  return {
    version: 2,
    seed: seed >>> 0,
    rngState: seed >>> 0,
    round: 1,
    phase: 'player',
    commandPearls: 3,
    definition,
    districts,
    regionControl: {},
    enemyIntents: [],
    enemyDecisionLog: [],
    supplyPressure: {},
    blockades: [],
    eventLog: [],
  };
}

export function nextRandom(state) {
  let x = state.rngState || 1;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const next = x >>> 0;
  return { state: { ...state, rngState: next }, value: next / 4294967296 };
}

export const areDistrictsAdjacent = (state, a, b) => Boolean(state.definition.districts[a]?.neighbors.includes(b));
export const areRegionsConnected = (state, a, b) => state.definition.regionRoutes.some((route) => route.regions.includes(a) && route.regions.includes(b));

export function setDistrictStatus(state, id, status, owner = null) {
  if (!state.districts[id]) throw new Error(`unknown district: ${id}`);
  if (!DISTRICT_STATES.has(status)) throw new Error(`invalid district status: ${status}`);
  const next = clone(state);
  next.districts[id] = { ...next.districts[id], status, owner };
  return next;
}

export function unlockLocalProgress(state, regionId) {
  const next = clone(state);
  const region = next.definition.regions[regionId];
  if (!region) throw new Error(`unknown region: ${regionId}`);
  const ids = region.districts;
  for (let i = 1; i < ids.length; i += 1) {
    const previous = next.districts[ids[i - 1]];
    const current = next.districts[ids[i]];
    if (current.status === 'locked' && ['scouted', 'controlled', 'mastered'].includes(previous.status)) current.status = i === 4 ? 'boss_locked' : 'neutral';
  }
  return next;
}

export function calculateSupply(state, regionId) {
  const region = state.definition.regions[regionId];
  if (!region) return 0;
  const controlled = region.districts.filter((id) => ['controlled', 'mastered'].includes(state.districts[id].status));
  const dock = state.districts[`${regionId}:dock`];
  const base = Math.min(5, controlled.length + (dock?.owner === 'player' ? 1 : 0));
  const pressure = Math.max(0, Number(state.supplyPressure?.[regionId] ?? 0));
  return Math.max(0, base - pressure);
}

export function refreshSupply(state) {
  const next = clone(state);
  for (const regionId of Object.keys(next.definition.regions)) {
    const supply = calculateSupply(next, regionId);
    for (const id of next.definition.regions[regionId].districts) next.districts[id].supply = supply;
  }
  return next;
}

export function canAttack(state, fromId, toId) {
  const from = state.districts[fromId];
  const to = state.districts[toId];
  if (!from || !to || from.owner !== 'player') return false;
  if (['locked', 'boss_locked'].includes(to.status)) return false;
  return areDistrictsAdjacent(state, fromId, toId);
}

export function applyEnemyIntent(state, intent) {
  const next = clone(state);
  const target = next.districts[intent.targetId];
  if (!target) throw new Error(`unknown target: ${intent.targetId}`);
  const regionId = intent.regionId ?? regionIdOf(intent.targetId);

  if (intent.type === 'scout' && target.status === 'neutral') target.status = 'scouted';
  if (intent.type === 'fortify') target.fortification = Math.min(3, target.fortification + 1);
  if (intent.type === 'raid') next.supplyPressure[regionId] = Math.min(3, Number(next.supplyPressure[regionId] ?? 0) + 1);
  if (intent.type === 'contest' && target.owner === 'player' && ['controlled', 'mastered'].includes(target.status)) {
    target.status = 'contested';
    target.owner = 'player';
  }
  if (intent.type === 'blockade') {
    const blockadeKey = `${intent.enemyId}:${intent.targetId}`;
    if (!next.blockades.some((entry) => entry.key === blockadeKey)) next.blockades.push({ key: blockadeKey, enemyId: intent.enemyId, targetId: intent.targetId, regionId });
  }
  if (intent.type === 'feint' && target.owner === 'player' && PLAYER_HELD.has(target.status)) {
    target.status = 'contested';
    target.owner = 'player';
  }

  next.eventLog.push({ round: next.round, actor: 'enemy', telegraphed: intent.telegraphed !== false, ...intent });
  return refreshSupply(next);
}

export function clearTemporaryEnemyPressure(state, regionId) {
  const next = clone(state);
  if (regionId) {
    delete next.supplyPressure[regionId];
    next.blockades = next.blockades.filter((entry) => entry.regionId !== regionId);
  } else {
    next.supplyPressure = {};
    next.blockades = [];
  }
  return refreshSupply(next);
}

export function createEnemyIntent(state, enemyId = 'niko') {
  return planEnemyIntent(state, enemyId);
}

export function endPlayerRound(state, options = {}) {
  if (state.phase !== 'player') throw new Error('player round can only end during player phase');
  const enemyIds = Array.isArray(options) ? options : options.enemyIds ?? ['niko'];
  const difficulty = Array.isArray(options) ? 'explorer' : options.difficulty ?? 'explorer';
  let next = clone(state);
  next.phase = 'enemy';
  const planned = planEnemyTurn(next, enemyIds, { difficulty });
  next = planned.state;
  next.enemyIntents = planned.intents;
  next.enemyDecisionLog.push(...planned.decisions.map((decision) => ({ round: next.round, ...decision })));
  return next;
}

export function resolveEnemyRound(state) {
  if (state.phase !== 'enemy') throw new Error('enemy round can only resolve during enemy phase');
  let next = clone(state);
  for (const intent of next.enemyIntents) next = applyEnemyIntent(next, intent);
  next.enemyIntents = [];
  next.phase = 'player';
  next.round += 1;
  next.commandPearls = 3;
  return refreshSupply(next);
}

export function reconcileOfflineCampaign(state) {
  return preserveOfflineState(state);
}

export function serializeCampaign(state) {
  return JSON.stringify(state);
}

export function restoreCampaign(serialized) {
  const state = JSON.parse(serialized);
  const errors = validateCampaignDefinition(state.definition);
  if (errors.length) throw new Error(`invalid campaign save: ${errors.join('; ')}`);
  return {
    ...state,
    version: Math.max(2, Number(state.version ?? 1)),
    enemyDecisionLog: state.enemyDecisionLog ?? [],
    supplyPressure: state.supplyPressure ?? {},
    blockades: state.blockades ?? [],
  };
}
