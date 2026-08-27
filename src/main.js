import './styles.css';
import { createEncounter, evaluateChallenge, resolveBossEncounter, resolveStandardEncounter } from './game/learning-core.js';
import { anchorKaiTask, createKaiState, resolveKaiTask, visibleKaiQueue } from './game/kai-core.js';
import { GARDEN_BOSS_CHALLENGES, GARDEN_STANDARD_CHALLENGES } from './content/garden-content.js';
import { createSaveEnvelope, restoreSaveEnvelope } from './game/save-contract.js';
import { createRuntimeAdapter } from './adapters/game-runtime-adapter.js';
import { createStableEventId } from './adapters/tulas-island-host.js';
import { createCardHand, deriveCardBonuses, resolveSelectedCard, selectCard } from './game/card-core.js';
import { HELPER_DEFINITIONS, applyHelperEvent, createHelperState, selectHelper } from './game/helper-core.js';
import { GARDEN_CARDS } from './content/garden-cards.js';
import { createCampaignState, endPlayerRound, resolveEnemyRound } from './game/campaign-core.js';
import { describeEnemyIntent } from './game/ai-director.js';
import { getRegion24 } from './content/regions-2-4.js';
import { answerRegion24, createRegion24Session, currentRegion24Challenge, finishRegion24Boss, finishRegion24Standard, region24BossTelegraph, startRegion24Boss } from './game/region24-session.js';
import { getRegion910 } from './content/regions-9-10.js';
import { answerFinale, createFinaleSession, currentFinaleChallenge, finishFinaleBoss, finishFinaleStandard, finaleBossTelegraph, startFinaleBoss } from './game/finale-session.js';

const root = document.querySelector('#app');
if (!root) throw new Error('Crown of Words mount point #app is missing.');

