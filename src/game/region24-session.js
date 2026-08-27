import { getRegion24 } from '../content/regions-2-4.js';
import { createBraxState,createBlackfinnState,createRoderickState,resolveBrax,resolveBlackfinn,resolveRoderick,telegraphBoss } from './region-boss-core.js';
import { createVargasState,createIronhookState,createThorneState,createCorvinState,resolveVargas,resolveIronhook,resolveThorne,resolveCorvin,telegraphRegion10Boss } from './region10-boss-core.js';

function createMechanic(regionId,errorConcepts=[]){
 if(regionId==='library')return createBraxState(202);
 if(regionId==='wildlife')return createBlackfinnState(303);
 if(regionId==='home')return createRoderickState(errorConcepts);
 if(regionId==='family')return createVargasState();
 if(regionId==='body')return createIronhookState(606);
 if(regionId==='travel')return createThorneState();
 if(regionId==='movement')return createCorvinState(808);
 throw new Error(`Unsupported regional boss ${regionId}`);
}

export function createRegion24Session(regionId,{errorConcepts=[]}={}){
 const region=getRegion24(regionId); if(!region) throw new Error(`Unknown regional campaign ${regionId}`);
 const initialErrors=[...new Set(errorConcepts.filter(Boolean))].slice(-3);
 return {regionId,phase:'standard',index:0,wordPower:0,solved:0,answers:{},errorConcepts:initialErrors,bossIndex:0,bossHp:3,bossMechanic:createMechanic(regionId,initialErrors),complete:false};
}
const answerText=(value)=>Array.isArray(value)?value.join(' '):String(value??'').trim();
export function currentRegion24Challenge(session){const region=getRegion24(session.regionId);return session.phase==='boss'?region.boss[session.bossIndex]??null:region.standard[session.index]??null;}
export function answerRegion24(session,answer){
 const next=structuredClone(session), challenge=currentRegion24Challenge(next); if(!challenge) return {state:next,result:null};
 const expected=answerText(challenge.correct), actual=answerText(answer), correct=actual===expected;
 next.answers[challenge.id]={correct,answer:actual,concept:challenge.concept??null};
 if(correct){next.wordPower+=3;next.solved+=1;} else if(next.phase==='standard'&&challenge.concept){next.errorConcepts=[...new Set([...next.errorConcepts,challenge.concept])].slice(-3);}
 if(next.phase==='standard') next.index+=1; else {
   next.bossIndex+=1;
   if(correct)next.bossHp=Math.max(0,next.bossHp-1);
   if(next.regionId==='library')next.bossMechanic=resolveBrax(next.bossMechanic,{counterCorrect:Boolean(challenge.counter&&correct)});
   if(next.regionId==='wildlife')next.bossMechanic=resolveBlackfinn(next.bossMechanic,{scoutCorrect:Boolean(challenge.counter&&correct)});
   if(next.regionId==='home')next.bossMechanic=resolveRoderick(next.bossMechanic,{revengeCorrect:Boolean(challenge.counter&&correct)});
   if(next.regionId==='family')next.bossMechanic=resolveVargas(next.bossMechanic,{treasureCorrect:Boolean(challenge.counter&&correct)});
   if(next.regionId==='body')next.bossMechanic=resolveIronhook(next.bossMechanic,{chainBreakCorrect:Boolean(challenge.counter&&correct)});
   if(next.regionId==='travel')next.bossMechanic=resolveThorne(next.bossMechanic,{directionCorrect:Boolean(challenge.counter&&correct)});
   if(next.regionId==='movement')next.bossMechanic=resolveCorvin(next.bossMechanic,{counterCorrect:Boolean(challenge.counter&&correct)});
 }
 return {state:next,result:{correct,expected,power:correct?3:0,challengeId:challenge.id}};
}
export function finishRegion24Standard(session){
 const next=structuredClone(session), region=getRegion24(next.regionId), crown=next.answers[region.standard.at(-1).id];
 if(next.regionId==='home') next.bossMechanic=createRoderickState(next.errorConcepts);
 return {state:next,won:next.solved>=3&&Boolean(crown?.correct),score:next.wordPower};
}
export function startRegion24Boss(session){const next=structuredClone(session);next.phase='boss';next.bossIndex=0;if(next.regionId==='home')next.bossMechanic=createRoderickState(next.errorConcepts);return next;}
export function finishRegion24Boss(session){const next=structuredClone(session);const region=getRegion24(next.regionId);const crown=next.answers[region.boss.at(-1).id];const won=next.bossHp===0&&Boolean(crown?.correct);next.complete=won;return {state:next,won,score:next.wordPower};}
export function region24BossTelegraph(session){return ['family','body','travel','movement'].includes(session.regionId)?telegraphRegion10Boss(session.bossMechanic):telegraphBoss(session.bossMechanic);}
