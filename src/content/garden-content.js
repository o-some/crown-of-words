import { createChallenge } from '../game/learning-core.js';

export const GARDEN_STANDARD_CHALLENGES = Object.freeze([
  createChallenge({ id: 'garden-apple', type: 'translation', conceptId: 'garden-apple', correctAnswer: 'apple', prompt: 'Apfel', options: ['apple', 'pear', 'flower'] }),
  createChallenge({ id: 'garden-green', type: 'translation', conceptId: 'garden-green', correctAnswer: 'green', prompt: 'grün', options: ['yellow', 'green', 'blue'] }),
  createChallenge({ id: 'garden-water', type: 'translation', conceptId: 'garden-water', correctAnswer: 'water', prompt: 'Wasser', options: ['soil', 'sun', 'water'] }),
  createChallenge({ id: 'garden-grows', type: 'translation', conceptId: 'garden-grows', correctAnswer: 'grows', prompt: 'wächst', options: ['grows', 'sleeps', 'sails'] }),
  createChallenge({ id: 'garden-crown', type: 'sentence', conceptId: 'garden-crown', crown: true, correctAnswer: 'The flower grows.', prompt: 'Die Blume wächst.', tokens: ['grows.', 'flower', 'The'] }),
]);

export const GARDEN_BOSS_CHALLENGES = Object.freeze([
  createChallenge({ id: 'kai-flower', type: 'translation', conceptId: 'garden-flower', correctAnswer: 'flower', prompt: 'Blume', options: ['tree', 'flower', 'stone'] }),
  createChallenge({ id: 'kai-sun', type: 'translation', conceptId: 'garden-sun', correctAnswer: 'sun', prompt: 'Sonne', options: ['rain', 'moon', 'sun'] }),
  createChallenge({ id: 'kai-tree', type: 'translation', conceptId: 'garden-tree', correctAnswer: 'tree', prompt: 'Baum', options: ['tree', 'boat', 'book'] }),
  createChallenge({ id: 'kai-blooms', type: 'translation', conceptId: 'garden-blooms', correctAnswer: 'blooms', prompt: 'blüht', options: ['blooms', 'reads', 'swims'] }),
  createChallenge({ id: 'kai-crown', type: 'sentence', conceptId: 'garden-kai-crown', crown: true, correctAnswer: 'The garden blooms.', prompt: 'Der Garten blüht.', tokens: ['blooms.', 'garden', 'The'] }),
]);
