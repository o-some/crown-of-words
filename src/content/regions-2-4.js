import { REGIONS_5_8 } from './regions-5-8.js';

export const REGIONS_2_4 = Object.freeze({
  library: {
    id: 'library', order: 2, name: 'Bibliothek', bossId: 'brax', bossName: 'Kapitän Brax', enemyId: 'lio',
    worldAsset: 'worlds/world-library.webp', bossAsset: 'bosses/boss-02-kapitaen-brax.png',
    focus: 'Wörter, Bücher, Artikel und Satzgrundlagen', strategicBonus: 'Zusätzliche Hinweisaktion',
    districts: ['Anlegestelle','Lesesaal','Schreibwerkstatt','Wortturnier','Brax’ Pulverturm'],
    standard: [
      { id:'lib-1', type:'choice', prompt:'das Buch', answers:['the book','the shelf','the page'], correct:'the book' },
      { id:'lib-2', type:'choice', prompt:'die Seite', answers:['the word','the page','the library'], correct:'the page' },
      { id:'lib-3', type:'choice', prompt:'ein Wort', answers:['a sentence','a word','a book'], correct:'a word' },
      { id:'lib-4', type:'choice', prompt:'Ich lese ein Buch.', answers:['I read a book.','I write a page.','I open the shelf.'], correct:'I read a book.' },
      { id:'lib-crown', type:'sentence', prompt:'Baue: Das Buch liegt auf einem Tisch.', tokens:['The','book','is','on','a','table.'], correct:['The','book','is','on','a','table.'] },
    ],
    boss: [
      { id:'brax-1', type:'choice', prompt:'die Bibliothek', answers:['the library','the letter','the lesson'], correct:'the library' },
      { id:'brax-2', type:'choice', prompt:'Ich öffne das Buch.', answers:['I close the page.','I open the book.','I read the word.'], correct:'I open the book.' },
      { id:'brax-3', type:'sentence', prompt:'Entschärfe das Fass: Ein Buch liegt auf dem Tisch.', tokens:['A','book','is','on','the','table.'], correct:['A','book','is','on','the','table.'], counter:true },
    ],
  },
  wildlife: {
    id: 'wildlife', order: 3, name: 'Tierwelt', bossId: 'blackfinn', bossName: 'Blackfinn', enemyId: 'piko',
    worldAsset: 'worlds/world-jungle-trail.webp', bossAsset: 'bosses/boss-03-blackfinn.png',
    focus: 'Tiere, Eigenschaften und Vergleiche', strategicBonus: 'Aufklärung',
    districts: ['Anlegestelle','Tierpfad','Forscherlager','Spurenturnier','Blackfinns Nebelbucht'],
    standard: [
      { id:'wild-1', type:'choice', prompt:'der Vogel', answers:['the bird','the bear','the fish'], correct:'the bird' },
      { id:'wild-2', type:'choice', prompt:'schnell', answers:['slow','fast','small'], correct:'fast' },
      { id:'wild-3', type:'choice', prompt:'Der Fuchs ist schneller als die Schildkröte.', answers:['The fox is faster than the turtle.','The turtle is bigger than the fox.','The fox is as slow as the turtle.'], correct:'The fox is faster than the turtle.' },
      { id:'wild-4', type:'choice', prompt:'groß', answers:['big','quiet','young'], correct:'big' },
      { id:'wild-crown', type:'sentence', prompt:'Baue: Der Tiger ist größer als eine Katze.', tokens:['The','tiger','is','bigger','than','a','cat.'], correct:['The','tiger','is','bigger','than','a','cat.'] },
    ],
    boss: [
      { id:'blackfinn-1', type:'choice', prompt:'gefährlich', answers:['dangerous','friendly','tiny'], correct:'dangerous', counter:true },
      { id:'blackfinn-2', type:'choice', prompt:'Der Adler fliegt hoch.', answers:['The eagle flies high.','The eagle swims fast.','The eagle sleeps low.'], correct:'The eagle flies high.' },
      { id:'blackfinn-3', type:'sentence', prompt:'Finde die Spur: Ein Wolf ist stärker als der Hund.', tokens:['A','wolf','is','stronger','than','the','dog.'], correct:['A','wolf','is','stronger','than','the','dog.'], counter:true },
    ],
  },
  home: {
    id: 'home', order: 4, name: 'Zuhause', bossId: 'roderick', bossName: 'Alt-Kapitän Roderick', enemyId: 'koda',
    worldAsset: 'worlds/world-sun-bay.webp', bossAsset: 'bosses/boss-04-roderick.png',
    focus: 'Räume, Gegenstände und Präpositionen', strategicBonus: 'Verteidigung',
    districts: ['Anlegestelle','Küche','Hauswerkstatt','Heimturnier','Rodericks Altes Haus'],
    standard: [
      { id:'home-1', concept:'room:kitchen', type:'choice', prompt:'die Küche', answers:['the kitchen','the bedroom','the garden'], correct:'the kitchen' },
      { id:'home-2', concept:'preposition:under', type:'choice', prompt:'unter dem Tisch', answers:['on the table','under the table','next to the chair'], correct:'under the table' },
      { id:'home-3', concept:'preposition:next-to', type:'choice', prompt:'Der Schlüssel ist neben der Tür.', answers:['The key is under the bed.','The key is next to the door.','The key is in the kitchen.'], correct:'The key is next to the door.' },
      { id:'home-4', concept:'object:window', type:'choice', prompt:'das Fenster', answers:['the window','the wall','the floor'], correct:'the window' },
      { id:'home-crown', concept:'preposition:next-to', type:'sentence', prompt:'Baue: Die Lampe steht neben meinem Bett.', tokens:['The','lamp','is','next','to','my','bed.'], correct:['The','lamp','is','next','to','my','bed.'] },
    ],
    boss: [
      { id:'roderick-1', type:'choice', prompt:'auf dem Regal', answers:['on the shelf','behind the door','under the chair'], correct:'on the shelf' },
      { id:'roderick-2', type:'choice', prompt:'Das Bild hängt über dem Sofa.', answers:['The picture is above the sofa.','The picture is under the sofa.','The sofa is above the picture.'], correct:'The picture is above the sofa.' },
      { id:'roderick-3', type:'sentence', prompt:'Revanche-Satz: Der Schlüssel liegt in einer Schublade.', tokens:['The','key','is','in','a','drawer.'], correct:['The','key','is','in','a','drawer.'], counter:true },
    ],
  },
});

export const getRegion24 = (id) => REGIONS_2_4[id] ?? REGIONS_5_8[id] ?? null;
