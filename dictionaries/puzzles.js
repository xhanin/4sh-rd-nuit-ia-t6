const GAME_LEVELS = [
  {
    id: 1,
    name: "L'approche classique",
    dimensions: { width: 5, height: 3 },
    // Les identifiants correspondent aux clés de votre objet GAME_PIECES
    inventory: ['5', '7', 'E', 'V1'], 
    solution: [
      ['5', 'E', 'E', '7', '7'],
      ['5', 'E', 'E', '7', 'V1'],
      ['5', '5', '5', '7', '7']
    ]
  },
  {
    id: 2,
    name: "Le mur de briques",
    dimensions: { width: 5, height: 3 },
    inventory: ['A', 'B', 'E', 'W1', 'V1'],
    solution: [
      ['E', 'E', 'B', 'B', 'B'],
      ['E', 'E', 'B', 'W1', 'W1'],
      ['A', 'A', 'A', 'A', 'V1']
    ]
  },
  {
    id: 3,
    name: "Le grand mix",
    dimensions: { width: 5, height: 3 },
    inventory: ['5', 'B', 'X', 'W1', 'V1'],
    solution: [
      ['5', 'X', 'X', 'B', 'B'],
      ['5', 'V1', 'X', 'B', 'W1'],
      ['5', '5', '5', 'B', 'W1']
    ]
  }
];

// Exemple d'utilisation dans votre logique de jeu :
// Charger le niveau 1
// const currentLevel = GAME_LEVELS[0];
// console.log("Pièces à donner au joueur :", currentLevel.inventory);