import assert from 'node:assert/strict';
import { createRegion24Session, currentRegion24Challenge, answerRegion24, finishRegion24Standard, startRegion24Boss, finishRegion24Boss, region24BossTelegraph } from './region24-session.js';
import { getRegion24 } from '../content/regions-2-4.js';

for (const id of ['family','body','travel','movement']) {
  const region=getRegion24(id);assert.ok(region,`${id} region missing`);assert.equal(region.order>=5&&region.order<=8,true);assert.equal(region.standard.length,5);assert.equal(region.boss.length,3);
  let s=createRegion24Session(id);
  for(const challenge of region.standard){const answer=Array.isArray(challenge.correct)?challenge.correct:challenge.correct;s=answerRegion24(s,answer).state;}
  const standard=finishRegion24Standard(s);assert.equal(standard.won,true,`${id} standard should require solved Crown Sentence`);
  s=startRegion24Boss(standard.state);const intro=region24BossTelegraph(s);assert.ok(intro.label&&intro.detail,`${id} boss must telegraph mechanic`);
  for(const challenge of region.boss){assert.equal(currentRegion24Challenge(s).id,challenge.id);s=answerRegion24(s,challenge.correct).state;}
  const boss=finishRegion24Boss(s);assert.equal(boss.won,true,`${id} boss should be beatable with correct language`);assert.equal(boss.state.complete,true);
}

let family=createRegion24Session('family');family=startRegion24Boss(family);const pearl0=family.bossMechanic.commandPearls;family=answerRegion24(family,getRegion24('family').boss[0].correct).state;assert.ok(family.bossMechanic.commandPearls<pearl0,'Vargas steals only temporary encounter pearls');
let body=createRegion24Session('body');body=startRegion24Boss(body);assert.equal(body.bossMechanic.chainActive,true);body=answerRegion24(body,getRegion24('body').boss[0].correct).state;body=answerRegion24(body,getRegion24('body').boss[1].correct).state;body=answerRegion24(body,getRegion24('body').boss[2].correct).state;assert.equal(body.bossMechanic.chainActive,false,'Ironhook chain breaks on correct counter sentence');
let travel=createRegion24Session('travel');travel=startRegion24Boss(travel);travel=answerRegion24(travel,getRegion24('travel').boss[0].correct).state;assert.ok(travel.bossMechanic.shieldedTarget,'Thorne direction answer shields one telegraphed target');assert.equal(travel.bossMechanic.targets.length,2);
let move=createRegion24Session('movement');move=startRegion24Boss(move);const before=structuredClone(move.bossMechanic.adjacency);move=answerRegion24(move,getRegion24('movement').boss[0].correct).state;assert.notDeepEqual(move.bossMechanic.adjacency,before,'Corvin performs real grid shift with recalculated adjacency');

console.log('Regions 5-8 sessions PASS');
