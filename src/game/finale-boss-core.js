const clone=(value)=>structuredClone(value);

export function createAzrakState(seed=909){
  const fields=['harbor:dock','harbor:learning','harbor:village','harbor:arena'];
  const index=Math.abs(seed)%fields.length;
  return {bossId:'azrak',seed,fields,shadowField:fields[index],revealed:false,resolved:0};
}
export function resolveAzrak(state,{mixedCorrect=false}={}){
  const next=clone(state);next.resolved+=1;
  if(mixedCorrect){next.revealed=true;return next;}
  next.revealed=false;
  const current=next.fields.indexOf(next.shadowField);
  next.shadowField=next.fields[(current+1+(Math.abs(next.seed+next.resolved)%Math.max(1,next.fields.length-1)))%next.fields.length];
  return next;
}
export function telegraphAzrak(state){
  return {label:'Wandernder Schatten',detail:state.revealed?`Der einzige Schatten ist enthüllt: ${state.shadowField}.`:'Genau ein Schatten wandert nach der nächsten Auslösung. Sprachtext und Primäraktion bleiben frei.'};
}

const GRID=['a','b','c','d','e','f','g','h','i'];
function adjacency(grid){const map={};for(let i=0;i<9;i+=1){const id=grid[i],r=Math.floor(i/3),c=i%3,n=[];if(r>0)n.push(grid[i-3]);if(r<2)n.push(grid[i+3]);if(c>0)n.push(grid[i-1]);if(c<2)n.push(grid[i+1]);map[id]=n.sort();}return map;}
function shiftRow(grid,row,delta){const next=[...grid],base=row*3,items=grid.slice(base,base+3);for(let c=0;c<3;c+=1)next[base+((c+delta+3)%3)]=items[c];return next;}

export function createVarkosState(seed=1010){
  return {
    bossId:'varkos',seed,phase:1,resolved:0,complete:false,
    swap:{from:0,to:1},
    chain:{active:false,target:null},marker:null,
    grid:[...GRID],adjacency:adjacency(GRID),formation:{row:0,direction:1},
    hazards:[],phaseIntroSeen:false,
  };
}
function hazardsFor(next){
  const hazards=[];
  if(next.chain.active)hazards.push(`chain:${next.chain.target}`);
  if(next.marker)hazards.push(`marker:${next.marker}`);
  return hazards.slice(0,2);
}
export function resolveVarkosPhase(state,{correct=false,crownCorrect=false}={}){
  const next=clone(state);next.resolved+=1;
  if(next.phase===1){
    next.swap={from:(next.seed+next.resolved)%3,to:(next.seed+next.resolved+1)%3};
    if(correct){next.phase=2;next.phaseIntroSeen=false;}
  } else if(next.phase===2){
    next.chain={active:true,target:['card-slot','helper-slot','sea-route'][(next.seed+next.resolved)%3]};
    next.marker=['left-flank','center-route','right-flank'][(next.seed+next.resolved+1)%3];
    next.hazards=hazardsFor(next);
    if(correct){next.phase=3;next.phaseIntroSeen=false;}
  } else if(next.phase===3){
    const row=(next.seed+next.resolved)%3,direction=next.resolved%2===0?1:-1;
    next.grid=shiftRow(next.grid,row,direction);next.adjacency=adjacency(next.grid);next.formation={row,direction};
    next.chain={active:false,target:null};next.marker=null;next.hazards=[];
    if(correct){next.phase=4;next.phaseIntroSeen=false;}
  } else if(next.phase===4){
    if(crownCorrect){next.complete=true;next.hazards=[];}
  }
  if(next.hazards.length>2)throw new Error('Varkos may never expose more than two hazards');
  return next;
}
export function telegraphVarkos(state){
  if(state.phase===1)return {label:'Phase 1 · Tausch',detail:`Varkos tauscht sichtbar Auftrag ${state.swap.from+1} und ${state.swap.to+1}. Die aktuelle Antwort bleibt unverändert.`};
  if(state.phase===2)return {label:'Phase 2 · Kette und Marker',detail:`Maximal zwei Gefahren: ${state.hazards.length?state.hazards.join(' + '):'werden vor der Wirkung sichtbar angekündigt'}.`};
  if(state.phase===3)return {label:'Phase 3 · Formation',detail:`Reihe ${state.formation.row+1} verschiebt sich sichtbar; Adjazenz wird danach neu berechnet.`};
  return {label:'Phase 4 · Crown Sentence',detail:'Die finale mehrteilige Crown Sentence entscheidet. Keine Zeitknappheit und keine veränderte Sprachwahrheit.'};
}
