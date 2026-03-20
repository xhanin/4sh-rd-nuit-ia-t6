// src/App.tsx
// Root component. Owns the DnD context and wires the store to the UI.

import { useEffect, useCallback } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'

import { useGameStore } from '@/store/gameStore'
import { useGameTimer } from '@/hooks/useGameTimer'
import { useWinDetection } from '@/hooks/useWinDetection'
import { useHint } from '@/hooks/useHint'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Sidebar } from '@/components/layout/Sidebar'
import { GameBoard } from '@/components/board/GameBoard'
import { GameDragOverlay } from '@/components/pieces/DragOverlay'
import { LevelCompleteModal } from '@/components/modals/LevelCompleteModal'
import { GameWonModal } from '@/components/modals/GameWonModal'
import { HintModal } from '@/components/modals/HintModal'

import { PIECE_MAP } from '@/constants/pieces'
import { getLevelConfig } from '@/constants/levels'
import { getAbsoluteCoords } from '@/game/geometry'
import type { Rotation } from '@/types'

import styles from './App.module.css'

export default function App() {
  // Store state
  const currentLevel = useGameStore((s) => s.currentLevel)
  const board = useGameStore((s) => s.board)
  const placedPieces = useGameStore((s) => s.placedPieces)
  const inventoryPieceIds = useGameStore((s) => s.inventoryPieceIds)
  const gameStatus = useGameStore((s) => s.gameStatus)
  const selectedPieceId = useGameStore((s) => s.selectedPieceId)
  const selectedRotation = useGameStore((s) => s.selectedRotation)
  const elapsedMs = useGameStore((s) => s.elapsedMs)

  // Store actions
  const placePiece = useGameStore((s) => s.placePiece)
  const selectPiece = useGameStore((s) => s.selectPiece)
  const rotateSelected = useGameStore((s) => s.rotateSelected)
  const startTimer = useGameStore((s) => s.startTimer)
  const restartLevel = useGameStore((s) => s.restartLevel)
  const restartGame = useGameStore((s) => s.restartGame)
  const advanceToNextLevel = useGameStore((s) => s.advanceToNextLevel)
  const validateBoard = useGameStore((s) => s.validateBoard)

  // Hooks
  useGameTimer()
  useWinDetection()
  const { activeHint, requestHint, dismissHint } = useHint()

  const levelConfig = getLevelConfig(currentLevel)

  // Keyboard shortcut: R to rotate selected piece
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        if (selectedPieceId) rotateSelected()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedPieceId, rotateSelected])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  )

  const handleDragStart = useCallback(
    (_event: DragStartEvent) => {
      startTimer()
    },
    [startTimer]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return

      // Parse drop target cell
      const overData = over.data.current as { x: number; y: number } | undefined
      if (!overData) return

      // Parse drag source
      const activeData = active.data.current as {
        type: string
        definitionId: string
        rotation: Rotation
      } | undefined
      if (!activeData) return

      const { definitionId, rotation } = activeData
      const def = PIECE_MAP[definitionId]
      if (!def) return

      // Use drop target cell as origin (top-left of piece shape).
      // TODO (Iteration 4): compute offset from pointer position within piece shape
      // for more natural placement UX.
      const origin = { x: overData.x, y: overData.y }

      // Validate bounds before committing
      const coords = getAbsoluteCoords(def.baseShape, origin, rotation)
      const inBounds = coords.every(
        (c) => c.x >= 0 && c.x < levelConfig.cols && c.y >= 0 && c.y < levelConfig.rows
      )
      if (!inBounds) return

      placePiece(definitionId, rotation, origin)
      selectPiece(null)
    },
    [placePiece, selectPiece, levelConfig]
  )

  // Hint highlighted cells
  const highlightedCells = activeHint
    ? (() => {
        const def = PIECE_MAP[activeHint.pieceId]
        if (!def) return []
        return getAbsoluteCoords(def.baseShape, activeHint.origin, activeHint.rotation)
      })()
    : []

  const levelName = getLevelConfig(currentLevel).name

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.app}>
        <Header />

        <main className={styles.main}>
          <GameBoard
            level={currentLevel}
            cols={levelConfig.cols}
            rows={levelConfig.rows}
            board={board}
            placedPieces={placedPieces}
            highlightedCells={highlightedCells}
          />
        </main>

        <Sidebar
          inventoryPieceIds={inventoryPieceIds}
          selectedPieceId={selectedPieceId}
          selectedRotation={selectedRotation}
          onSelectPiece={selectPiece}
          onRotatePiece={rotateSelected}
        />

        <Footer
          onRestart={restartLevel}
          onHint={requestHint}
          onValidate={validateBoard}
        />

        {/* Modals */}
        <LevelCompleteModal
          isOpen={gameStatus === 'level_complete'}
          levelName={levelName}
          onNextLevel={advanceToNextLevel}
        />
        <GameWonModal
          isOpen={gameStatus === 'game_won'}
          totalElapsedMs={elapsedMs}
          onRestart={restartGame}
        />
        <HintModal
          isOpen={activeHint !== null}
          hint={activeHint}
          onDismiss={dismissHint}
        />

        <GameDragOverlay activeId={null} rotation={selectedRotation} />
      </div>
    </DndContext>
  )
}
