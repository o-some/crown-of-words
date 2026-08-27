const clone = (value) => structuredClone(value);

export function createBraxState(seed = 1) {
  return { bossId:'brax', seed, markerIndex: Math.abs(seed)%4, pressure:0, disarmed:false, resolved:0 };
}
export function resolveBrax(state, { counterCorrect = false } = {}) {
  const next=clone(state); next.resolved+=1;
  if(counterCorrect){ next.disarmed=true; return next; }
  next.disarmed=false; next.pressure+=1; next.markerIndex=(next.markerIndex+1+(Math.abs(next.seed+next.resolved)%3))%4; return next;
}

export function createBlackfinnState(seed = 1) {
  return { bossId:'blackfinn', seed, fogged:true, hiddenTargetIndex:Math.abs(seed)%2, resolved:0 };
}
export function resolveBlackfinn(state,{ scoutCorrect=false }={}){
  const next=clone(state); next.resolved+=1;
  if(scoutCorrect){next.fogged=false;return next;}
  next.fogged=true; next.hiddenTargetIndex=(Math.abs(next.seed+next.resolved))%2; return next;
}

export function createRoderickState(errorConcepts = []) {
  const queue=[...new Set(errorConcepts.filter(Boolean))].slice(-3);
  return { bossId:'roderick', revengeQueue:queue, revengeAttempts:0, shields:3, currentConcept:queue[0]??null };
}
export function resolveRoderick(state,{revengeCorrect=false}={}){
  const next=clone(state); next.revengeAttempts+=1;
  if(revengeCorrect) next.shields=Math.max(0,next.shields-2); else next.shields=Math.max(0,next.shields-1);
  if(next.revengeQueue.length){next.currentConcept=next.revengeQueue[next.revengeAttempts%next.revengeQueue.length];}
  return next;
}

export function telegraphBoss(state){
  if(state.bossId==='brax') return {label:'Wanderndes Pulverfass', detail:`Ein ?-Marker liegt auf Taktikfeld ${state.markerIndex+1}. Genau ein Marker bleibt aktiv.`};
  if(state.bossId==='blackfinn') return {label:'Nebel der falschen Spur', detail:state.fogged?'Eine taktische Spur ist verdeckt – niemals die richtige Sprachantwort.':'Die Spur ist für diesen Zug aufgeklärt.'};
  if(state.bossId==='roderick') return {label:'Revanchefluch', detail:state.currentConcept?`Roderick greift einen echten Fehler-Concept erneut auf: ${state.currentConcept}.`:'Noch keine Fehlerhistorie – Roderick darf nichts erfinden.'};
  throw new Error(`Unknown Branch 9 boss ${state.bossId}`);
}
