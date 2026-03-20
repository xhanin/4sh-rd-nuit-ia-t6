// src/components/modals/GameWonModal/GameWonModal.tsx

import { useState } from 'react'
import { formatMs } from '@/game/timer'
import { useLeaderboardStore } from '@/store/leaderboardStore'
import styles from './GameWonModal.module.css'

interface GameWonModalProps {
  isOpen: boolean
  totalElapsedMs: number
  onRestart: () => void
}

export function GameWonModal({ isOpen, totalElapsedMs, onRestart }: GameWonModalProps) {
  const [playerName, setPlayerName] = useState('')
  const [saved, setSaved] = useState(false)

  const addEntry = useLeaderboardStore((s) => s.addEntry)
  const entries = useLeaderboardStore((s) => s.entries)

  if (!isOpen) return null

  const handleSave = () => {
    const name = playerName.trim() || 'Anonyme'
    addEntry(name, totalElapsedMs)
    setSaved(true)
  }

  const handleRestart = () => {
    setPlayerName('')
    setSaved(false)
    onRestart()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !saved) handleSave()
  }

  // Show top 10
  const top10 = entries.slice(0, 10)

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.emoji}>🏆</div>
        <h2 className={styles.title}>Bravo !</h2>
        <p className={styles.subtitle}>Tu as gagné ton papa !</p>
        <div className={styles.time}>{formatMs(totalElapsedMs)}</div>

        {!saved ? (
          <div className={styles.nameForm}>
            <input
              className={styles.nameInput}
              type="text"
              placeholder="Ton prénom"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={20}
            />
            <button className={styles.saveBtn} onClick={handleSave}>
              Enregistrer
            </button>
          </div>
        ) : (
          <>
            {top10.length > 0 && (
              <div className={styles.leaderboard}>
                <h3 className={styles.leaderboardTitle}>Classement</h3>
                <div className={styles.entries}>
                  {top10.map((entry, i) => (
                    <div
                      key={`${entry.date}-${i}`}
                      className={`${styles.entry} ${entry.elapsedMs === totalElapsedMs && entry.playerName === (playerName.trim() || 'Anonyme') ? styles.entryCurrent : ''}`}
                    >
                      <span className={styles.rank}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                      </span>
                      <span className={styles.entryName}>{entry.playerName}</span>
                      <span className={styles.entryTime}>{formatMs(entry.elapsedMs)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className={styles.btn} onClick={handleRestart}>
              Rejouer ↺
            </button>
          </>
        )}
      </div>
    </div>
  )
}
