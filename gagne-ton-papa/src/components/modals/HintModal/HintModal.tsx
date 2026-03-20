// src/components/modals/HintModal/HintModal.tsx

import type { ActiveHint } from '@/types'
import { PIECE_MAP } from '@/constants/pieces'
import { PieceThumbnail } from '@/components/pieces/PieceThumbnail'
import styles from './HintModal.module.css'

interface HintModalProps {
  isOpen: boolean
  hint: ActiveHint | null
  onDismiss: () => void
}

export function HintModal({ isOpen, hint, onDismiss }: HintModalProps) {
  if (!isOpen) return null

  const def = hint ? PIECE_MAP[hint.pieceId] : null

  return (
    <div className={styles.overlay} onClick={onDismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Indice 💡</h2>
        {hint && def ? (
          <>
            <p className={styles.text}>
              Place la pièce <strong>{def.name}</strong> à la colonne {hint.origin.x + 1}, ligne {hint.origin.y + 1}
            </p>
            <div className={styles.preview}>
              <PieceThumbnail
                shape={def.baseShape}
                color={def.color}
                rotation={hint.rotation}
                cellSize={28}
              />
            </div>
          </>
        ) : (
          <p className={styles.text}>Aucun placement possible pour l'instant.</p>
        )}
        <button className={styles.btn} onClick={onDismiss}>
          Compris !
        </button>
      </div>
    </div>
  )
}
