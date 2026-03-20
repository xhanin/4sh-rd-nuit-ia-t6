// src/game/geometry.test.ts

import { describe, it, expect } from 'vitest'
import { rotatePiece, getAbsoluteCoords, normalizeShape } from './geometry'
import type { PieceShape } from '@/types'

// Simple L-shape for tests:
// X
// X
// X X
const L_SHAPE: PieceShape = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
]

describe('normalizeShape', () => {
  it('shifts shape so min x and y are 0', () => {
    const shifted: PieceShape = [{ x: 2, y: 3 }, { x: 3, y: 3 }]
    const result = normalizeShape(shifted)
    expect(result).toEqual([{ x: 0, y: 0 }, { x: 1, y: 0 }])
  })
})

describe('rotatePiece', () => {
  it('0° returns normalized original shape', () => {
    const result = rotatePiece(L_SHAPE, 0)
    expect(result).toEqual(L_SHAPE)
  })

  it('90° CW: (x,y) → (maxY-y, x)', () => {
    // L rotated 90° CW:
    // X X X
    // X
    const result = rotatePiece(L_SHAPE, 90)
    const set = new Set(result.map((c) => `${c.x},${c.y}`))
    expect(set.has('0,0')).toBe(true)
    expect(set.has('1,0')).toBe(true)
    expect(set.has('2,0')).toBe(true)
    expect(set.has('0,1')).toBe(true)
    expect(result).toHaveLength(4)
  })

  it('180° is double 90°', () => {
    const once = rotatePiece(L_SHAPE, 90)
    const twice = rotatePiece(once, 90)
    const direct = rotatePiece(L_SHAPE, 180)
    expect(normalizeShape(direct)).toEqual(normalizeShape(twice))
  })

  it('360° (four 90° rotations) returns original shape', () => {
    const r = rotatePiece(rotatePiece(rotatePiece(rotatePiece(L_SHAPE, 90), 90), 90), 90)
    expect(r).toEqual(normalizeShape(L_SHAPE))
  })
})

describe('getAbsoluteCoords', () => {
  it('adds origin offset to relative coords at rotation 0', () => {
    const result = getAbsoluteCoords(L_SHAPE, { x: 1, y: 2 }, 0)
    expect(result).toContainEqual({ x: 1, y: 2 })
    expect(result).toContainEqual({ x: 1, y: 3 })
    expect(result).toContainEqual({ x: 1, y: 4 })
    expect(result).toContainEqual({ x: 2, y: 4 })
  })

  it('rotates then offsets', () => {
    const rotated90 = rotatePiece(L_SHAPE, 90)
    const withOrigin = getAbsoluteCoords(L_SHAPE, { x: 0, y: 0 }, 90)
    expect(withOrigin).toEqual(rotated90)
  })
})
