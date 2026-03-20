// src/types/board.ts

import type { CellCoord, Rotation } from './pieces'

export interface BoardCell {
  x: number
  y: number
  /** null = empty; otherwise the definitionId of the placed piece */
  placedPieceId: string | null
}

export interface PlacedPiece {
  definitionId: string
  rotation: Rotation
  /** Top-left cell of the bounding box on the board */
  origin: CellCoord
}

export interface LevelConfig {
  level: number
  name: string
  /** Number of columns (3 | 4 | 5 | 6) */
  cols: number
  /** Number of rows — always 5 */
  rows: number
  /** Ordered list of piece definition IDs available in this level */
  pieceIds: string[]
}
