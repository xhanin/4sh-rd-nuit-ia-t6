// src/components/pieces/DraggablePiece/DraggablePiece.tsx

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { PieceThumbnail } from '@/components/pieces/PieceThumbnail'
import { PIECE_MAP } from '@/constants/pieces'
import type { Rotation } from '@/types'
import styles from './DraggablePiece.module.css'

interface DraggablePieceProps {
  definitionId: string
  rotation: Rotation
  isSelected: boolean
  onSelect: () => void
  onRotate: () => void
}

export function DraggablePiece({
  definitionId,
  rotation,
  isSelected,
  onSelect,
  onRotate,
}: DraggablePieceProps) {
  const def = PIECE_MAP[definitionId]
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `inventory-${definitionId}`,
    data: { type: 'inventory', definitionId, rotation },
  })

  if (!def) return null

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      className={`${styles.wrapper} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={onSelect}
      onContextMenu={(e) => { e.preventDefault(); onRotate() }}
      title={`${def.name} — clic droit pour tourner`}
    >
      <div
        ref={setNodeRef}
        style={style}
        className={styles.piece}
        {...listeners}
        {...attributes}
      >
        <PieceThumbnail
          shape={def.baseShape}
          color={def.color}
          rotation={rotation}
          cellSize={20}
        />
      </div>
      <button
        className={styles.rotateBtn}
        onClick={(e) => { e.stopPropagation(); onRotate() }}
        aria-label={`Tourner ${def.name}`}
      >
        ↻
      </button>
    </div>
  )
}
