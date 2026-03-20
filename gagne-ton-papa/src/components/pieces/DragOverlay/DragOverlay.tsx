// src/components/pieces/DragOverlay/DragOverlay.tsx
// Ghost piece rendered during drag via @dnd-kit DragOverlay.

import { DragOverlay as DndDragOverlay } from '@dnd-kit/core'
import { PieceThumbnail } from '@/components/pieces/PieceThumbnail'
import { PIECE_MAP } from '@/constants/pieces'
import { CELL_SIZE } from '@/constants/grid'
import type { Rotation } from '@/types'

interface DragOverlayProps {
  activeId: string | null
  rotation: Rotation
}

export function GameDragOverlay({ activeId, rotation }: DragOverlayProps) {
  // activeId format: "inventory-{definitionId}"
  const definitionId = activeId?.replace(/^(inventory|board)-/, '') ?? null
  const def = definitionId ? PIECE_MAP[definitionId] : null

  return (
    <DndDragOverlay>
      {def ? (
        <div style={{ opacity: 0.85, pointerEvents: 'none' }}>
          <PieceThumbnail
            shape={def.baseShape}
            color={def.color}
            rotation={rotation}
            cellSize={CELL_SIZE}
          />
        </div>
      ) : null}
    </DndDragOverlay>
  )
}
