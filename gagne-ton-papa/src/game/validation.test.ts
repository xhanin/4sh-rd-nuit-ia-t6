// src/game/validation.test.ts

import { describe, it, expect } from 'vitest'
import { isInBounds, hasOverlap, checkPlacement, checkWin } from './validation'
import { buildEmptyBoard, applyPlacement } from './board'
import type { PieceShape } from '@/types'

const SINGLE: PieceShape = [{ x: 0, y: 0 }]
const TWO_WIDE: PieceShape = [{ x: 0, y: 0 }, { x: 1, y: 0 }]

describe('isInBounds', () => {
  it('accepts coords fully inside 3x5', () => {
    expect(isInBounds([{ x: 0, y: 0 }, { x: 2, y: 4 }], 3, 5)).toBe(true)
  })
  it('rejects x out of range', () => {
    expect(isInBounds([{ x: 3, y: 0 }], 3, 5)).toBe(false)
  })
  it('rejects y out of range', () => {
    expect(isInBounds([{ x: 0, y: 5 }], 3, 5)).toBe(false)
  })
  it('rejects negative coords', () => {
    expect(isInBounds([{ x: -1, y: 0 }], 3, 5)).toBe(false)
  })
})

describe('hasOverlap', () => {
  it('returns false on empty board', () => {
    const board = buildEmptyBoard(3, 5)
    expect(hasOverlap([{ x: 0, y: 0 }], board)).toBe(false)
  })

  it('returns true when a cell is already occupied', () => {
    const board = applyPlacement(buildEmptyBoard(3, 5), SINGLE, { x: 1, y: 1 }, 0, 'A')
    expect(hasOverlap([{ x: 1, y: 1 }], board)).toBe(true)
  })

  it('ignores the piece with ignorePieceId', () => {
    const board = applyPlacement(buildEmptyBoard(3, 5), SINGLE, { x: 1, y: 1 }, 0, 'A')
    expect(hasOverlap([{ x: 1, y: 1 }], board, 'A')).toBe(false)
  })
})

describe('checkPlacement', () => {
  it('accepts a valid placement', () => {
    const board = buildEmptyBoard(3, 5)
    expect(checkPlacement(TWO_WIDE, { x: 0, y: 0 }, 0, board, 3, 5)).toBe(true)
  })

  it('rejects out-of-bounds placement', () => {
    const board = buildEmptyBoard(3, 5)
    expect(checkPlacement(TWO_WIDE, { x: 2, y: 0 }, 0, board, 3, 5)).toBe(false)
  })

  it('rejects overlapping placement', () => {
    let board = buildEmptyBoard(3, 5)
    board = applyPlacement(board, SINGLE, { x: 1, y: 0 }, 0, 'A')
    expect(checkPlacement(TWO_WIDE, { x: 0, y: 0 }, 0, board, 3, 5)).toBe(false)
  })
})

describe('checkWin', () => {
  it('returns false on empty board', () => {
    expect(checkWin(buildEmptyBoard(3, 5))).toBe(false)
  })

  it('returns true when all cells are filled', () => {
    // Fill a tiny 1x1 board
    const board = buildEmptyBoard(1, 1)
    const filled = applyPlacement(board, [{ x: 0, y: 0 }], { x: 0, y: 0 }, 0, 'A')
    expect(checkWin(filled)).toBe(true)
  })

  it('returns false when one cell remains empty', () => {
    // 2x1 board, fill only one cell
    const board = buildEmptyBoard(2, 1)
    const partial = applyPlacement(board, SINGLE, { x: 0, y: 0 }, 0, 'A')
    expect(checkWin(partial)).toBe(false)
  })
})
