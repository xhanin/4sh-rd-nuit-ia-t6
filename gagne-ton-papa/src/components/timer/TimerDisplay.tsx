// src/components/timer/TimerDisplay.tsx

import { formatMs } from '@/game/timer'
import styles from './TimerDisplay.module.css'

interface TimerDisplayProps {
  elapsedMs: number
  isRunning: boolean
}

export function TimerDisplay({ elapsedMs, isRunning }: TimerDisplayProps) {
  return (
    <span className={`${styles.timer} ${isRunning ? styles.running : ''}`}>
      {formatMs(elapsedMs)}
    </span>
  )
}
