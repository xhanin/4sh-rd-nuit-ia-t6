// src/game/geometry.ts
// Pure coordinate math for pieces. No React, no state.

import type { CellCoord, PieceShape, Rotation } from '@/types'

/**
 * Normalize a shape so its minimum x and y are both 0.
 */
export function normalizeShape(shape: PieceShape): PieceShape {
  const minX = Math.min(...shape.map((c) => c.x))
  const minY = Math.min(...shape.map((c) => c.y))
  return shape.map((c) => ({ x: c.x - minX, y: c.y - minY }))
}

/**
 * Rotate a shape by the given degrees clockwise.
 * Formula for 90° CW: (x, y) -> (maxY - y, x)
 */
export function rotatePiece(shape: PieceShape, rotation: Rotation): PieceShape {
  let rotated: PieceShape = shape

  const steps = rotation / 90
  for (let i = 0; i < steps; i++) {
    const maxY = Math.max(...rotated.map((c) => c.y))
    rotated = rotated.map((c) => ({ x: maxY - c.y, y: c.x }))
  }

  return normalizeShape(rotated)
}

/**
 * Convert relative shape coordinates to absolute board coordinates.
 * Applies rotation first, then adds the origin offset.
 */
export function getAbsoluteCoords(
  shape: PieceShape,
  origin: CellCoord,
  rotation: Rotation
): CellCoord[] {
  const rotated = rotatePiece(shape, rotation)
  return rotated.map((c) => ({ x: c.x + origin.x, y: c.y + origin.y }))
}

/**
 * Return all 4 unique rotations of a shape (deduplicates identical ones).
 */
export function getUniqueRotations(shape: PieceShape): Array<{ rotation: Rotation; shape: PieceShape }> {
  const rotations: Rotation[] = [0, 90, 180, 270]
  const seen = new Set<string>()
  const result: Array<{ rotation: Rotation; shape: PieceShape }> = []

  for (const rotation of rotations) {
    const rotated = rotatePiece(shape, rotation)
    const key = rotated
      .slice()
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .map((c) => `${c.x},${c.y}`)
      .join('|')
    if (!seen.has(key)) {
      seen.add(key)
      result.push({ rotation, shape: rotated })
    }
  }

  return result
}
