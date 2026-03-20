// src/components/pieces/PlacedPieceLayer/PlacedPieceLayer.tsx
// Renders all placed pieces as colored overlays on top of the board grid.

import { PIECE_MAP } from '@/constants/pieces'
import { CELL_SIZE, CELL_GAP } from '@/constants/grid'
import { getAbsoluteCoords } from '@/game/geometry'
import type { PlacedPiece } from '@/types'
import styles from './PlacedPieceLayer.module.css'

interface PlacedPieceLayerProps {
  placedPieces: PlacedPiece[]
}

export function PlacedPieceLayer({ placedPieces }: PlacedPieceLayerProps) {
  return (
    <div className={styles.layer}>
      {placedPieces.map((p) => {
        const def = PIECE_MAP[p.definitionId]
        if (!def) return null
        const coords = getAbsoluteCoords(def.baseShape, p.origin, p.rotation)

        return coords.map(({ x, y }) => (
          <div
            key={`${p.definitionId}-${x}-${y}`}
            className={styles.cell}
            style={{
              left: x * (CELL_SIZE + CELL_GAP),
              top: y * (CELL_SIZE + CELL_GAP),
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: def.color,
            }}
          />
        ))
      })}
    </div>
  )
}
