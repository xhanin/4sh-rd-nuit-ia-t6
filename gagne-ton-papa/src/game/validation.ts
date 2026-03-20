// src/game/validation.ts
// Placement validation and win condition checks.

import type { CellCoord, Rotation, PieceShape } from '@/types'
import type { BoardCell, PlacedPiece } from '@/types'
import { getAbsoluteCoords } from './geometry'

/**
 * Check whether all coords fall within the board boundaries.
 */
export function isInBounds(
  coords: CellCoord[],
  cols: number,
  rows: number
): boolean {
  return coords.every((c) => c.x >= 0 && c.x < cols && c.y >= 0 && c.y < rows)
}

/**
 * Check whether any of the given coords are already occupied on the board.
 */
export function hasOverlap(
  coords: CellCoord[],
  board: BoardCell[][],
  /** Optional: skip checking the piece currently occupying these cells (for move) */
  ignorePieceId?: string
): boolean {
  return coords.some((c) => {
    const cell = board[c.y]?.[c.x]
    if (!cell) return false
    if (ignorePieceId && cell.placedPieceId === ignorePieceId) return false
    return cell.placedPieceId !== null
  })
}

/**
 * Full placement validation: in bounds AND no overlap.
 */
export function checkPlacement(
  shape: PieceShape,
  origin: CellCoord,
  rotation: Rotation,
  board: BoardCell[][],
  cols: number,
  rows: number,
  ignorePieceId?: string
): boolean {
  const coords = getAbsoluteCoords(shape, origin, rotation)
  return (
    isInBounds(coords, cols, rows) &&
    !hasOverlap(coords, board, ignorePieceId)
  )
}

/**
 * Win condition: all cells on the board are occupied.
 */
export function checkWin(board: BoardCell[][]): boolean {
  return board.every((row) => row.every((cell) => cell.placedPieceId !== null))
}

/**
 * Check that all provided placed pieces have valid positions on the board.
 */
export function validateAllPlacements(
  placedPieces: PlacedPiece[],
  pieceShapes: Record<string, PieceShape>,
  _board: BoardCell[][],
  cols: number,
  rows: number
): boolean {
  return placedPieces.every((p) => {
    const shape = pieceShapes[p.definitionId]
    if (!shape) return false
    const coords = getAbsoluteCoords(shape, p.origin, p.rotation)
    return isInBounds(coords, cols, rows)
  })
}
