// src/store/settingsStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  soundEnabled: boolean
  toggleSound: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    { name: 'gagne-ton-papa-settings' }
  )
)
