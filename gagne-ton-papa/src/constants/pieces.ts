// src/constants/pieces.ts
// Source of truth for all piece shapes.
// Shapes are encoded as arrays of {x, y} relative coordinates,
// normalized so the minimum x and y are both 0.

import type { PieceDefinition } from '@/types'

export const PIECE_DEFINITIONS: PieceDefinition[] = [
  {
    // L-shape: 2 wide, 3 tall, foot extends right
    //  X
    //  X
    //  X X
    id: 'L',
    name: 'L-Block',
    color: '#4A90D9',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  },
  {
    // J-shape (mirror of L): 2 wide, 3 tall, foot extends left
    //   X
    //   X
    // X X
    id: 'J',
    name: 'J-Block',
    color: '#E05A5A',
    baseShape: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  },
  {
    // I-shape: 1 wide, 5 tall (pentomino bar)
    id: 'I',
    name: 'Bar',
    color: '#5AB878',
    baseShape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
    ],
  },
  {
    // T-shape: 3 wide, 2 tall
    // X X X
    //   X
    id: 'T',
    name: 'T-Block',
    color: '#E0A830',
    baseShape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
  },
  {
    // S-shape (Z-tetromino rotated): 3 wide, 2 tall
    //   X X
    // X X
    id: 'S',
    name: 'S-Block',
    color: '#9B59B6',
    baseShape: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  },
  {
    // Square (2x2) — used in Penta 6
    // X X
    // X X
    id: 'O',
    name: 'Square',
    color: '#E8C840',
    baseShape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  },
]

export const PIECE_MAP: Record<string, PieceDefinition> = Object.fromEntries(
  PIECE_DEFINITIONS.map((p) => [p.id, p])
)
