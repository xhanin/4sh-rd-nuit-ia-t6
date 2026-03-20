// src/constants/pieces.ts
// Source of truth for all piece shapes.
// IDs and shapes come from pieces-dictionary.js (game design reference).
// Shapes encoded as {x, y} coords, row-major (x = col, y = row), normalized so min x=0, min y=0.

import type { PieceDefinition } from '@/types'

export const PIECE_DEFINITIONS: PieceDefinition[] = [
  // --- 7 PENTAMINOS (5 blocs) ---
  {
    // Pièce 2 — Orange — L
    // X .
    // X .
    // X .
    // X X
    id: '2',
    name: 'Pentamino L',
    color: '#F5780A',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
    ],
  },
  {
    // Pièce 3 — Marron
    // . X
    // X X
    // . X
    // . X
    id: '3',
    name: 'Pentamino 3',
    color: '#8B4513',
    baseShape: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  },
  {
    // Pièce 4 — Mauve
    // . X
    // . X
    // X X
    // X .
    id: '4',
    name: 'Pentamino 4',
    color: '#9B59B6',
    baseShape: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 3 },
    ],
  },
  {
    // Pièce 5 — Bleu foncé — V
    // X . .
    // X . .
    // X X X
    id: '5',
    name: 'Pentamino V',
    color: '#1A5276',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
  },
  {
    // Pièce 6 — Rose
    // . X
    // X X
    // X X
    id: '6',
    name: 'Pentamino P',
    color: '#E91E8C',
    baseShape: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  },
  {
    // Pièce 7 — Jaune — U
    // X X
    // X .
    // X X
    id: '7',
    name: 'Pentamino U',
    color: '#F1C40F',
    baseShape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  },
  {
    // Pièce 8 — Bleu clair
    // . X X
    // . X .
    // X X .
    id: '8',
    name: 'Pentamino S',
    color: '#5DADE2',
    baseShape: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  },

  // --- 5 TÉTRAMINOS (4 blocs) ---
  {
    // Pièce A — Rose — Barre
    // X
    // X
    // X
    // X
    id: 'A',
    name: 'Tétramino Barre',
    color: '#FF6B9D',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],
  },
  {
    // Pièce B — Vert — L inversé
    // X X
    // X .
    // X .
    id: 'B',
    name: 'Tétramino L inv.',
    color: '#27AE60',
    baseShape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
  },
  {
    // Pièce C — Bleu — T
    // X .
    // X X
    // X .
    id: 'C',
    name: 'Tétramino T',
    color: '#2471A3',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
    ],
  },
  {
    // Pièce D — Jaune — Z vertical
    // . X
    // X X
    // X .
    id: 'D',
    name: 'Tétramino Z',
    color: '#D4AC0D',
    baseShape: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
    ],
  },
  {
    // Pièce E — Violet — Carré
    // X X
    // X X
    id: 'E',
    name: 'Tétramino Carré',
    color: '#7D3C98',
    baseShape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  },

  // --- 6 MINIMINOS ---
  {
    // V1 — Rouge — Monomino
    id: 'V1',
    name: 'Monomino rouge 1',
    color: '#E74C3C',
    baseShape: [{ x: 0, y: 0 }],
  },
  {
    // V2 — Rouge — Monomino
    id: 'V2',
    name: 'Monomino rouge 2',
    color: '#CB4335',
    baseShape: [{ x: 0, y: 0 }],
  },
  {
    // W1 — Beige — Domino
    // X
    // X
    id: 'W1',
    name: 'Domino beige 1',
    color: '#D5C5A1',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
  },
  {
    // W2 — Beige — Domino
    // X
    // X
    id: 'W2',
    name: 'Domino beige 2',
    color: '#C8B89A',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
  },
  {
    // X — Marron — Petit L (triomino)
    // X X
    // X .
    id: 'X',
    name: 'Triomino L',
    color: '#A04000',
    baseShape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
  },
  {
    // Y — Orange — Petite barre (triomino)
    // X
    // X
    // X
    id: 'Y',
    name: 'Triomino barre',
    color: '#E67E22',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
  },
]

export const PIECE_MAP: Record<string, PieceDefinition> = Object.fromEntries(
  PIECE_DEFINITIONS.map((p) => [p.id, p])
)
