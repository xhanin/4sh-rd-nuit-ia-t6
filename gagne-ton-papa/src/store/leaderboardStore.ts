// src/store/leaderboardStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LeaderboardEntry {
  playerName: string
  elapsedMs: number
  date: string // ISO string
}

interface LeaderboardStore {
  entries: LeaderboardEntry[]
  addEntry: (playerName: string, elapsedMs: number) => void
  getBestTime: () => number | null
}

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (playerName, elapsedMs) => {
        const entry: LeaderboardEntry = {
          playerName,
          elapsedMs,
          date: new Date().toISOString(),
        }
        set((state) => ({
          entries: [...state.entries, entry].sort((a, b) => a.elapsedMs - b.elapsedMs),
        }))
      },

      getBestTime: () => {
        const { entries } = get()
        if (entries.length === 0) return null
        return entries[0].elapsedMs
      },
    }),
    { name: 'gagne-ton-papa-leaderboard' }
  )
)
