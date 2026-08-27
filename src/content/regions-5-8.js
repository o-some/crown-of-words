export const REGIONS_5_8 = Object.freeze({
  family: {
    id:'family', order:5, name:'Familie', bossId:'vargas', bossName:'Piratenbaron Vargas', enemyId:'yara',
    worldAsset:'worlds/world-coral-reef.webp', bossAsset:'bosses/boss-05-vargas.webp',
    focus:'Personen, Pronomen, Besitz und Beziehungen', strategicBonus:'Unterstützungsbonus',
    districts:['Anlegestelle','Familienplatz','Erzählwerkstatt','Familienturnier','Vargas’ Tiefenhof'],
    standard:[
      {id:'family-1',type:'choice',prompt:'meine Schwester',answers:['my sister','his brother','our mother'],correct:'my sister'},
      {id:'family-2',type:'choice',prompt:'sein Vater',answers:['her father','his father','their son'],correct:'his father'},
      {id:'family-3',type:'choice',prompt:'Das ist unsere Familie.',answers:['This is our family.','That is his friend.','These are my parents.'],correct:'This is our family.'},
      {id:'family-4',type:'choice',prompt:'ihre Eltern',answers:['their parents','our children','my grandparents'],correct:'their parents'},
      {id:'family-crown',type:'sentence',prompt:'Baue: Meine Schwester hilft unserem Vater.',tokens:['My','sister','helps','our','father.'],correct:['My','sister','helps','our','father.']},
    ],
    boss:[
      {id:'vargas-1',type:'choice',prompt:'mein Bruder',answers:['my brother','your sister','his uncle'],correct:'my brother'},
      {id:'vargas-2',type:'choice',prompt:'Sie besucht ihre Großmutter.',answers:['She visits her grandmother.','He visits his grandfather.','They visit our mother.'],correct:'She visits her grandmother.'},
      {id:'vargas-3',type:'sentence',prompt:'Treasure Sentence: Unsere Familie hält zusammen.',tokens:['Our','family','sticks','together.'],correct:['Our','family','sticks','together.'],counter:true},
    ],
  },
  body: {
    id:'body', order:6, name:'Körper', bossId:'ironhook', bossName:'Kapitän Ironhook', enemyId:'taro',
    worldAsset:'worlds/world-crystal-cove.webp', bossAsset:'bosses/boss-06-ironhook.webp',
    focus:'Körper, Zustände, Bedürfnisse und Modalverben', strategicBonus:'Schutzschild',
    districts:['Anlegestelle','Heilstation','Körperwerkstatt','Kraftturnier','Ironhooks Kettenbucht'],
    standard:[
      {id:'body-1',type:'choice',prompt:'der Arm',answers:['the arm','the leg','the head'],correct:'the arm'},
      {id:'body-2',type:'choice',prompt:'Ich bin müde.',answers:['I am tired.','I am hungry.','I am strong.'],correct:'I am tired.'},
      {id:'body-3',type:'choice',prompt:'Ich muss Wasser trinken.',answers:['I must drink water.','I can run fast.','I should open the door.'],correct:'I must drink water.'},
      {id:'body-4',type:'choice',prompt:'der Rücken',answers:['the back','the hand','the foot'],correct:'the back'},
      {id:'body-crown',type:'sentence',prompt:'Baue: Ich muss meine Hände waschen.',tokens:['I','must','wash','my','hands.'],correct:['I','must','wash','my','hands.']},
    ],
    boss:[
      {id:'ironhook-1',type:'choice',prompt:'Ich kann meinen Arm bewegen.',answers:['I can move my arm.','I must close my eyes.','I can touch my foot.'],correct:'I can move my arm.'},
      {id:'ironhook-2',type:'choice',prompt:'Du solltest dich ausruhen.',answers:['You should rest.','You must jump.','You can shout.'],correct:'You should rest.'},
      {id:'ironhook-3',type:'sentence',prompt:'Brich die Kette: Ich kann wieder frei atmen.',tokens:['I','can','breathe','freely','again.'],correct:['I','can','breathe','freely','again.'],counter:true},
    ],
  },
  travel: {
    id:'travel', order:7, name:'Unterwegs', bossId:'thorne', bossName:'Admiral Thorne', enemyId:'piko',
    worldAsset:'worlds/world-desert-oasis.webp', bossAsset:'bosses/boss-07-thorne.webp',
    focus:'Reise, Richtungen, Fragen und Verkehr', strategicBonus:'Zusätzliche Seeroute',
    districts:['Anlegestelle','Wegweiser','Reisewerkstatt','Routenturnier','Thornes Admiralsposten'],
    standard:[
      {id:'travel-1',type:'choice',prompt:'nach links',answers:['to the left','to the right','straight ahead'],correct:'to the left'},
      {id:'travel-2',type:'choice',prompt:'Wo ist der Bahnhof?',answers:['Where is the train station?','When does the bus leave?','How much is the ticket?'],correct:'Where is the train station?'},
      {id:'travel-3',type:'choice',prompt:'Wir fahren mit dem Bus.',answers:['We travel by bus.','We walk to the harbor.','We wait for the train.'],correct:'We travel by bus.'},
      {id:'travel-4',type:'choice',prompt:'geradeaus',answers:['straight ahead','behind us','next to me'],correct:'straight ahead'},
      {id:'travel-crown',type:'sentence',prompt:'Baue: Gehe geradeaus und biege dann rechts ab.',tokens:['Go','straight','ahead','and','then','turn','right.'],correct:['Go','straight','ahead','and','then','turn','right.']},
    ],
    boss:[
      {id:'thorne-1',type:'choice',prompt:'Welche Straße führt zum Hafen?',answers:['Which road leads to the harbor?','Where is my suitcase?','When is breakfast?'],correct:'Which road leads to the harbor?',counter:true},
      {id:'thorne-2',type:'choice',prompt:'Der Zug fährt um neun Uhr ab.',answers:['The train leaves at nine.','The bus arrives at ten.','The ship stops here.'],correct:'The train leaves at nine.'},
      {id:'thorne-3',type:'sentence',prompt:'Schütze die Route: Wir müssen am Bahnhof links abbiegen.',tokens:['We','must','turn','left','at','the','station.'],correct:['We','must','turn','left','at','the','station.'],counter:true},
    ],
  },
  movement: {
    id:'movement', order:8, name:'Bewegung', bossId:'corvin', bossName:'Kartenmeister Corvin', enemyId:'riven',
    worldAsset:'worlds/world-ice-peak.webp', bossAsset:'bosses/boss-08-corvin.webp',
    focus:'Verben, Zeitformen und Imperative', strategicBonus:'Manöver',
    districts:['Anlegestelle','Trainingsfeld','Manöverwerkstatt','Bewegungsturnier','Corvins Kartenkammer'],
    standard:[
      {id:'move-1',type:'choice',prompt:'springen',answers:['to jump','to sit','to sleep'],correct:'to jump'},
      {id:'move-2',type:'choice',prompt:'Sie läuft jeden Morgen.',answers:['She runs every morning.','She ran yesterday.','She is sitting now.'],correct:'She runs every morning.'},
      {id:'move-3',type:'choice',prompt:'Dreh dich um!',answers:['Turn around!','Sit down!','Walk slowly!'],correct:'Turn around!'},
      {id:'move-4',type:'choice',prompt:'Wir gingen nach Hause.',answers:['We went home.','We go home.','We are going home.'],correct:'We went home.'},
      {id:'move-crown',type:'sentence',prompt:'Baue: Lauf nach vorne und bleib dann stehen.',tokens:['Run','forward','and','then','stop.'],correct:['Run','forward','and','then','stop.']},
    ],
    boss:[
      {id:'corvin-1',type:'choice',prompt:'Schiebe dich nach rechts.',answers:['Move to the right.','Move to the left.','Stay where you are.'],correct:'Move to the right.'},
      {id:'corvin-2',type:'choice',prompt:'Er sprang über die Kiste.',answers:['He jumped over the box.','He walks around the box.','He sits beside the box.'],correct:'He jumped over the box.'},
      {id:'corvin-3',type:'sentence',prompt:'Gegenmanöver: Bewege diese Reihe zurück nach links.',tokens:['Move','this','row','back','to','the','left.'],correct:['Move','this','row','back','to','the','left.'],counter:true},
    ],
  },
});

export const getRegion58 = (id) => REGIONS_5_8[id] ?? null;
