// src/game/board.ts
// Immutable board operations. Always return new arrays.

import type { CellCoord, Rotation, PieceShape } from '@/types'
import type { BoardCell, PlacedPiece } from '@/types'
import { getAbsoluteCoords } from './geometry'

/**
 * Create an empty 2D board: board[y][x].
 */
export function buildEmptyBoard(cols: number, rows: number): BoardCell[][] {
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => ({ x, y, placedPieceId: null }))
  )
}

/**
 * Return a new board with the piece placed at origin.
 * Does NOT validate — caller must call checkPlacement first.
 */
export function applyPlacement(
  board: BoardCell[][],
  shape: PieceShape,
  origin: CellCoord,
  rotation: Rotation,
  definitionId: string
): BoardCell[][] {
  const coords = getAbsoluteCoords(shape, origin, rotation)
  const next = board.map((row) => row.map((cell) => ({ ...cell })))
  for (const { x, y } of coords) {
    next[y][x] = { x, y, placedPieceId: definitionId }
  }
  return next
}

/**
 * Return a new board with all cells of the given piece cleared.
 */
export function removePieceFromBoard(
  board: BoardCell[][],
  definitionId: string
): BoardCell[][] {
  return board.map((row) =>
    row.map((cell) =>
      cell.placedPieceId === definitionId
        ? { ...cell, placedPieceId: null }
        : cell
    )
  )
}

/**
 * Find the placed piece record for a given definitionId.
 */
export function findPlacedPiece(
  placedPieces: PlacedPiece[],
  definitionId: string
): PlacedPiece | undefined {
  return placedPieces.find((p) => p.definitionId === definitionId)
}