const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`;
const byId = (id) => document.getElementById(id);
const challengeById = (list, id) => list.find((item) => item.id === id);
const runtime = createRuntimeAdapter();

let state;
let draggedTokenIndex = null;

function freshState() {
  const campaignAi = endPlayerRound(createCampaignState(808), { enemyIds: ['niko'] });
  return {
    screen: 'campaign',
    standard: createEncounter(GARDEN_STANDARD_CHALLENGES),
    standardIndex: 0,
    boss: null,
    kai: null,
    bossHp: 5,
    feedback: null,
    hintLevel: 0,
    builtTokens: [],
    anchorReady: false,
    anchorMessage: '',
    swapNotice: null,
    paused: false,
    helpOpen: false,
    cardHand: createCardHand(GARDEN_CARDS),
    helper: createHelperState('helper-meli-food'),
    helperPressureReduction: 0,
    cardNotice: '',
    helperNotice: '',
    campaignAi,
    enemyIntent: campaignAi.enemyIntents[0] ?? null,
    enemyTurnResolved: false,
    enemyOutcomeNotice: '',
    region24Session: null,
    region24Feedback: null,
    region24BuiltTokens: [],
    finaleSession: null,
    finaleFeedback: null,
    finaleBuiltTokens: [],
    campaignComplete: false,
  };
}

function resetStandard() {
  state.standard = createEncounter(GARDEN_STANDARD_CHALLENGES);
  state.standardIndex = 0;
  state.feedback = null;
  state.hintLevel = 0;
  state.builtTokens = [];
  state.cardHand = createCardHand(GARDEN_CARDS);
  state.helper = createHelperState(state.helper?.helperId ?? 'helper-meli-food');
  state.helperPressureReduction = 0;
  state.cardNotice = '';
  state.helperNotice = '';
  const helperStart = applyHelperEvent(state.helper, 'encounter-start', { regionId: 'garden' });
  state.helper = helperStart.state;
  if (helperStart.effect) state.helperNotice = helperStart.effect.label;
  state.campaignAi = endPlayerRound(createCampaignState(808), { enemyIds: ['niko'] });
  state.enemyIntent = state.campaignAi.enemyIntents[0] ?? null;
  state.enemyTurnResolved = false;
  state.enemyOutcomeNotice = '';
  state.screen = 'challenge';
  render();
}

function resetBoss() {
  state.boss = createEncounter(GARDEN_BOSS_CHALLENGES);
  state.kai = createKaiState(
    GARDEN_BOSS_CHALLENGES.map((item) => item.id),
    1201,
    { fixedIds: ['kai-crown'] },
  );
  state.bossHp = 5;
  state.feedback = null;
  state.hintLevel = 0;
  state.builtTokens = [];
  state.anchorReady = false;
  state.anchorMessage = '';
  state.swapNotice = null;
  state.cardHand = createCardHand(GARDEN_CARDS);
  state.helper = createHelperState(state.helper?.helperId ?? 'helper-meli-food');
  state.helperPressureReduction = 0;
  state.cardNotice = '';
  state.helperNotice = '';
  const helperStart = applyHelperEvent(state.helper, 'encounter-start', { regionId: 'garden' });
  state.helper = helperStart.state;
  if (helperStart.effect) state.helperNotice = helperStart.effect.label;
  state.screen = 'boss';
  render();
}

const restoredState = restoreSaveEnvelope(runtime.loadSave());
state = restoredState ?? freshState();
state.paused = Boolean(state.paused);
state.helpOpen = Boolean(state.helpOpen);
state.cardHand = state.cardHand ?? createCardHand(GARDEN_CARDS);
state.helper = state.helper ?? createHelperState('helper-meli-food');
state.helperPressureReduction = Number(state.helperPressureReduction ?? 0);
state.cardNotice = state.cardNotice ?? '';
state.helperNotice = state.helperNotice ?? '';
if (!state.campaignAi) state.campaignAi = endPlayerRound(createCampaignState(808), { enemyIds: ['niko'] });
state.enemyIntent = state.enemyIntent ?? state.campaignAi.enemyIntents?.[0] ?? null;
state.enemyTurnResolved = Boolean(state.enemyTurnResolved);
state.enemyOutcomeNotice = state.enemyOutcomeNotice ?? '';
state.region24Session = state.region24Session ?? null;
state.region24Feedback = state.region24Feedback ?? null;
state.region24BuiltTokens = state.region24BuiltTokens ?? [];
state.finaleSession = state.finaleSession ?? null;
state.finaleFeedback = state.finaleFeedback ?? null;
state.finaleBuiltTokens = state.finaleBuiltTokens ?? [];
state.campaignComplete = Boolean(state.campaignComplete);

function shell(content, { world = false } = {}) {
  const overlay = state.paused
    ? `<section class="game-overlay" data-testid="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title"><div class="game-overlay__card glass-card"><span class="eyebrow">Spiel angehalten</span><h2 id="pause-title">Pause</h2><p>Dein aktueller Auftrag bleibt exakt erhalten.</p><button class="primary-button" data-action="resume" data-testid="resume-game">Weiterspielen</button></div></section>`
    : state.helpOpen
      ? `<section class="game-overlay" data-testid="help-overlay" role="dialog" aria-modal="true" aria-labelledby="help-title"><div class="game-overlay__card glass-card"><span class="eyebrow">Tulas Hilfe</span><h2 id="help-title">So gewinnst du</h2><p>Löse Wörter und Sätze. Hinweise helfen, geben aber weniger Wortkraft. Bei Kai bleibt die richtige Antwort immer unverändert.</p><button class="primary-button" data-action="close-help" data-testid="close-help">Verstanden</button></div></section>`
      : '';
  return `
    <main class="game-shell ${world ? 'game-shell--world' : ''}">
      <header class="topbar">
        <div>
          <span class="eyebrow">Tula's Island</span>
          <strong>Crown of Words</strong>
        </div>
        <div class="topbar__tools"><button class="topbar__tool" data-action="help" aria-label="Hilfe öffnen">Hilfe</button><button class="topbar__tool" data-action="pause" aria-label="Spiel pausieren">Pause</button><div class="topbar__seal" aria-label="Kronensiegel ${state.campaignComplete ? '10' : '0'} von 10">${state.campaignComplete ? '10 / 10' : '0 / 10'}</div></div>
      </header>
      ${content}
      ${overlay}
    </main>
  `;
}

function renderCampaign() {
  root.innerHTML = shell(`
    <section class="campaign" data-testid="campaign-screen">
      <div class="campaign__map-card">
        <img src="${asset('map/map-turtle-island-overview.webp')}" alt="Karte von Tula's Island" class="campaign__map" />
        <button class="region-pin region-pin--garden" data-action="open-garden" aria-label="Region Garten öffnen">
          <span class="region-pin__pulse"></span>
          <span>1</span>
        </button>
      </div>
      <section class="campaign__panel glass-card">
        <div class="campaign__copy">
          <span class="eyebrow">Region 1 · verfügbar</span>
          <h1>Der Garten</h1>
          <p>Pirat Kai hat das erste Kronensiegel versteckt. Befreie den Garten mit echten Sprachaufgaben.</p>
        </div>
        <div class="campaign__guide">
          <img src="${asset('tula/tula-happy.webp')}" alt="Tula" />
          <p>„Wörter geben unserer Flotte Kraft. Ohne Sprache gewinnen wir kein Gebiet!“</p>
        </div>
        <button class="primary-button" data-action="open-garden">Garten erkunden</button>
        <div class="region24-launches" data-testid="region24-launches">
          <button data-region24="library"><b>2 · Bibliothek</b><span>Brax · Satzgrundlagen</span></button>
          <button data-region24="wildlife"><b>3 · Tierwelt</b><span>Blackfinn · Tiere & Vergleiche</span></button>
          <button data-region24="home"><b>4 · Zuhause</b><span>Roderick · Präpositionen</span></button>
          <button data-region24="family"><b>5 · Familie</b><span>Vargas · Pronomen & Besitz</span></button>
          <button data-region24="body"><b>6 · Körper</b><span>Ironhook · Zustände & Modalverben</span></button>
          <button data-region24="travel"><b>7 · Unterwegs</b><span>Thorne · Reise & Richtungen</span></button>
          <button data-region24="movement"><b>8 · Bewegung</b><span>Corvin · Verben & Imperative</span></button>
          <button data-finale-region="harbor"><b>9 · Hafen-Turnier</b><span>Azrak · gemischte Dialoge</span></button>
          <button data-finale-region="crown-castle"><b>10 · Kronenschloss</b><span>Varkos · Krone des Chaos</span></button>
        </div>
      </section>
    </section>
  `);
}

function helperPickerHTML() {
  return `<section class="loadout-block" aria-labelledby="helper-title">
    <div class="loadout-block__head"><span class="eyebrow">Kommandant</span><strong id="helper-title">Wähle deinen Helfer</strong></div>
    <div class="helper-picker" data-testid="helper-picker">
      ${HELPER_DEFINITIONS.map((helper) => {
        const selected = state.helper?.helperId === helper.id;
        return `<button class="helper-option ${selected ? 'helper-option--selected' : ''}" data-helper-id="${helper.id}" aria-pressed="${selected}">
          <img src="${asset(helper.asset)}" alt="${helper.name}" />
          <span><strong>${helper.name}</strong><small>${helper.focus}</small></span>
        </button>`;
      }).join('')}
    </div>
  </section>`;
}

function cardHandHTML({ compact = false } = {}) {
  return `<section class="card-hand ${compact ? 'card-hand--compact' : ''}" data-testid="card-hand" aria-label="Vier Taktikkarten">
    ${state.cardHand.cards.map((entry) => {
      const card = entry.definition;
      const selected = state.cardHand.selectedId === card.id;
      const disabled = entry.status !== 'ready';
      const statusLabel = entry.status === 'played' ? 'gespielt' : entry.status === 'exhausted' ? 'erschöpft' : selected ? 'gewählt' : 'bereit';
      return `<button class="tactic-card tactic-card--${entry.status} ${selected ? 'tactic-card--selected' : ''}" data-card-id="${card.id}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}>
        <span class="tactic-card__cost">${card.cost}</span>
        <strong>${card.name}</strong>
        <small>${compact ? statusLabel : card.description}</small>
        <span class="tactic-card__status">${statusLabel}</span>
      </button>`;
    }).join('')}
  </section>`;
}

function districtTitle(districtId) {
  const labels = { 'garden:dock': 'Anlegestelle', 'garden:learning': 'Gartenhaus', 'garden:village': 'Dorf', 'garden:arena': 'Turnier', 'garden:boss': 'Kais Festung' };
  return labels[districtId] ?? districtId;
}

function enemyIntentHTML({ compact = false } = {}) {
  const intent = state.enemyIntent;
  if (!intent) return '';
  const info = describeEnemyIntent(intent);
  const target = state.campaignAi?.districts?.[intent.targetId] ?? {};
  const resolved = state.enemyTurnResolved;
  return `<section class="enemy-intent ${compact ? 'enemy-intent--compact' : ''} ${resolved ? 'enemy-intent--resolved' : ''}" data-testid="enemy-intent" aria-label="Gegnerabsicht ${info.enemyName}">
    <div class="enemy-intent__avatar" aria-hidden="true">${info.enemyName.slice(0, 1)}</div>
    <div class="enemy-intent__copy"><span class="eyebrow">${resolved ? 'Ausgeführt' : 'Sichtbarer Intent'}</span><strong>${info.enemyName} · ${info.role}</strong><p>${info.actionLabel}: <b>${districtTitle(info.targetId)}</b>${info.secondaryTargetId ? ` / ${districtTitle(info.secondaryTargetId)}` : ''}</p></div>
    <div class="enemy-intent__stats"><span>Versorgung <b>${Number(target.supply ?? 0)}/5</b></span><span>Verteidigung <b>${Number(target.fortification ?? 0)}/3</b></span></div>
  </section>`;
}

function region24AnswerArea(challenge){
 if(challenge.type==='sentence') return `<div class="sentence-builder"><div class="sentence-builder__zone">${state.region24BuiltTokens.length?state.region24BuiltTokens.map((t,i)=>`<button data-region24-remove="${i}">${t}</button>`).join(''):'Tippe die Wörter in Reihenfolge an.'}</div><div class="token-bank">${challenge.tokens.map((t,i)=>`<button class="token" data-region24-token="${i}" ${state.region24BuiltTokens.includes(t)?'disabled':''}>${t}</button>`).join('')}</div><button class="primary-button" data-action="region24-submit-sentence" ${state.region24BuiltTokens.length!==challenge.tokens.length?'disabled':''}>Satz prüfen</button></div>`;
 return `<div class="answer-grid">${challenge.answers.map(a=>`<button class="answer-button" data-region24-answer="${a.replaceAll('"','&quot;')}">${a}</button>`).join('')}</div>`;
}
function region10MechanicHTML(session){
  const m=session?.bossMechanic;if(!m||!['family','body','travel','movement'].includes(session.regionId))return '';
  if(session.regionId==='family')return '<div class="regional-mechanic regional-mechanic--pearls"><b>● '+m.commandPearls+'</b><span>verfügbar</span><b>◌ '+m.stolenPearls+'</b><span>von Vargas gehalten</span></div>';
  if(session.regionId==='body')return '<div class="regional-mechanic"><b>⛓ Kettenblockade</b><span>'+(m.chainActive?'Gesperrt: '+m.blockedTarget:'Kette gebrochen – taktische Slots frei.')+'</span></div>';
  if(session.regionId==='travel')return '<div class="regional-mechanic"><b>Doppelziel</b><div class="thorne-targets">'+m.targets.map(t=>'<span class="'+(m.shieldedTarget===t?'is-shielded':'')+'">'+(m.shieldedTarget===t?'🛡 ':'')+t.split(':')[1]+'</span>').join('')+'</div></div>';
  return '<div class="regional-mechanic"><b>Corvins 3×3-Taktikkarte</b><div class="corvin-grid">'+m.grid.map(id=>'<span>'+id.toUpperCase()+'</span>').join('')+'</div><small>'+(m.move.axis==='row'?'Reihe':'Spalte')+' '+(m.move.index+1)+' wird sichtbar verschoben; Adjazenz folgt der neuen Position.</small></div>';
}

function renderRegion24(){const s=state.region24Session,r=getRegion24(s.regionId);root.innerHTML=shell(`<section class="region-view" data-testid="region24-screen"><div class="world-hero" style="--world-image:url('${asset(r.worldAsset)}')"><div class="world-hero__shade"></div><div class="world-hero__title"><span class="eyebrow">Region ${r.order}</span><h1>${r.name}</h1><p>Deutsch → Englisch · ${r.focus}</p></div><div class="district-track">${r.districts.map((d,i)=>`<div class="district ${i===0?'district--active':''} ${i===4?'district--boss':''}"><b>${i+1}</b><span>${d}</span></div>`).join('')}</div></div><section class="mission-card glass-card"><span class="eyebrow">Strategiebonus · ${r.strategicBonus}</span><h2>${r.name} zurückholen</h2><p>Fünf Sprachaufgaben führen zum regionalen Boss. Lernleistung bleibt die Hauptbedingung.</p><div class="regional-enemy"><strong>Wache: ${r.enemyId.toUpperCase()}</strong><span>sichtbarer regionaler Gegner · keine Offline-Züge</span></div><button class="primary-button" data-action="region24-start">Mission starten</button><button class="text-button" data-action="campaign">Zur Inselkarte</button></section></section>`,{world:true})}
function renderRegion24Challenge(){const s=state.region24Session,r=getRegion24(s.regionId),c=currentRegion24Challenge(s);if(state.region24Feedback){root.innerHTML=shell(`<section class="challenge-stage challenge-stage--feedback"><section class="feedback ${state.region24Feedback.correct?'feedback--correct':'feedback--wrong'}"><strong>${state.region24Feedback.correct?'Richtig!':'Noch nicht.'}</strong><p>${state.region24Feedback.correct?'+3 Wortkraft':`Richtig wäre: ${state.region24Feedback.expected}`}</p><button class="primary-button" data-action="region24-next">Weiter</button></section></section>`,{world:true});return;}if(!c){const res=finishRegion24Standard(s);state.region24Session=res.state;root.innerHTML=shell(`<section class="result-screen ${res.won?'result-screen--win':''}" data-testid="region24-standard-result"><span class="eyebrow">${r.name}</span><h1>${res.won?'Vorbezirke gewonnen!':'Übungsreise empfohlen'}</h1><p>${res.score} Wortkraft · mindestens drei gelöste Aufgaben und die Crown Sentence sind Pflicht.</p><button class="primary-button" data-action="${res.won?'region24-boss-intro':'region24-retry'}">${res.won?'Zu '+r.bossName:'Nochmal versuchen'}</button></section>`);return;}root.innerHTML=shell(`<section class="challenge-stage" data-testid="region24-challenge"><div class="challenge-progress"><div class="challenge-progress__meta"><span>Aufgabe ${s.index+1}/${r.standard.length}</span><strong>Wortkraft ${s.wordPower}</strong></div></div><div class="challenge-card glass-card ${c.type==='sentence'?'challenge-card--crown':''}"><span class="eyebrow">${c.type==='sentence'?'Crown Sentence':r.name+' · Übersetzung'}</span><h2>${c.prompt}</h2>${region24AnswerArea(c)}</div></section>`,{world:true})}
function renderRegion24BossIntro(){const s=state.region24Session,r=getRegion24(s.regionId),t=region24BossTelegraph(s);root.innerHTML=shell(`<section class="boss-intro" data-testid="region24-boss-intro"><div class="boss-intro__art"><div class="boss-aura"></div><img src="${asset(r.bossAsset)}" alt="${r.bossName}" /></div><div class="boss-intro__card glass-card"><span class="eyebrow">Level ${r.order} · ${r.name}</span><h1>${r.bossName}</h1><h2>${t.label}</h2><p>${t.detail}</p>${region10MechanicHTML(s)}<button class="primary-button" data-action="region24-boss-start">Verstanden · Duell starten</button></div></section>`,{world:true})}
function renderRegion24Boss(){const s=state.region24Session,r=getRegion24(s.regionId),c=currentRegion24Challenge(s),t=region24BossTelegraph(s);if(state.region24Feedback){root.innerHTML=shell(`<section class="boss-stage boss-stage--feedback"><div class="boss-mini"><img src="${asset(r.bossAsset)}" alt="${r.bossName}"/><div><strong>${r.bossName}</strong><span>HP ${s.bossHp}/3</span></div></div><p class="regional-telegraph"><b>${t.label}</b> · ${t.detail}</p><section class="feedback ${state.region24Feedback.correct?'feedback--correct':'feedback--wrong'}"><strong>${state.region24Feedback.correct?'Richtig!':'Noch nicht.'}</strong><p>${state.region24Feedback.correct?'+3 Wortkraft':`Richtig wäre: ${state.region24Feedback.expected}`}</p><button class="primary-button" data-action="region24-boss-next">Weiter</button></section></section>`,{world:true});return;}if(!c){const res=finishRegion24Boss(s);root.innerHTML=shell(`<section class="result-screen ${res.won?'result-screen--win':''}" data-testid="region24-boss-result"><img class="result-screen__tula" src="${asset('tula/tula-happy.webp')}" alt="Tula"/><span class="eyebrow">Kronensiegel ${r.order} von 10</span><h1>${res.won?r.name+' befreit!':'Revanche!'}</h1><p>${res.won?r.bossName+' wurde mit Sprache besiegt.':'Lernfortschritt bleibt erhalten. Die finale Bossaufgabe muss korrekt sein.'}</p><button class="primary-button" data-action="campaign">Zur Kampagnenkarte</button></section>`);return;}root.innerHTML=shell(`<section class="boss-stage" data-testid="region24-boss"><div class="boss-status"><div class="boss-mini"><img src="${asset(r.bossAsset)}" alt="${r.bossName}"/><div><strong>Lv. ${r.order} · ${r.bossName}</strong><span>${t.label}</span></div></div><div class="boss-hp"><span style="width:${s.bossHp*33.33}%"></span></div></div><p class="regional-telegraph"><b>Sichtbar angekündigt:</b> ${t.detail}</p>${region10MechanicHTML(s)}<div class="challenge-card glass-card"><h2>${c.prompt}</h2>${region24AnswerArea(c)}</div></section>`,{world:true})}

function finaleAnswerArea(challenge){
  if(challenge.type==='sentence'){
    const used=new Set(state.finaleBuiltTokens.map(x=>x.index));
    return `<div class="sentence-builder finale-sentence" data-testid="finale-sentence"><div class="sentence-builder__zone">${state.finaleBuiltTokens.length?state.finaleBuiltTokens.map((x,i)=>`<button data-finale-remove="${i}">${x.token}</button>`).join(''):'Tippe die Wörter in Reihenfolge an.'}</div><div class="token-bank">${challenge.tokens.map((t,i)=>`<button class="token" data-finale-token="${i}" ${used.has(i)?'disabled':''}>${t}</button>`).join('')}</div><button class="primary-button" data-action="finale-submit-sentence" ${state.finaleBuiltTokens.length!==challenge.tokens.length?'disabled':''}>Satz prüfen</button></div>`;
  }
  return `<div class="answer-grid">${challenge.answers.map(a=>`<button class="answer-button" data-finale-answer="${a.replaceAll('"','&quot;')}">${a}</button>`).join('')}</div>`;
}
function finaleMechanicHTML(session){
  const m=session.bossMechanic;
  if(session.regionId==='harbor') return `<div class="finale-mechanic azrak-shadow" data-testid="azrak-shadow"><b>Wandernder Schatten</b><div class="shadow-fields">${m.fields.map(id=>`<span class="${id===m.shadowField?'is-shadow':''} ${m.revealed&&id===m.shadowField?'is-revealed':''}">${id.split(':')[1]}</span>`).join('')}</div><small>Genau ein Schatten. Sprachtext und Hauptaktion bleiben immer frei.</small></div>`;
  const t=finaleBossTelegraph(session);
  return `<div class="finale-mechanic varkos-mechanic" data-testid="varkos-mechanic"><div class="varkos-phases">${[1,2,3,4].map(p=>`<span class="${m.phase===p?'is-active':''} ${m.phase>p?'is-done':''}">${p}</span>`).join('')}</div><b>${t.label}</b><p>${t.detail}</p>${m.phase===2?`<div class="hazard-row">${m.hazards.map(h=>`<span>⚠ ${h}</span>`).join('')}</div>`:''}${m.phase===3?`<div class="corvin-grid finale-grid">${m.grid.map(id=>`<span>${id.toUpperCase()}</span>`).join('')}</div>`:''}</div>`;
}
function renderFinaleRegion(){const s=state.finaleSession,r=getRegion910(s.regionId);root.innerHTML=shell(`<section class="region-view" data-testid="finale-region"><div class="world-hero" style="--world-image:url('${asset(r.worldAsset)}')"><div class="world-hero__shade"></div><div class="world-hero__title"><span class="eyebrow">Region ${r.order}</span><h1>${r.name}</h1><p>Deutsch → Englisch · ${r.focus}</p></div><div class="district-track">${r.districts.map((d,i)=>`<div class="district ${i===0?'district--active':''} ${i===4?'district--boss':''}"><b>${i+1}</b><span>${d}</span></div>`).join('')}</div></div><section class="mission-card glass-card"><span class="eyebrow">${r.order===10?'Finale der Kampagne':'Vorletzte Region'}</span><h2>${r.name} zurückholen</h2><p>Fünf Sprachaufgaben führen zu ${r.bossName}. Die Crown Sentence bleibt Pflicht.</p><button class="primary-button" data-action="finale-start">Mission starten</button><button class="text-button" data-action="campaign">Zur Inselkarte</button></section></section>`,{world:true});}
function renderFinaleChallenge(){const s=state.finaleSession,r=getRegion910(s.regionId),c=currentFinaleChallenge(s);if(state.finaleFeedback){root.innerHTML=shell(`<section class="challenge-stage challenge-stage--feedback"><section class="feedback ${state.finaleFeedback.correct?'feedback--correct':'feedback--wrong'}"><strong>${state.finaleFeedback.correct?'Richtig!':'Noch nicht.'}</strong><p>${state.finaleFeedback.correct?'+3 Wortkraft':`Richtig wäre: ${state.finaleFeedback.expected}`}</p><button class="primary-button" data-action="finale-next">Weiter</button></section></section>`,{world:true});return;}if(!c){const res=finishFinaleStandard(s);state.finaleSession=res.state;root.innerHTML=shell(`<section class="result-screen ${res.won?'result-screen--win':''}" data-testid="finale-standard-result"><span class="eyebrow">Region ${r.order}</span><h1>${res.won?r.name+' erreicht!':'Übungsreise empfohlen'}</h1><p>${res.score} Wortkraft · Crown Sentence und Mindestlernleistung entscheiden.</p><button class="primary-button" data-action="${res.won?'finale-boss-intro':'finale-retry'}">${res.won?'Zu '+r.bossName:'Nochmal versuchen'}</button></section>`);return;}root.innerHTML=shell(`<section class="challenge-stage" data-testid="finale-challenge"><div class="challenge-progress"><div class="challenge-progress__meta"><span>Aufgabe ${s.index+1}/${r.standard.length}</span><strong>Wortkraft ${s.wordPower}</strong></div></div><div class="challenge-card glass-card ${c.type==='sentence'?'challenge-card--crown':''}"><span class="eyebrow">${c.type==='sentence'?'Crown Sentence':r.name+' · Sprachauftrag'}</span><h2>${c.prompt}</h2>${finaleAnswerArea(c)}</div></section>`,{world:true});}
function renderFinaleBossIntro(){const s=state.finaleSession,r=getRegion910(s.regionId),t=finaleBossTelegraph(s);root.innerHTML=shell(`<section class="boss-intro" data-testid="finale-boss-intro"><div class="boss-intro__art"><div class="boss-aura"></div><img src="${asset(r.bossAsset)}" alt="${r.bossName}" data-testid="finale-boss-sprite"/></div><div class="boss-intro__card glass-card"><span class="eyebrow">Level ${r.order} · ${r.name}</span><h1>${r.bossName}</h1><h2>${t.label}</h2><p>${t.detail}</p>${finaleMechanicHTML(s)}<button class="primary-button" data-action="finale-boss-start">Verstanden · Duell starten</button></div></section>`,{world:true});}
function renderFinaleBoss(){const s=state.finaleSession,r=getRegion910(s.regionId),c=currentFinaleChallenge(s),t=finaleBossTelegraph(s);if(state.finaleFeedback){root.innerHTML=shell(`<section class="boss-stage boss-stage--feedback"><div class="boss-mini"><img src="${asset(r.bossAsset)}" alt="${r.bossName}"/><div><strong>${r.bossName}</strong><span>HP ${s.bossHp}/${r.order===10?4:3}</span></div></div>${finaleMechanicHTML(s)}<section class="feedback ${state.finaleFeedback.correct?'feedback--correct':'feedback--wrong'}"><strong>${state.finaleFeedback.correct?'Richtig!':'Noch nicht.'}</strong><p>${state.finaleFeedback.correct?'+3 Wortkraft':`Richtig wäre: ${state.finaleFeedback.expected}`}</p><button class="primary-button" data-action="finale-boss-next">Weiter</button></section></section>`,{world:true});return;}if(!c){const res=finishFinaleBoss(s);state.finaleSession=res.state;state.campaignComplete=Boolean(res.campaignComplete);runtime.saveSave(createSaveEnvelope(state));if(res.campaignComplete){void runtime.commitProgressEvent({ eventId:createStableEventId('campaign-clear','crown-of-words'), kind:'campaign', regionId:'crown-castle', xp:250, shells:100, stars:3, mastery:1 });root.innerHTML=shell(`<section class="campaign-victory result-screen result-screen--win" data-testid="campaign-victory"><div class="crown-emblem">♛</div><img class="result-screen__tula" src="${asset('tula/tula-happy.webp')}" alt="Tula feiert"/><span class="eyebrow">10 von 10 Kronensiegel</span><h1>Die Krone der Wörter ist zurück!</h1><p>Varkos ist besiegt. Du hast die Kampagne nicht durch Stärke allein gewonnen, sondern durch Wörter, Sätze und zehn Regionen voller Sprache.</p><div class="reward-row"><img src="${asset('rewards/reward-shell-gold.webp')}" alt="Goldene Muschel"/><span>Kampagne abgeschlossen</span><img src="${asset('rewards/reward-star-xp.webp')}" alt="XP"/><span>Krone der Wörter</span></div><button class="primary-button" data-action="campaign">Zur eroberten Inselkarte</button></section>`);return;}root.innerHTML=shell(`<section class="result-screen ${res.won?'result-screen--win':''}" data-testid="finale-boss-result"><img class="result-screen__tula" src="${asset('tula/tula-happy.webp')}" alt="Tula"/><span class="eyebrow">Kronensiegel ${r.order} von 10</span><h1>${res.won?r.name+' befreit!':'Revanche!'}</h1><p>${res.won?'Der Weg zum Kronenschloss ist frei.':'Die finale Bossaufgabe muss korrekt sein.'}</p><button class="primary-button" data-action="campaign">Zur Kampagnenkarte</button></section>`);return;}root.innerHTML=shell(`<section class="boss-stage" data-testid="finale-boss"><div class="boss-status"><div class="boss-mini"><img src="${asset(r.bossAsset)}" alt="${r.bossName}"/><div><strong>Lv. ${r.order} · ${r.bossName}</strong><span>${t.label}</span></div></div><div class="boss-hp"><span style="width:${Math.max(0,s.bossHp)/(r.order===10?4:3)*100}%"></span></div></div>${finaleMechanicHTML(s)}<div class="challenge-card glass-card ${c.type==='sentence'?'challenge-card--crown':''}"><span class="eyebrow">${s.regionId==='crown-castle'?t.label:'Azraks Herausforderung'}</span><h2>${c.prompt}</h2>${finaleAnswerArea(c)}</div></section>`,{world:true});}

function renderGarden() {
  root.innerHTML = shell(`
    <section class="region-view" data-testid="garden-screen">
      <div class="world-hero" style="--world-image: url('${asset('worlds/world-garden.webp')}')">
        <div class="world-hero__shade"></div>
        <div class="world-hero__title">
          <span class="eyebrow">Region 1</span>
          <h1>Garten</h1>
          <p>Deutsch → Englisch · Pflanzen, Farben und einfache Verben</p>
        </div>
        <div class="district-track" aria-label="Bezirke im Garten">
          <div class="district district--active"><b>1</b><span>Anlegestelle</span></div>
          <div class="district"><b>2</b><span>Gartenhaus</span></div>
          <div class="district"><b>3</b><span>Dorf</span></div>
          <div class="district"><b>4</b><span>Turnier</span></div>
          <div class="district district--boss"><b>5</b><span>Kai</span></div>
        </div>
      </div>
      <section class="mission-card glass-card">
        <div>
          <span class="eyebrow">Erster Auftrag</span>
          <h2>Die Anlegestelle zurückholen</h2>
          <p>Fünf Aufgaben. Die letzte ist eine Crown Sentence. Deine Lernleistung entscheidet über den Sieg.</p>
        </div>
        ${enemyIntentHTML()}
        ${helperPickerHTML()}
        <div class="loadout-block"><div class="loadout-block__head"><span class="eyebrow">Vier-Karten-Hand</span><strong>Sprache schaltet Taktik frei</strong></div>${cardHandHTML()}</div>
        <button class="primary-button" data-action="start-standard" data-testid="start-standard">Mit diesem Team starten</button>
        <button class="text-button" data-action="campaign">Zur Inselkarte</button>
      </section>
    </section>
  `, { world: true });
}

function progressHTML(encounter, currentNumber, total) {
  const width = Math.round(((currentNumber - 1) / total) * 100);
  return `
    <div class="challenge-progress" aria-label="Aufgabe ${currentNumber} von ${total}">
      <div class="challenge-progress__meta"><span>Aufgabe ${currentNumber}/${total}</span><strong>Wortkraft ${encounter.wordPower}</strong></div>
      <div class="challenge-progress__bar"><span style="width:${width}%"></span></div>
    </div>
  `;
}

function answerArea(challenge, bossMode = false) {
  if (challenge.type === 'sentence') {
    const built = state.builtTokens;
    return `
      <div class="sentence-builder" data-testid="sentence-builder">
        <div class="sentence-builder__zone" data-token-dropzone tabindex="0" aria-label="Gebauter Satz – Wörter können getippt oder hierher gezogen werden">
          ${built.length ? built.map((token, index) => `<button class="built-token" data-remove-token="${index}">${token}</button>`).join('') : '<span>Tippe die Wörter in der richtigen Reihenfolge an.</span>'}
        </div>
        <div class="token-bank">
          ${challenge.tokens.map((token, index) => `<button class="token" data-token-index="${index}" data-drag-token-index="${index}" draggable="true" ${built.includes(token) ? 'disabled' : ''}>${token}</button>`).join('')}
        </div>
        <button class="primary-button" data-action="submit-sentence" ${built.length !== challenge.tokens.length ? 'disabled' : ''}>Crown Sentence prüfen</button>
      </div>
    `;
  }

  return `
    <div class="answer-grid" role="group" aria-label="Antworten">
      ${challenge.options.map((option) => `<button class="answer-button" data-answer="${option}">${option}</button>`).join('')}
    </div>
    ${bossMode ? '<p class="microcopy">Kai kann nur die Reihenfolge kommender Aufträge verändern – niemals die richtige Antwort.</p>' : ''}
  `;
}

function renderFeedback(nextAction) {
  const item = state.feedback;
  const correctClass = item.correct ? 'feedback--correct' : 'feedback--wrong';
  return `
    <section class="feedback ${correctClass}" role="status" data-testid="feedback">
      <strong>${item.correct ? 'Richtig!' : 'Noch nicht.'}</strong>
      <p>${item.correct ? `+${item.power} Wortkraft` : `Richtig wäre: ${item.correctAnswer}`}</p>
      ${state.swapNotice ? `<div class="cheat-notice">Kai schummelt! ${state.swapNotice}</div>` : ''}
      ${state.cardNotice ? `<div class="tactic-notice">${state.cardNotice}</div>` : ''}
      ${state.helperNotice ? `<div class="helper-notice">${state.helperNotice}</div>` : ''}
      <button class="primary-button" data-action="${nextAction}">Weiter</button>
    </section>
  `;
}

function standardCurrent() {
  return GARDEN_STANDARD_CHALLENGES[state.standardIndex];
}

function renderStandardChallenge() {
  if (state.feedback) {
    root.innerHTML = shell(`<section class="challenge-stage challenge-stage--feedback">${renderFeedback('next-standard')}</section>`, { world: true });
    return;
  }
  const challenge = standardCurrent();
  root.innerHTML = shell(`
    <section class="challenge-stage" data-testid="standard-challenge">
      ${progressHTML(state.standard, state.standardIndex + 1, GARDEN_STANDARD_CHALLENGES.length)}
      ${cardHandHTML({ compact: true })}
      ${enemyIntentHTML({ compact: true })}
      ${state.enemyOutcomeNotice ? `<p class="enemy-outcome" role="status">${state.enemyOutcomeNotice}</p>` : ''}
      <div class="challenge-card glass-card ${challenge.crown ? 'challenge-card--crown' : ''}">
        <div class="challenge-card__guide"><img src="${asset('tula/tula-happy.webp')}" alt="Tula" /></div>
        <span class="eyebrow">${challenge.crown ? 'Crown Sentence' : 'Übersetze ins Englische'}</span>
        <h2>${challenge.prompt}</h2>
        ${answerArea(challenge)}
        <button class="hint-button" data-action="hint">${state.hintLevel ? 'Hinweis aktiv' : 'Leichter Hinweis'}</button>
        ${state.hintLevel ? `<p class="hint-copy">${challenge.crown ? 'Der englische Satz beginnt mit „The“.' : 'Gesucht ist ein englisches Gartenwort.'}</p>` : ''}
      </div>
    </section>
  `, { world: true });
}

function renderEnemyTurn() {
  const intent = state.enemyIntent;
  const info = intent ? describeEnemyIntent(intent) : null;
  root.innerHTML = shell(`
    <section class="enemy-turn-screen" data-testid="enemy-turn-screen">
      <span class="eyebrow">Gegnerzug · Runde ${state.campaignAi?.round ?? 1}</span>
      <h1>${info ? `${info.enemyName} ist dran` : 'Gegnerzug'}</h1>
      <p>Die Absicht wurde schon vor deinen Aufgaben gezeigt. Erst jetzt wird sie sichtbar aufgelöst.</p>
      ${enemyIntentHTML()}
      <div class="enemy-turn-rule glass-card"><strong>Fairness-Regel</strong><p>Maximal eine Hauptaktion pro Gegner. Keine zukünftigen Antworten, kein heimlicher Zug und keine Gebietsübernahme während du offline bist.</p></div>
      <button class="primary-button" data-action="resolve-enemy-turn" data-testid="resolve-enemy-turn">Nikos Zug ansehen</button>
    </section>
  `, { world: true });
}
function renderStandardResult() {
  const bonuses = deriveCardBonuses(state.cardHand);
  const campaignPressure = Math.min(2, Number(state.campaignAi?.supplyPressure?.garden ?? 0) + (state.campaignAi?.blockades?.some((entry) => entry.regionId === 'garden') ? 1 : 0));
  const enemyPressure = Math.max(0, 1 + campaignPressure - bonuses.pressureReduction - state.helperPressureReduction);
  const result = resolveStandardEncounter(state.standard, { tacticPower: bonuses.tacticPower, enemyPressure });
  root.innerHTML = shell(`
    <section class="result-screen ${result.won ? 'result-screen--win' : ''}" data-testid="standard-result">
      <img class="result-screen__tula" src="${asset('tula/tula-happy.webp')}" alt="Tula freut sich" />
      <span class="eyebrow">${result.won ? 'Gebiet gewonnen' : 'Übungsreise empfohlen'}</span>
      <h1>${result.won ? 'Anlegestelle befreit!' : 'Fast geschafft!'}</h1>
      <p>${result.won ? `Deine Sprache hat ${result.total} Kampfkraft erzeugt. Kais Festung ist jetzt sichtbar.` : 'Die Crown Sentence und mindestens drei fachlich gelöste Aufgaben sind Pflicht.'}</p>
      <div class="reward-row">
        <img src="${asset('rewards/reward-star-xp.webp')}" alt="XP-Stern" /><span>${state.standard.wordPower} Wortkraft</span>
        <img src="${asset('rewards/reward-shell-gold.webp')}" alt="Goldene Muschel" /><span>Erstbelohnung</span>
      </div>
      <button class="primary-button" data-action="${result.won ? 'boss-intro' : 'retry-standard'}">${result.won ? 'Zu Pirat Kai' : 'Nochmal versuchen'}</button>
    </section>
  `);
}

function renderBossIntro() {
  root.innerHTML = shell(`
    <section class="boss-intro" data-testid="boss-intro">
      <div class="boss-intro__art">
        <div class="boss-aura"></div>
        <img src="${asset('bosses/pirat-kai.png')}" alt="Pirat Kai" data-testid="kai-sprite" />
      </div>
      <div class="boss-intro__card glass-card">
        <span class="eyebrow">Level 1 · Garten</span>
        <h1>Pirat Kai</h1>
        <h2>Verwirbelter Befehl</h2>
        <p>Nach jeder ausgewerteten Aufgabe tauscht Kai <strong>sichtbar zwei noch ungelöste Aufträge</strong>. Deine aktuelle Aufgabe und die Crown Sentence bleiben unangetastet.</p>
        <div class="boss-rule"><span>Dein Konter</span><strong>Ankerblick</strong><p>Eine richtige Gartenübersetzung lässt dich einen kommenden Auftrag für einen Zug fixieren.</p></div>
        <button class="primary-button" data-action="start-boss" data-testid="start-boss">Verstanden · Duell starten</button>
      </div>
    </section>
  `, { world: true });
}

function bossCurrentId() {
  return state.kai.order.find((id) => !state.kai.resolved.includes(id));
}

function bossCurrent() {
  return challengeById(GARDEN_BOSS_CHALLENGES, bossCurrentId());
}

function bossQueueHTML() {
  const queue = visibleKaiQueue(state.kai, 4);
  return `
    <div class="kai-queue" data-testid="kai-queue" aria-label="Kais Auftragsreihenfolge">
      ${queue.map((id, index) => {
        const challenge = challengeById(GARDEN_BOSS_CHALLENGES, id);
        const protectedCard = state.kai.fixedIds.includes(id);
        const anchored = state.kai.anchoredId === id;
        return `<div class="kai-card ${index === 0 ? 'kai-card--current' : ''} ${anchored ? 'kai-card--anchored' : ''}" data-task-id="${id}">
          <small>${challenge.crown ? 'Krone' : `Auftrag ${state.kai.order.indexOf(id) + 1}`}</small>
          <strong>${challenge.crown ? 'Crown Sentence' : 'Gartenwort'}</strong>
          ${state.anchorReady && index > 0 && !protectedCard && !state.kai.anchoredId ? `<button data-anchor="${id}">Fixieren</button>` : ''}
          ${anchored ? '<span class="anchor-badge">Ankerblick</span>' : ''}
        </div>`;
      }).join('')}
    </div>
  `;
}

function renderBoss() {
  if (state.feedback) {
    root.innerHTML = shell(`
      <section class="boss-stage boss-stage--feedback">
        <div class="boss-mini"><img src="${asset('bosses/pirat-kai.png')}" alt="Pirat Kai" /><div><strong>Pirat Kai</strong><span>HP ${state.bossHp}/5</span></div></div>
        ${bossQueueHTML()}
        ${renderFeedback('next-boss')}
      </section>
    `, { world: true });
    return;
  }

  const challenge = bossCurrent();
  if (!challenge) {
    renderBossResult();
    return;
  }

  root.innerHTML = shell(`
    <section class="boss-stage" data-testid="boss-stage">
      <div class="boss-status">
        <div class="boss-mini"><img src="${asset('bosses/pirat-kai.png')}" alt="Pirat Kai" /><div><strong>Lv. 1 · Pirat Kai</strong><span>Verwirbelter Befehl</span></div></div>
        <div class="boss-hp"><span style="width:${Math.max(0, state.bossHp) * 20}%"></span></div>
      </div>
      ${bossQueueHTML()}
      ${cardHandHTML({ compact: true })}
      ${state.anchorMessage ? `<p class="anchor-message">${state.anchorMessage}</p>` : ''}
      <div class="challenge-card glass-card ${challenge.crown ? 'challenge-card--crown' : ''}">
        <span class="eyebrow">${challenge.crown ? 'Finale Crown Sentence' : 'Kai fordert dich heraus'}</span>
        <h2>${challenge.prompt}</h2>
        ${answerArea(challenge, true)}
        <button class="hint-button" data-action="hint">${state.hintLevel ? 'Hinweis aktiv' : 'Leichter Hinweis'}</button>
        ${state.hintLevel ? `<p class="hint-copy">${challenge.crown ? 'Beginne mit „The“.' : 'Gesucht ist die englische Bedeutung.'}</p>` : ''}
      </div>
    </section>
  `, { world: true });
}

function renderBossResult() {
  const bonuses = deriveCardBonuses(state.cardHand);
  const enemyPressure = Math.max(0, 1 - bonuses.pressureReduction - state.helperPressureReduction);
  const result = resolveBossEncounter(state.boss, { tacticPower: bonuses.tacticPower, enemyPressure, bossHp: state.bossHp });
  root.innerHTML = shell(`
    <section class="result-screen ${result.won ? 'result-screen--win' : ''}" data-testid="boss-result">
      <div class="victory-art"><img src="${asset('bosses/pirat-kai.png')}" alt="Pirat Kai besiegt" /><img src="${asset('tula/tula-happy.webp')}" alt="Tula" /></div>
      <span class="eyebrow">${result.won ? 'Kronensiegel 1 von 10' : 'Kai hält die Festung'}</span>
      <h1>${result.won ? 'Der Garten gehört wieder Tula!' : 'Revanche!'}</h1>
      <p>${result.won ? 'Du hast Kai mit Sprache besiegt. Das erste Kronensiegel ist zurück und die nächsten Inselrouten können später geöffnet werden.' : 'Dein Lernfortschritt bleibt erhalten. Für den Bosssieg müssen Crown Sentence, Wortkraft und Kais HP gemeinsam passen.'}</p>
      <div class="reward-row">
        <img src="${asset('rewards/reward-shell-pearl.webp')}" alt="Perlenmuschel" /><span>1 Kronensiegel</span>
        <img src="${asset('rewards/reward-star-xp.webp')}" alt="XP-Stern" /><span>${state.boss.wordPower} Wortkraft</span>
      </div>
      <button class="primary-button" data-action="${result.won ? 'campaign-reset' : 'retry-boss'}">${result.won ? 'Zur Kampagnenkarte' : 'Kai erneut fordern'}</button>
    </section>
  `);
}

function render() {
  runtime.saveSave(createSaveEnvelope(state));
  switch (state.screen) {
    case 'campaign': renderCampaign(); break;
    case 'garden': renderGarden(); break;
    case 'region24': renderRegion24(); break;
    case 'region24-challenge': renderRegion24Challenge(); break;
    case 'region24-boss-intro': renderRegion24BossIntro(); break;
    case 'region24-boss': renderRegion24Boss(); break;
    case 'finale-region': renderFinaleRegion(); break;
    case 'finale-challenge': renderFinaleChallenge(); break;
    case 'finale-boss-intro': renderFinaleBossIntro(); break;
    case 'finale-boss': renderFinaleBoss(); break;
    case 'challenge': renderStandardChallenge(); break;
    case 'enemy-turn': renderEnemyTurn(); break;
    case 'standard-result': renderStandardResult(); break;
    case 'boss-intro': renderBossIntro(); break;
    case 'boss': renderBoss(); break;
    default: renderCampaign();
  }
}

function submitAnswer(answer) {
  if (state.feedback) return;
  const bossMode = state.screen === 'boss';
  const challenge = bossMode ? bossCurrent() : standardCurrent();
  if (!challenge) return;

  const attempt = { answer, hintLevel: state.hintLevel };
  let result;
  if (bossMode) {
    state.boss = evaluateChallenge(state.boss, challenge.id, attempt);
    result = state.boss.results[challenge.id];
    if (result.solved) {
      state.bossHp = Math.max(0, state.bossHp - 1);
      if (!challenge.crown) state.anchorReady = true;
    }
    state.kai = resolveKaiTask(state.kai, challenge.id);
    state.swapNotice = state.kai.lastSwap ? 'Zwei kommende Aufträge haben ihre Plätze getauscht.' : null;
  } else {
    state.standard = evaluateChallenge(state.standard, challenge.id, attempt);
    result = state.standard.results[challenge.id];
  }

  const cardResolution = resolveSelectedCard(state.cardHand, { correct: result.solved });
  state.cardHand = cardResolution.state;
  state.cardNotice = '';
  if (cardResolution.outcome) {
    const card = GARDEN_CARDS.find((item) => item.id === cardResolution.outcome.cardId);
    if (cardResolution.outcome.type === 'played') state.cardNotice = `${card.name} aktiviert – ${card.description}`;
    if (cardResolution.outcome.type === 'refunded') state.cardNotice = `Entdecker-Rückerstattung: ${card.name} bleibt bereit.`;
    if (cardResolution.outcome.type === 'exhausted') state.cardNotice = `${card.name} ist für diese Begegnung erschöpft.`;
  }

  state.helperNotice = '';
  if (!result.solved) {
    const helperResolution = applyHelperEvent(state.helper, 'answer-wrong', { regionId: 'garden' });
    state.helper = helperResolution.state;
    if (helperResolution.effect) {
      state.helperNotice = helperResolution.effect.label;
      if (helperResolution.effect.type === 'pressure-reduction') state.helperPressureReduction += Number(helperResolution.effect.amount ?? 0);
    }
  }

  state.feedback = { ...result, correctAnswer: challenge.correctAnswer };
  state.builtTokens = [];
  render();
}

root.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  if (target.dataset.finaleRegion) { state.finaleSession=createFinaleSession(target.dataset.finaleRegion); state.finaleFeedback=null; state.finaleBuiltTokens=[]; state.screen='finale-region'; render(); return; }
  if (target.dataset.finaleAnswer != null) { const out=answerFinale(state.finaleSession,target.dataset.finaleAnswer); state.finaleSession=out.state; state.finaleFeedback=out.result; render(); return; }
  if (target.dataset.finaleToken != null) { const c=currentFinaleChallenge(state.finaleSession); const index=Number(target.dataset.finaleToken); if(!state.finaleBuiltTokens.some(x=>x.index===index))state.finaleBuiltTokens.push({index,token:c.tokens[index]}); render(); return; }
  if (target.dataset.finaleRemove != null) { state.finaleBuiltTokens.splice(Number(target.dataset.finaleRemove),1); render(); return; }

  if (target.dataset.region24) { state.region24Session=createRegion24Session(target.dataset.region24); state.region24Feedback=null; state.region24BuiltTokens=[]; state.screen='region24'; render(); return; }
  if (target.dataset.region24Answer != null) { const out=answerRegion24(state.region24Session,target.dataset.region24Answer); state.region24Session=out.state; state.region24Feedback=out.result; render(); return; }
  if (target.dataset.region24Token != null) { const c=currentRegion24Challenge(state.region24Session); const t=c.tokens[Number(target.dataset.region24Token)]; if(!state.region24BuiltTokens.includes(t))state.region24BuiltTokens.push(t); render(); return; }
  if (target.dataset.region24Remove != null) { state.region24BuiltTokens.splice(Number(target.dataset.region24Remove),1); render(); return; }

  if (target.dataset.helperId) {
    state.helper = selectHelper(state.helper, target.dataset.helperId);
    state.helperNotice = '';
    render();
    return;
  }

  if (target.dataset.cardId) {
    state.cardHand = selectCard(state.cardHand, target.dataset.cardId);
    const selected = state.cardHand.cards.find((entry) => entry.definition.id === state.cardHand.selectedId);
    state.cardNotice = selected ? `${selected.definition.name} wartet auf eine richtige Sprachantwort.` : '';
    render();
    return;
  }

  if (target.dataset.answer) {
    submitAnswer(target.dataset.answer);
    return;
  }

  if (target.dataset.tokenIndex != null) {
    const challenge = state.screen === 'boss' ? bossCurrent() : standardCurrent();
    const token = challenge.tokens[Number(target.dataset.tokenIndex)];
    if (!state.builtTokens.includes(token)) state.builtTokens.push(token);
    render();
    return;
  }

  if (target.dataset.removeToken != null) {
    state.builtTokens.splice(Number(target.dataset.removeToken), 1);
    render();
    return;
  }

  if (target.dataset.anchor) {
    state.kai = anchorKaiTask(state.kai, target.dataset.anchor);
    state.anchorReady = false;
    state.anchorMessage = 'Ankerblick aktiv: Dieser Auftrag kann beim nächsten Kai-Tausch nicht verschoben werden.';
    render();
    return;
  }

  switch (target.dataset.action) {
    case 'pause': state.paused = true; state.helpOpen = false; render(); break;
    case 'resume': state.paused = false; render(); break;
    case 'help': state.helpOpen = true; state.paused = false; render(); break;
    case 'close-help': state.helpOpen = false; render(); break;
    case 'open-garden': state.screen = 'garden'; render(); break;
    case 'finale-start': state.screen='finale-challenge'; render(); break;
    case 'finale-submit-sentence': { const out=answerFinale(state.finaleSession,state.finaleBuiltTokens.map(x=>x.token)); state.finaleSession=out.state; state.finaleFeedback=out.result; state.finaleBuiltTokens=[]; render(); break; }
    case 'finale-next': state.finaleFeedback=null; state.finaleBuiltTokens=[]; render(); break;
    case 'finale-retry': state.finaleSession=createFinaleSession(state.finaleSession.regionId); state.finaleFeedback=null; state.finaleBuiltTokens=[]; state.screen='finale-challenge'; render(); break;
    case 'finale-boss-intro': state.screen='finale-boss-intro'; render(); break;
    case 'finale-boss-start': state.finaleSession=startFinaleBoss(state.finaleSession); state.finaleFeedback=null; state.finaleBuiltTokens=[]; state.screen='finale-boss'; render(); break;
    case 'finale-boss-next': state.finaleFeedback=null; state.finaleBuiltTokens=[]; render(); break;
    case 'region24-start': state.screen='region24-challenge'; render(); break;
    case 'region24-submit-sentence': { const out=answerRegion24(state.region24Session,state.region24BuiltTokens); state.region24Session=out.state; state.region24Feedback=out.result; state.region24BuiltTokens=[]; render(); break; }
    case 'region24-next': state.region24Feedback=null; state.region24BuiltTokens=[]; render(); break;
    case 'region24-retry': state.region24Session=createRegion24Session(state.region24Session.regionId); state.region24Feedback=null; state.region24BuiltTokens=[]; state.screen='region24-challenge'; render(); break;
    case 'region24-boss-intro': state.screen='region24-boss-intro'; render(); break;
    case 'region24-boss-start': state.region24Session=startRegion24Boss(state.region24Session); state.region24Feedback=null; state.region24BuiltTokens=[]; state.screen='region24-boss'; render(); break;
    case 'region24-boss-next': state.region24Feedback=null; state.region24BuiltTokens=[]; render(); break;
    case 'campaign': state.screen = 'campaign'; render(); break;
    case 'start-standard': resetStandard(); break;
    case 'retry-standard': resetStandard(); break;
    case 'hint': state.hintLevel = Math.max(1, state.hintLevel); render(); break;
    case 'submit-sentence': submitAnswer(state.builtTokens.join(' ')); break;
    case 'next-standard':
      state.feedback = null;
      state.hintLevel = 0;
      state.cardNotice = '';
      state.helperNotice = '';
      state.standardIndex += 1;
      if (state.standard.completed) state.screen = 'standard-result';
      else if (state.standardIndex === 2 && !state.enemyTurnResolved) state.screen = 'enemy-turn';
      else state.screen = 'challenge';
      render();
      break;
    case 'resolve-enemy-turn': {
      const intent = state.enemyIntent;
      state.campaignAi = resolveEnemyRound(state.campaignAi);
      state.enemyTurnResolved = true;
      state.enemyOutcomeNotice = intent?.type === 'scout'
        ? `Niko hat ${districtTitle(intent.targetId)} ausgekundschaftet. Deine Sprachaufgaben bleiben unverändert.`
        : `Nikos angekündigte Aktion wurde sichtbar ausgeführt. Deine Sprachaufgaben bleiben unverändert.`;
      state.screen = 'challenge';
      render();
      break;
    }
    case 'boss-intro': state.screen = 'boss-intro'; render(); break;
    case 'start-boss': resetBoss(); break;
    case 'next-boss':
      state.feedback = null;
      state.hintLevel = 0;
      state.cardNotice = '';
      state.helperNotice = '';
      state.swapNotice = null;
      state.anchorMessage = state.kai.anchoredId ? state.anchorMessage : '';
      render();
      break;
    case 'retry-boss': resetBoss(); break;
    case 'campaign-reset': runtime.clearSave(); state = freshState(); render(); break;
    default: break;
  }
});

root.addEventListener('dragstart', (event) => {
  const token = event.target.closest('[data-drag-token-index]');
  if (!token || token.disabled) return;
  draggedTokenIndex = Number(token.dataset.dragTokenIndex);
  event.dataTransfer?.setData('text/plain', String(draggedTokenIndex));
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
});

root.addEventListener('dragover', (event) => {
  if (event.target.closest('[data-token-dropzone]')) event.preventDefault();
});

root.addEventListener('drop', (event) => {
  if (!event.target.closest('[data-token-dropzone]')) return;
  event.preventDefault();
  const raw = event.dataTransfer?.getData('text/plain');
  const index = raw !== '' && raw != null ? Number(raw) : draggedTokenIndex;
  const challenge = state.screen === 'boss' ? bossCurrent() : standardCurrent();
  if (!challenge || !Number.isInteger(index) || index < 0 || index >= challenge.tokens.length) return;
  const token = challenge.tokens[index];
  if (!state.builtTokens.includes(token)) state.builtTokens.push(token);
  draggedTokenIndex = null;
  render();
});

root.addEventListener('dragend', () => { draggedTokenIndex = null; });

render();
