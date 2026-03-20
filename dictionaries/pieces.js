const GAME_PIECES = {
  // --- 7 PENTAMINOS (5 blocs) ---
  pentaminos: {
    2: [
      // Orange
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    3: [
      // Marron
      [0, 1],
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    4: [
      // Mauve
      [0, 1],
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    5: [
      // Bleu foncé
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    6: [
      // Rose
      [0, 1],
      [1, 1],
      [1, 1],
    ],
    7: [
      // Jaune
      [1, 1],
      [1, 0],
      [1, 1],
    ],
    8: [
      // Bleu clair
      [0, 1, 1],
      [0, 1, 0],
      [1, 1, 0],
    ],
  },

  // --- 5 TÉTRAMINOS (4 blocs) ---
  tetraminos: {
    A: [
      // Rose (Barre)
      [1],
      [1],
      [1],
      [1],
    ],
    B: [
      // Vert (L inversé)
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    C: [
      // Bleu (T)
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    D: [
      // Jaune (Z vertical)
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    E: [
      // Violet (Carré)
      [1, 1],
      [1, 1],
    ],
  },

  // --- 6 MINIMINOS (1 à 3 blocs) ---
  miniminos: {
    V1: [
      // Rouge 1 (Monomino)
      [1],
    ],
    V2: [
      // Rouge 2 (Monomino)
      [1],
    ],
    W1: [
      // Beige 1 (Domino)
      [1],
      [1],
    ],
    W2: [
      // Beige 2 (Domino)
      [1],
      [1],
    ],
    X: [
      // Marron (Petit L)
      [1, 1],
      [1, 0],
    ],
    Y: [
      // Orange (Petite barre)
      [1],
      [1],
      [1],
    ],
  },
};

// Exemple d'utilisation :
// const pieceA = GAME_PIECES.tetraminos.A;
// console.log(pieceA[0][0]); // Affiche 1
