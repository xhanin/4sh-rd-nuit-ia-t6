// src/store/gameStore.ts

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Rotation, CellCoord } from '@/types'
import type { GameState, ActiveHint } from '@/types'
import { getLevelConfig, MAX_LEVEL } from '@/constants/levels'
import { PIECE_MAP } from '@/constants/pieces'
import { buildEmptyBoard, applyPlacement, removePieceFromBoard } from '@/game/board'
import { checkPlacement, checkWin } from '@/game/validation'
import { computeHint } from '@/game/hints'

function buildInitialLevelState(level: number): Pick<
  GameState,
  'currentLevel' | 'board' | 'placedPieces' | 'inventoryPieceIds' | 'gameStatus' | 'selectedPieceId' | 'selectedRotation' | 'activeHint'
> {
  const config = getLevelConfig(level)
  return {
    currentLevel: level,
    board: buildEmptyBoard(config.cols, config.rows),
    placedPieces: [],
    inventoryPieceIds: [...config.pieceIds],
    gameStatus: 'idle',
    selectedPieceId: null,
    selectedRotation: 0,
    activeHint: null,
  }
}

interface GameStore extends GameState {
  // Level management
  initLevel: (level: number) => void
  advanceToNextLevel: () => void

  // Board mutations
  placePiece: (definitionId: string, rotation: Rotation, origin: CellCoord) => boolean
  removePiece: (definitionId: string) => void

  // Selection & rotation
  selectPiece: (id: string | null) => void
  rotateSelected: () => void

  // Timer
  startTimer: () => void
  tickTimer: (deltaMs: number) => void
  stopTimer: () => void

  // Game flow
  validateBoard: () => void
  restartLevel: () => void
  restartGame: () => void

  // Hint
  requestHint: () => void
  dismissHint: () => void
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...buildInitialLevelState(1),
    timerStarted: false,
    elapsedMs: 0,

    initLevel: (level) => {
      set((state) => {
        Object.assign(state, buildInitialLevelState(level))
      })
    },

    advanceToNextLevel: () => {
      const { currentLevel, elapsedMs } = get()
      if (currentLevel >= MAX_LEVEL) return
      set((state) => {
        const next = buildInitialLevelState(currentLevel + 1)
        Object.assign(state, next)
        // Preserve the running timer
        state.elapsedMs = elapsedMs
        state.timerStarted = true
        state.gameStatus = 'playing'
      })
    },

    placePiece: (definitionId, rotation, origin) => {
      const { board } = get()
      const def = PIECE_MAP[definitionId]
      if (!def) return false
      const config = getLevelConfig(get().currentLevel)
      const isValid = checkPlacement(
        def.baseShape,
        origin,
        rotation,
        board,
        config.cols,
        config.rows,
        definitionId
      )
      if (!isValid) return false

      set((state) => {
        // Remove from inventory or from placed list (re-placement)
        state.inventoryPieceIds = state.inventoryPieceIds.filter(
          (id) => id !== definitionId
        )
        state.placedPieces = state.placedPieces.filter(
          (p) => p.definitionId !== definitionId
        )
        // Clear any previous cells for this piece
        const cleaned = removePieceFromBoard(state.board as ReturnType<typeof buildEmptyBoard>, definitionId)
        // Apply new placement
        state.board = applyPlacement(cleaned, def.baseShape, origin, rotation, definitionId)
        state.placedPieces.push({ definitionId, rotation, origin })
        if (state.gameStatus === 'idle') state.gameStatus = 'playing'
      })
      // Trigger win detection after placement
      get().validateBoard()
      return true
    },

    removePiece: (definitionId) => {
      set((state) => {
        state.board = removePieceFromBoard(
          state.board as ReturnType<typeof buildEmptyBoard>,
          definitionId
        )
        state.placedPieces = state.placedPieces.filter(
          (p) => p.definitionId !== definitionId
        )
        if (!state.inventoryPieceIds.includes(definitionId)) {
          state.inventoryPieceIds.push(definitionId)
        }
      })
    },

    selectPiece: (id) => {
      set((state) => {
        state.selectedPieceId = id
        if (id !== null) state.selectedRotation = 0
      })
    },

    rotateSelected: () => {
      set((state) => {
        const next = ((state.selectedRotation + 90) % 360) as Rotation
        state.selectedRotation = next
      })
    },

    startTimer: () => {
      set((state) => {
        if (!state.timerStarted) {
          state.timerStarted = true
          state.gameStatus = 'playing'
        }
      })
    },

    tickTimer: (deltaMs) => {
      set((state) => {
        if (state.timerStarted && state.gameStatus === 'playing') {
          state.elapsedMs += deltaMs
        }
      })
    },

    stopTimer: () => {
      set((state) => {
        state.timerStarted = false
      })
    },

    validateBoard: () => {
      const { board, inventoryPieceIds, currentLevel } = get()
      if (inventoryPieceIds.length > 0) return
      const won = checkWin(board)
      if (!won) return
      set((state) => {
        if (currentLevel >= MAX_LEVEL) {
          state.gameStatus = 'game_won'
          state.timerStarted = false
        } else {
          state.gameStatus = 'level_complete'
        }
      })
    },

    restartLevel: () => {
      const { currentLevel, elapsedMs } = get()
      set((state) => {
        const reset = buildInitialLevelState(currentLevel)
        Object.assign(state, reset)
        state.elapsedMs = elapsedMs
        state.timerStarted = true
        state.gameStatus = 'playing'
      })
    },

    restartGame: () => {
      set((state) => {
        Object.assign(state, buildInitialLevelState(1))
        state.elapsedMs = 0
        state.timerStarted = false
      })
    },

    requestHint: () => {
      const { inventoryPieceIds, board, currentLevel } = get()
      if (inventoryPieceIds.length === 0) return
      const pieceId = inventoryPieceIds[0]
      const def = PIECE_MAP[pieceId]
      if (!def) return
      const config = getLevelConfig(currentLevel)
      const hint = computeHint(pieceId, def.baseShape, board, config.cols, config.rows)
      set((state) => {
        state.activeHint = hint as ActiveHint | null
      })
    },

    dismissHint: () => {
      set((state) => {
        state.activeHint = null
      })
    },
  }))
)
