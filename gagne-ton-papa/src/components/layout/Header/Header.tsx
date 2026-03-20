// src/components/layout/Header/Header.tsx

import { useGameStore } from '@/store/gameStore'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import styles from './Header.module.css'

export function Header() {
  const elapsedMs = useGameStore((s) => s.elapsedMs)
  const timerStarted = useGameStore((s) => s.timerStarted)
  const gameStatus = useGameStore((s) => s.gameStatus)

  const isRunning = timerStarted && gameStatus === 'playing'

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>AMAMICOULAS</h1>
      <div className={styles.actions}>
        <TimerDisplay elapsedMs={elapsedMs} isRunning={isRunning} />
        <button className={styles.iconBtn} aria-label="Paramètres">
          ⚙
        </button>
      </div>
    </header>
  )
}
