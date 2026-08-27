import { createCampaignDefinition, validateCampaignDefinition } from './campaign-data.js';

const DISTRICT_STATES=new Set(['locked','neutral','scouted','contested','controlled','mastered','boss_locked','boss_available']);
const clone=value=>structuredClone(value);

export function createCampaignState(seed=1){
 const definition=createCampaignDefinition();
 const errors=validateCampaignDefinition(definition);if(errors.length) throw new Error(errors.join('; '));
 const districts=Object.fromEntries(Object.keys(definition.districts).map(id=>[id,{status:id==='garden:dock'?'neutral':'locked',owner:null,supply:0,fortification:0}]));
 return {version:1,seed:seed>>>0,rngState:seed>>>0,round:1,phase:'player',commandPearls:3,definition,districts,regionControl:{},enemyIntents:[],eventLog:[]};
}

export function nextRandom(state){let x=state.rngState||1;x^=x<<13;x^=x>>>17;x^=x<<5;const next=x>>>0;return {state:{...state,rngState:next},value:next/4294967296};}
export const areDistrictsAdjacent=(state,a,b)=>Boolean(state.definition.districts[a]?.neighbors.includes(b));
export const areRegionsConnected=(state,a,b)=>state.definition.regionRoutes.some(route=>route.regions.includes(a)&&route.regions.includes(b));

export function setDistrictStatus(state,id,status,owner=null){
 if(!state.districts[id]) throw new Error(`unknown district: ${id}`);if(!DISTRICT_STATES.has(status)) throw new Error(`invalid district status: ${status}`);
 const next=clone(state);next.districts[id]={...next.districts[id],status,owner};return next;
}

export function unlockLocalProgress(state,regionId){
 const next=clone(state);const region=next.definition.regions[regionId];if(!region) throw new Error(`unknown region: ${regionId}`);
 const ids=region.districts;for(let i=1;i<ids.length;i+=1){const previous=next.districts[ids[i-1]];const current=next.districts[ids[i]];if(current.status==='locked'&&['scouted','controlled','mastered'].includes(previous.status)) current.status=i===4?'boss_locked':'neutral';}
 return next;
}

export function calculateSupply(state,regionId){
 const region=state.definition.regions[regionId];if(!region) return 0;const controlled=region.districts.filter(id=>['controlled','mastered'].includes(state.districts[id].status));const dock=state.districts[`${regionId}:dock`];return Math.min(5,controlled.length+(dock?.owner==='player'?1:0));
}

export function refreshSupply(state){const next=clone(state);for(const regionId of Object.keys(next.definition.regions)){const supply=calculateSupply(next,regionId);for(const id of next.definition.regions[regionId].districts) next.districts[id].supply=supply;}return next;}

export function canAttack(state,fromId,toId){const from=state.districts[fromId],to=state.districts[toId];if(!from||!to||from.owner!=='player') return false;if(['locked','boss_locked'].includes(to.status)) return false;return areDistrictsAdjacent(state,fromId,toId);}

export function applyEnemyIntent(state,intent){
 const next=clone(state);const target=next.districts[intent.targetId];if(!target) throw new Error(`unknown target: ${intent.targetId}`);
 if(intent.type==='scout'&&target.status==='neutral') target.status='scouted';
 if(intent.type==='fortify') target.fortification=Math.min(3,target.fortification+1);
 if(['raid','contest','blockade','feint'].includes(intent.type)&&['controlled','mastered'].includes(target.status)){target.status='contested';target.owner='player';}
 next.eventLog.push({round:next.round,actor:'enemy',...intent});return next;
}

export function createEnemyIntent(state,enemyId='niko'){
 const candidates=Object.entries(state.districts).filter(([,d])=>['neutral','scouted','controlled','mastered'].includes(d.status));if(!candidates.length) return {state,intent:null};
 const roll=nextRandom(state);const targetId=candidates[Math.floor(roll.value*candidates.length)][0];const target=roll.state.districts[targetId];const type=['controlled','mastered'].includes(target.status)?'contest':'scout';return {state:roll.state,intent:{enemyId,type,targetId}};
}

export function endPlayerRound(state){
 if(state.phase!=='player') throw new Error('player round can only end during player phase');
 let next=clone(state);next.phase='enemy';const generated=createEnemyIntent(next);next=generated.state;next.enemyIntents=generated.intent?[generated.intent]:[];return next;
}
export function resolveEnemyRound(state){let next=clone(state);for(const intent of next.enemyIntents) next=applyEnemyIntent(next,intent);next.enemyIntents=[];next.phase='player';next.round+=1;next.commandPearls=3;return refreshSupply(next);}

export function serializeCampaign(state){return JSON.stringify(state);}
export function restoreCampaign(serialized){const state=JSON.parse(serialized);const errors=validateCampaignDefinition(state.definition);if(errors.length) throw new Error(`invalid campaign save: ${errors.join('; ')}`);return state;}
