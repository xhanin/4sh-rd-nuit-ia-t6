// src/components/pieces/PieceThumbnail/PieceThumbnail.tsx
// Renders a mini CSS-grid preview of a piece shape at a given rotation.

import { rotatePiece } from '@/game/geometry'
import type { PieceShape, Rotation } from '@/types'
import styles from './PieceThumbnail.module.css'

interface PieceThumbnailProps {
  shape: PieceShape
  color: string
  rotation: Rotation
  /** Size of each mini cell in px (default 16) */
  cellSize?: number
}

export function PieceThumbnail({
  shape,
  color,
  rotation,
  cellSize = 16,
}: PieceThumbnailProps) {
  const rotated = rotatePiece(shape, rotation)
  const maxX = Math.max(...rotated.map((c) => c.x))
  const maxY = Math.max(...rotated.map((c) => c.y))
  const cols = maxX + 1
  const rows = maxY + 1

  const occupied = new Set(rotated.map((c) => `${c.x},${c.y}`))

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        width: cols * cellSize,
        height: rows * cellSize,
      }}
    >
      {Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => (
          <div
            key={`${x}-${y}`}
            className={styles.cell}
            style={
              occupied.has(`${x},${y}`)
                ? { backgroundColor: color, borderRadius: cellSize * 0.2 }
                : {}
            }
          />
        ))
      )}
    </div>
  )
}
