// src/game/hints.ts
// Greedy hint: find any valid placement for a given piece on the current board.
// TODO: Replace with a backtracking solver for smarter hints in a future iteration.

import type { CellCoord, Rotation, PieceShape } from '@/types'
import type { BoardCell } from '@/types'
import type { ActiveHint } from '@/types'
import { checkPlacement } from './validation'

const ROTATIONS: Rotation[] = [0, 90, 180, 270]

/**
 * Find a valid placement for the given piece on the board.
 * Returns null if no valid placement exists.
 */
export function computeHint(
  pieceId: string,
  shape: PieceShape,
  board: BoardCell[][],
  cols: number,
  rows: number
): ActiveHint | null {
  for (const rotation of ROTATIONS) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const origin: CellCoord = { x, y }
        if (checkPlacement(shape, origin, rotation, board, cols, rows)) {
          return { pieceId, origin, rotation }
        }
      }
    }
  }
  return null
}
