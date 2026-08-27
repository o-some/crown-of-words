export const REGIONS_9_10 = Object.freeze({
  harbor: {
    id:'harbor', order:9, name:'Hafen-Turnier', bossId:'azrak', bossName:'Schattenfürst Azrak', enemyId:'koda',
    worldAsset:'worlds/world-harbor.webp', bossAsset:'bosses/boss-09-azrak.webp',
    focus:'Gemischte Alltagsdialoge am Hafen', strategicBonus:'Schattenaufklärung',
    districts:['Anlegestelle','Marktgasse','Dialogwerkstatt','Hafenturnier','Azraks Schattenkai'],
    standard:[
      {id:'harbor-1',type:'choice',prompt:'Guten Morgen! Wo ist der Hafen?',answers:['Good morning! Where is the harbor?','Good night! Where is the hotel?','Hello! When is the train?'],correct:'Good morning! Where is the harbor?'},
      {id:'harbor-2',type:'choice',prompt:'Ich möchte zwei Tickets, bitte.',answers:['I would like two tickets, please.','I need three bags, please.','I want one room, please.'],correct:'I would like two tickets, please.'},
      {id:'harbor-3',type:'choice',prompt:'Wann fährt das Schiff ab?',answers:['When does the ship leave?','Where does the bus stop?','Why is the shop closed?'],correct:'When does the ship leave?'},
      {id:'harbor-4',type:'choice',prompt:'Danke, bis später!',answers:['Thank you, see you later!','Sorry, I am late!','Please wait here!'],correct:'Thank you, see you later!'},
      {id:'harbor-crown',type:'sentence',prompt:'Baue: Entschuldigung, können Sie mir den Weg zum Hafen zeigen?',tokens:['Excuse','me,','can','you','show','me','the','way','to','the','harbor?'],correct:['Excuse','me,','can','you','show','me','the','way','to','the','harbor?']},
    ],
    boss:[
      {id:'azrak-1',type:'choice',prompt:'Ist dieses Schiff heute pünktlich?',answers:['Is this ship on time today?','Is this shop open tomorrow?','Is the train very full?'],correct:'Is this ship on time today?',counter:true},
      {id:'azrak-2',type:'choice',prompt:'Wir treffen uns vor dem Hafen.',answers:['We meet in front of the harbor.','We sleep behind the station.','We eat beside the castle.'],correct:'We meet in front of the harbor.'},
      {id:'azrak-crown',type:'sentence',prompt:'Crown Sentence: Wenn das Schiff ankommt, warten wir am Kai.',tokens:['When','the','ship','arrives,','we','wait','at','the','pier.'],correct:['When','the','ship','arrives,','we','wait','at','the','pier.'],counter:true},
    ],
  },
  'crown-castle': {
    id:'crown-castle', order:10, name:'Kronenschloss', bossId:'varkos', bossName:'Piratenkönig Varkos', enemyId:'riven',
    worldAsset:'worlds/world-castle.webp', bossAsset:'bosses/boss-10-varkos.webp',
    focus:'Mehrteilige Sätze, Konnektoren und gemischte Sprachkompetenz', strategicBonus:'Krone der Wörter',
    districts:['Schlosstor','Kronenbibliothek','Königssaal','Finalturnier','Thronsaal von Varkos'],
    standard:[
      {id:'castle-1',type:'choice',prompt:'Ich bleibe hier, weil ich auf Tula warte.',answers:['I stay here because I am waiting for Tula.','I leave because Tula is sleeping.','I wait although the ship is gone.'],correct:'I stay here because I am waiting for Tula.'},
      {id:'castle-2',type:'choice',prompt:'Wir gehen weiter, obwohl der Weg schwierig ist.',answers:['We continue although the path is difficult.','We stop because the road is easy.','We return when the castle opens.'],correct:'We continue although the path is difficult.'},
      {id:'castle-3',type:'choice',prompt:'Zuerst öffnen wir das Tor, dann betreten wir den Saal.',answers:['First we open the gate, then we enter the hall.','First we close the door, then we leave the room.','Before we run, we wait at the harbor.'],correct:'First we open the gate, then we enter the hall.'},
      {id:'castle-4',type:'choice',prompt:'Wenn wir zusammenarbeiten, können wir gewinnen.',answers:['If we work together, we can win.','If we sleep longer, we may leave.','When we lose, we close the book.'],correct:'If we work together, we can win.'},
      {id:'castle-crown',type:'sentence',prompt:'Baue: Obwohl Varkos schummelt, gewinnen wir, weil wir zusammen lernen.',tokens:['Although','Varkos','cheats,','we','win','because','we','learn','together.'],correct:['Although','Varkos','cheats,','we','win','because','we','learn','together.']},
    ],
    boss:[
      {id:'varkos-phase-1',phase:1,type:'choice',prompt:'Phase 1 · Tausch: Wir ordnen die Aufträge neu.',answers:['We rearrange the tasks.','We hide the correct answer.','We skip the final sentence.'],correct:'We rearrange the tasks.'},
      {id:'varkos-phase-2',phase:2,type:'choice',prompt:'Phase 2 · Kette: Obwohl die Route blockiert ist, bleibt die Antwort frei.',answers:['Although the route is blocked, the answer stays free.','Because the answer is hidden, the route is easy.','The chain changes the correct word.'],correct:'Although the route is blocked, the answer stays free.'},
      {id:'varkos-phase-3',phase:3,type:'choice',prompt:'Phase 3 · Formation: Nachdem sich die Reihe bewegt, prüfen wir die neue Position.',answers:['After the row moves, we check the new position.','Before the row moves, we delete the words.','When the grid changes, the answer changes too.'],correct:'After the row moves, we check the new position.'},
      {id:'varkos-crown',phase:4,type:'sentence',prompt:'Finale Crown Sentence: Obwohl die Krone im Chaos versinkt, gewinnen wir, weil Sprache uns verbindet.',tokens:['Although','the','crown','falls','into','chaos,','we','win','because','language','connects','us.'],correct:['Although','the','crown','falls','into','chaos,','we','win','because','language','connects','us.'],counter:true},
    ],
  },
});

export const getRegion910 = (id) => REGIONS_9_10[id] ?? null;
