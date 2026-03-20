// src/components/board/LevelIndicator/LevelIndicator.tsx

import { LEVEL_CONFIGS } from '@/constants/levels'
import styles from './LevelIndicator.module.css'

interface LevelIndicatorProps {
  currentLevel: number
}

export function LevelIndicator({ currentLevel }: LevelIndicatorProps) {
  return (
    <div className={styles.container}>
      {LEVEL_CONFIGS.map((config) => (
        <div
          key={config.level}
          className={`${styles.tab} ${config.level === currentLevel ? styles.active : ''} ${config.level < currentLevel ? styles.done : ''}`}
          aria-current={config.level === currentLevel ? 'step' : undefined}
        >
          {config.name}
        </div>
      ))}
    </div>
  )
}
