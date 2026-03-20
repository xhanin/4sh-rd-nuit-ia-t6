// src/components/board/GameBoard/GameBoard.tsx

import { BoardCell } from '@/components/board/BoardCell'
import { PlacedPieceLayer } from '@/components/pieces/PlacedPieceLayer'
import { LevelIndicator } from '@/components/board/LevelIndicator'
import { CELL_SIZE, CELL_GAP } from '@/constants/grid'
import type { BoardCell as BoardCellType, PlacedPiece, CellCoord } from '@/types'
import styles from './GameBoard.module.css'

interface GameBoardProps {
  level: number
  cols: number
  rows: number
  board: BoardCellType[][]
  placedPieces: PlacedPiece[]
  highlightedCells?: CellCoord[]
  previewPlacement?: { cells: CellCoord[]; color: string; isValid: boolean } | null
}

export function GameBoard({
  level,
  cols,
  rows,
  board,
  placedPieces,
  highlightedCells = [],
  previewPlacement,
}: GameBoardProps) {
  const highlightSet = new Set(highlightedCells.map((c) => `${c.x},${c.y}`))

  const boardWidth = cols * CELL_SIZE + (cols - 1) * CELL_GAP
  const boardHeight = rows * CELL_SIZE + (rows - 1) * CELL_GAP

  return (
    <div className={styles.container}>
      <LevelIndicator currentLevel={level} />

      <div className={styles.boardWrapper} style={{ width: boardWidth, height: boardHeight }}>
        {/* Drop targets grid */}
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
            gap: CELL_GAP,
          }}
        >
          {board.flatMap((row) =>
            row.map((cell) => (
              <BoardCell
                key={`${cell.x}-${cell.y}`}
                x={cell.x}
                y={cell.y}
                isOccupied={cell.placedPieceId !== null}
                isHighlighted={highlightSet.has(`${cell.x},${cell.y}`)}
              />
            ))
          )}
        </div>

        {/* Colored piece overlays */}
        <PlacedPieceLayer placedPieces={placedPieces} />

        {/* Drag preview */}
        {previewPlacement && (
          <div className={styles.previewLayer}>
            {previewPlacement.cells.map(({ x, y }) => (
              <div
                key={`preview-${x}-${y}`}
                className={styles.previewCell}
                style={{
                  left: x * (CELL_SIZE + CELL_GAP),
                  top: y * (CELL_SIZE + CELL_GAP),
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: previewPlacement.color,
                  opacity: previewPlacement.isValid ? 0.6 : 0.3,
                  outline: previewPlacement.isValid
                    ? '2px solid rgba(255,255,255,0.7)'
                    : '2px solid rgba(220,50,50,0.7)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
