// src/components/layout/Sidebar/Sidebar.tsx

import { DraggablePiece } from '@/components/pieces/DraggablePiece'
import type { Rotation } from '@/types'
import styles from './Sidebar.module.css'

interface SidebarProps {
  inventoryPieceIds: string[]
  selectedPieceId: string | null
  selectedRotation: Rotation
  onSelectPiece: (id: string) => void
  onRotatePiece: () => void
}

export function Sidebar({
  inventoryPieceIds,
  selectedPieceId,
  selectedRotation,
  onSelectPiece,
  onRotatePiece,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>INVENTAIRE</span>
        <span className={styles.subtitle}>Solo Edition</span>
      </div>

      <div className={styles.pieces}>
        {inventoryPieceIds.map((id) => (
          <DraggablePiece
            key={id}
            definitionId={id}
            rotation={selectedPieceId === id ? selectedRotation : 0}
            isSelected={selectedPieceId === id}
            onSelect={() => onSelectPiece(id)}
            onRotate={() => { if (selectedPieceId !== id) onSelectPiece(id); onRotatePiece() }}
          />
        ))}
        {inventoryPieceIds.length === 0 && (
          <p className={styles.empty}>Toutes les pièces placées !</p>
        )}
      </div>
    </aside>
  )
}
