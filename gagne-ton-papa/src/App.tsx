// src/App.tsx
// Root component. Owns the DnD context and wires the store to the UI.

import { useEffect, useCallback, useState, useRef } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
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
import { HomeScreen } from '@/components/HomeScreen/HomeScreen'

import { PIECE_MAP } from '@/constants/pieces'
import { getLevelConfig } from '@/constants/levels'
import { getAbsoluteCoords } from '@/game/geometry'
import { checkPlacement } from '@/game/validation'
import type { Rotation, CellCoord } from '@/types'

import styles from './App.module.css'

// 20px cell + 2px gap in the inventory thumbnail
const THUMBNAIL_CELL = 22

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

  // App navigation state
  const [screen, setScreen] = useState<'home' | 'game'>('home')

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

  // Local drag state
  const [activeDrag, setActiveDrag] = useState<{
    definitionId: string
    rotation: Rotation
  } | null>(null)

  // Offset (in grid cells) between pointer position and top-left of piece shape
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const [previewPlacement, setPreviewPlacement] = useState<{
    cells: CellCoord[]
    color: string
    isValid: boolean
  } | null>(null)

  // Audio refs
  const gameAudioRef = useRef<HTMLAudioElement>(null)
  const winAudioRef = useRef<HTMLAudioElement>(null)
  const prevScreenRef = useRef(screen)
  const prevLevelRef = useRef(currentLevel)

  // Audio control logic
  useEffect(() => {
    if (screen !== 'game') {
      gameAudioRef.current?.pause()
      winAudioRef.current?.pause()
      prevScreenRef.current = screen
      prevLevelRef.current = currentLevel
      return
    }

    const justEnteredGame = prevScreenRef.current !== 'game'
    const changedLevel = prevLevelRef.current !== currentLevel

    if (gameStatus === 'level_complete' || gameStatus === 'game_won') {
      gameAudioRef.current?.pause()
      if (winAudioRef.current) {
        winAudioRef.current.currentTime = 0
        winAudioRef.current.play().catch(console.warn)
      }
    } else {
      if (justEnteredGame || changedLevel) {
        if (gameAudioRef.current) {
          gameAudioRef.current.currentTime = 0
        }
      }
      gameAudioRef.current?.play().catch(console.warn)
    }

    prevScreenRef.current = screen
    prevLevelRef.current = currentLevel
  }, [screen, gameStatus, currentLevel])

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
    (event: DragStartEvent) => {
      startTimer()
      const data = event.active.data.current as {
        type: string
        definitionId: string
        rotation: Rotation
      } | undefined
      if (data) {
        setActiveDrag({ definitionId: data.definitionId, rotation: data.rotation })

        // Compute pointer offset within the piece thumbnail
        const initialRect = event.active.rect.current.initial
        const activatorEvent = event.activatorEvent as PointerEvent
        if (initialRect) {
          const relX = activatorEvent.clientX - initialRect.left
          const relY = activatorEvent.clientY - initialRect.top
          dragOffsetRef.current = {
            x: Math.max(0, Math.floor(relX / THUMBNAIL_CELL)),
            y: Math.max(0, Math.floor(relY / THUMBNAIL_CELL)),
          }
        } else {
          dragOffsetRef.current = { x: 0, y: 0 }
        }
      }
    },
    [startTimer]
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const activeData = event.active.data.current as {
        type: string
        definitionId: string
        rotation: Rotation
      } | undefined
      if (!activeData) { setPreviewPlacement(null); return }

      const overData = event.over?.data.current as { x: number; y: number } | undefined
      if (!overData) { setPreviewPlacement(null); return }

      const def = PIECE_MAP[activeData.definitionId]
      if (!def) { setPreviewPlacement(null); return }

      const origin = { x: overData.x - dragOffsetRef.current.x, y: overData.y - dragOffsetRef.current.y }
      const cells = getAbsoluteCoords(def.baseShape, origin, activeData.rotation)
      const isValid = checkPlacement(
        def.baseShape,
        origin,
        activeData.rotation,
        board,
        levelConfig.cols,
        levelConfig.rows
      )
      setPreviewPlacement({ cells, color: def.color, isValid })
    },
    [board, levelConfig]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null)
      setPreviewPlacement(null)

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

      // Subtract pointer offset so the piece cell under the cursor lands on the hovered cell
      const origin = { x: overData.x - dragOffsetRef.current.x, y: overData.y - dragOffsetRef.current.y }

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

  if (screen === 'home') {
    return <HomeScreen onPlay={() => setScreen('game')} />
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
            previewPlacement={previewPlacement}
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

        <GameDragOverlay
          activeId={activeDrag ? `inventory-${activeDrag.definitionId}` : null}
          rotation={activeDrag?.rotation ?? 0}
        />

        <audio ref={gameAudioRef} src="/game.mp3" loop />
        <audio ref={winAudioRef} src="/winwin.mov" />
      </div>
    </DndContext>
  )
}
