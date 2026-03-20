// src/components/modals/LevelCompleteModal/LevelCompleteModal.tsx

import styles from './LevelCompleteModal.module.css'

interface LevelCompleteModalProps {
  isOpen: boolean
  levelName: string
  onNextLevel: () => void
}

export function LevelCompleteModal({ isOpen, levelName, onNextLevel }: LevelCompleteModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.emoji}>🎉</div>
        <h2 className={styles.title}>Niveau terminé !</h2>
        <p className={styles.subtitle}>{levelName} complété</p>
        <button className={styles.btn} onClick={onNextLevel}>
          Niveau suivant →
        </button>
      </div>
    </div>
  )
}
