const clone = (value) => structuredClone(value);

export function createVargasState() {
  return { bossId:'vargas', commandPearls:3, stolenPearls:0, cooldown:0, resolved:0 };
}
export function resolveVargas(state,{treasureCorrect=false}={}){
  const next=clone(state); next.resolved+=1;
  if(treasureCorrect && next.stolenPearls>0){next.commandPearls+=next.stolenPearls;next.stolenPearls=0;next.cooldown=1;return next;}
  if(next.cooldown>0){next.cooldown-=1;return next;}
  if(next.commandPearls>0){next.commandPearls-=1;next.stolenPearls+=1;next.cooldown=1;}
  return next;
}

export function createIronhookState(seed=6){
  const targets=['card-slot','helper-slot','sea-route'];
  return { bossId:'ironhook', seed, blockedTarget:targets[Math.abs(seed)%targets.length], chainActive:true, resolved:0 };
}
export function resolveIronhook(state,{chainBreakCorrect=false}={}){
  const next=clone(state); next.resolved+=1;
  if(chainBreakCorrect){next.chainActive=false;next.blockedTarget=null;return next;}
  const targets=['card-slot','helper-slot','sea-route']; next.chainActive=true;next.blockedTarget=targets[Math.abs(next.seed+next.resolved)%targets.length];return next;
}

export function createThorneState(){return {bossId:'thorne',targets:['travel:dock','travel:learning'],shieldedTarget:null,resolved:0};}
export function resolveThorne(state,{directionCorrect=false}={}){
  const next=clone(state);next.resolved+=1;
  if(directionCorrect)next.shieldedTarget=next.targets[next.resolved%2];
  else next.shieldedTarget=null;
  return next;
}

const GRID_IDS=['a','b','c','d','e','f','g','h','i'];
function adjacency(grid){
  const map={};
  for(let i=0;i<9;i+=1){const id=grid[i];const r=Math.floor(i/3),c=i%3;const n=[];if(r>0)n.push(grid[i-3]);if(r<2)n.push(grid[i+3]);if(c>0)n.push(grid[i-1]);if(c<2)n.push(grid[i+1]);map[id]=n.sort();}
  return map;
}
function shiftRow(grid,row,delta){const next=[...grid],base=row*3,items=grid.slice(base,base+3);for(let c=0;c<3;c+=1)next[base+((c+delta+3)%3)]=items[c];return next;}
function shiftCol(grid,col,delta){const next=[...grid],items=[grid[col],grid[col+3],grid[col+6]];for(let r=0;r<3;r+=1)next[((r+delta+3)%3)*3+col]=items[r];return next;}
export function createCorvinState(seed=8){const grid=[...GRID_IDS];return {bossId:'corvin',seed,grid,adjacency:adjacency(grid),move:{axis:'row',index:Math.abs(seed)%3,direction:1},fixed:null,resolved:0};}
export function resolveCorvin(state,{counterCorrect=false}={}){
  const next=clone(state);next.resolved+=1;
  if(counterCorrect){next.fixed={axis:next.move.axis,index:next.move.index};next.move={...next.move,direction:-next.move.direction};return next;}
  const axis=(next.seed+next.resolved)%2===0?'row':'col';const index=Math.abs(next.seed+next.resolved)%3;const direction=(next.resolved%2===0)?1:-1;
  if(next.fixed && next.fixed.axis===axis && next.fixed.index===index){next.move={axis,index,direction};return next;}
  next.grid=axis==='row'?shiftRow(next.grid,index,direction):shiftCol(next.grid,index,direction);next.adjacency=adjacency(next.grid);next.move={axis,index,direction};return next;
}

export function telegraphRegion10Boss(state){
  if(state.bossId==='vargas')return {label:'Tribut der Tiefe',detail:`Vargas hält ${state.stolenPearls} temporäre Befehlsperle(n) zurück. ${state.commandPearls} bleiben verfügbar.`};
  if(state.bossId==='ironhook')return {label:'Kettenblockade',detail:state.chainActive?`Eine sichtbare Kette sperrt genau ein taktisches Ziel: ${state.blockedTarget}. Der Antwortweg bleibt frei.`:'Die Kette ist gebrochen.'};
  if(state.bossId==='thorne')return {label:'Doppelziel',detail:`Telegraphiert: ${state.targets.join(' + ')}. ${state.shieldedTarget?`Schutzschild auf ${state.shieldedTarget}.`:'Noch kein Ziel geschützt.'}`};
  if(state.bossId==='corvin')return {label:'Kartendrehung',detail:`Corvin verschiebt ${state.move.axis==='row'?'Reihe':'Spalte'} ${state.move.index+1}. Adjazenz wird nach jeder Verschiebung neu berechnet.`};
  throw new Error(`Unknown Branch 10 boss ${state.bossId}`);
}
