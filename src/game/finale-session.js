import { getRegion910 } from '../content/regions-9-10.js';
import { createAzrakState, createVarkosState, resolveAzrak, resolveVarkosPhase, telegraphAzrak, telegraphVarkos } from './finale-boss-core.js';

const answerText=(value)=>Array.isArray(value)?value.join(' '):String(value??'').trim();
const createMechanic=(regionId)=>regionId==='harbor'?createAzrakState():createVarkosState();

export function createFinaleSession(regionId){
  const region=getRegion910(regionId);if(!region)throw new Error(`Unknown finale region ${regionId}`);
  return {regionId,phase:'standard',index:0,bossIndex:0,wordPower:0,solved:0,answers:{},bossHp:regionId==='harbor'?3:4,bossMechanic:createMechanic(regionId),complete:false,campaignComplete:false};
}
export function currentFinaleChallenge(session){const region=getRegion910(session.regionId);return session.phase==='boss'?region.boss[session.bossIndex]??null:region.standard[session.index]??null;}
export function answerFinale(session,answer){
  const next=structuredClone(session),challenge=currentFinaleChallenge(next);if(!challenge)return {state:next,result:null};
  const expected=answerText(challenge.correct),actual=answerText(answer),correct=actual===expected;
  next.answers[challenge.id]={correct,answer:actual};
  if(correct){next.wordPower+=3;next.solved+=1;}
  if(next.phase==='standard')next.index+=1;
  else{
    next.bossIndex+=1;
    if(correct)next.bossHp=Math.max(0,next.bossHp-1);
    if(next.regionId==='harbor')next.bossMechanic=resolveAzrak(next.bossMechanic,{mixedCorrect:Boolean(challenge.counter&&correct)});
    else next.bossMechanic=resolveVarkosPhase(next.bossMechanic,{correct,crownCorrect:Boolean(challenge.phase===4&&correct)});
  }
  return {state:next,result:{correct,expected,power:correct?3:0,challengeId:challenge.id}};
}
export function finishFinaleStandard(session){
  const next=structuredClone(session),region=getRegion910(next.regionId),crown=next.answers[region.standard.at(-1).id];
  return {state:next,won:next.solved>=3&&Boolean(crown?.correct),score:next.wordPower};
}
export function startFinaleBoss(session){const next=structuredClone(session);next.phase='boss';next.bossIndex=0;return next;}
export function finishFinaleBoss(session){
  const next=structuredClone(session),region=getRegion910(next.regionId),crown=next.answers[region.boss.at(-1).id];
  const mechanicComplete=next.regionId==='crown-castle'?next.bossMechanic.complete:true;
  const won=next.bossHp===0&&Boolean(crown?.correct)&&mechanicComplete;
  next.complete=won;next.campaignComplete=won&&next.regionId==='crown-castle';
  return {state:next,won,campaignComplete:next.campaignComplete,score:next.wordPower};
}
export function finaleBossTelegraph(session){return session.regionId==='harbor'?telegraphAzrak(session.bossMechanic):telegraphVarkos(session.bossMechanic);}
