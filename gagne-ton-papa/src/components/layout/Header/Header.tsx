// src/components/layout/Header/Header.tsx

import { useGameStore } from '@/store/gameStore'
import { useLeaderboardStore } from '@/store/leaderboardStore'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { formatMs } from '@/game/timer'
import styles from './Header.module.css'

export function Header() {
  const elapsedMs = useGameStore((s) => s.elapsedMs)
  const timerStarted = useGameStore((s) => s.timerStarted)
  const gameStatus = useGameStore((s) => s.gameStatus)
  const bestEntry = useLeaderboardStore((s) => s.entries.length > 0 ? s.entries[0] : null)

  const isRunning = timerStarted && gameStatus === 'playing'

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>AMAMICOULAS</h1>
      <div className={styles.actions}>
        {bestEntry !== null && (
          <div className={styles.record}>
            <span className={styles.recordLabel}>Record</span>
            <span className={styles.recordName}>{bestEntry.playerName}</span>
            <span className={styles.recordTime}>{formatMs(bestEntry.elapsedMs)}</span>
          </div>
        )}
        <TimerDisplay elapsedMs={elapsedMs} isRunning={isRunning} />
        <button className={styles.iconBtn} aria-label="Paramètres">
          ⚙
        </button>
      </div>
    </header>
  )
}
