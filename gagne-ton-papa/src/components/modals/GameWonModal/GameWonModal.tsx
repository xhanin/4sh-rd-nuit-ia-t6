// src/components/modals/GameWonModal/GameWonModal.tsx

import { formatMs } from '@/game/timer'
import styles from './GameWonModal.module.css'

interface GameWonModalProps {
  isOpen: boolean
  totalElapsedMs: number
  onRestart: () => void
}

export function GameWonModal({ isOpen, totalElapsedMs, onRestart }: GameWonModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.emoji}>🏆</div>
        <h2 className={styles.title}>Bravo !</h2>
        <p className={styles.subtitle}>Tu as gagné ton papa !</p>
        <div className={styles.time}>{formatMs(totalElapsedMs)}</div>
        <button className={styles.btn} onClick={onRestart}>
          Rejouer ↺
        </button>
      </div>
    </div>
  )
}
