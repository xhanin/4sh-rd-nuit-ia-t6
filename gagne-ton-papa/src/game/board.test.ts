// src/game/board.test.ts

import { describe, it, expect } from 'vitest'
import { buildEmptyBoard, applyPlacement, removePieceFromBoard } from './board'
import type { PieceShape } from '@/types'

const DOT: PieceShape = [{ x: 0, y: 0 }]
const TWO_DOWN: PieceShape = [{ x: 0, y: 0 }, { x: 0, y: 1 }]

describe('buildEmptyBoard', () => {
  it('creates a cols×rows grid, all null', () => {
    const board = buildEmptyBoard(3, 5)
    expect(board).toHaveLength(5)
    expect(board[0]).toHaveLength(3)
    expect(board[0][0]).toEqual({ x: 0, y: 0, placedPieceId: null })
    expect(board[4][2]).toEqual({ x: 2, y: 4, placedPieceId: null })
  })
})

describe('applyPlacement', () => {
  it('marks the correct cells with the piece id', () => {
    const board = buildEmptyBoard(3, 5)
    const next = applyPlacement(board, DOT, { x: 1, y: 2 }, 0, 'P')
    expect(next[2][1].placedPieceId).toBe('P')
  })

  it('does not mutate the original board', () => {
    const board = buildEmptyBoard(3, 5)
    applyPlacement(board, DOT, { x: 0, y: 0 }, 0, 'P')
    expect(board[0][0].placedPieceId).toBeNull()
  })

  it('handles rotation', () => {
    // TWO_DOWN rotated 90° CW becomes TWO_RIGHT: (0,0),(1,0)
    const board = buildEmptyBoard(3, 5)
    const next = applyPlacement(board, TWO_DOWN, { x: 0, y: 0 }, 90, 'P')
    expect(next[0][0].placedPieceId).toBe('P')
    expect(next[0][1].placedPieceId).toBe('P')
  })
})

describe('removePieceFromBoard', () => {
  it('clears all cells belonging to the piece', () => {
    let board = buildEmptyBoard(3, 5)
    board = applyPlacement(board, TWO_DOWN, { x: 0, y: 0 }, 0, 'P')
    const cleared = removePieceFromBoard(board, 'P')
    expect(cleared[0][0].placedPieceId).toBeNull()
    expect(cleared[1][0].placedPieceId).toBeNull()
  })

  it('does not affect other pieces', () => {
    let board = buildEmptyBoard(3, 5)
    board = applyPlacement(board, DOT, { x: 0, y: 0 }, 0, 'A')
    board = applyPlacement(board, DOT, { x: 1, y: 0 }, 0, 'B')
    const cleared = removePieceFromBoard(board, 'A')
    expect(cleared[0][1].placedPieceId).toBe('B')
  })
})
