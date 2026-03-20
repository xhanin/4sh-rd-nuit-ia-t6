// src/hooks/useGameTimer.ts
// Drives the game timer via setInterval.

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

const TICK_INTERVAL_MS = 100

export function useGameTimer() {
  const timerStarted = useGameStore((s) => s.timerStarted)
  const gameStatus = useGameStore((s) => s.gameStatus)
  const tickTimer = useGameStore((s) => s.tickTimer)

  const lastTickRef = useRef<number | null>(null)

  useEffect(() => {
    if (!timerStarted || gameStatus !== 'playing') {
      lastTickRef.current = null
      return
    }

    const id = setInterval(() => {
      const now = performance.now()
      if (lastTickRef.current !== null) {
        tickTimer(now - lastTickRef.current)
      }
      lastTickRef.current = now
    }, TICK_INTERVAL_MS)

    return () => clearInterval(id)
  }, [timerStarted, gameStatus, tickTimer])
}
