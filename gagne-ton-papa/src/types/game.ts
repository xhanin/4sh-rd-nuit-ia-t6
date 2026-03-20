// src/types/game.ts

import type { Rotation, CellCoord } from './pieces'
import type { BoardCell, PlacedPiece } from './board'

export type GameStatus = 'idle' | 'playing' | 'level_complete' | 'game_won'

export interface ActiveHint {
  pieceId: string
  origin: CellCoord
  rotation: Rotation
}

export interface GameState {
  currentLevel: number
  board: BoardCell[][]
  placedPieces: PlacedPiece[]
  /** IDs of pieces not yet placed on the board */
  inventoryPieceIds: string[]
  timerStarted: boolean
  elapsedMs: number
  gameStatus: GameStatus
  selectedPieceId: string | null
  selectedRotation: Rotation
  activeHint: ActiveHint | null
}
