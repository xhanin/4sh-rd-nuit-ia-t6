// src/constants/levels.ts
// Level configurations sourced from puzzles.md.

import type { LevelConfig } from '@/types'

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    // puzzles.md — Niveau 1 : L'approche classique
    // Solution:
    //   5  E  E  7  7
    //   5  E  E  7  V1
    //   5  5  5  7  7
    level: 1,
    name: 'Niveau 1',
    cols: 5,
    rows: 3,
    pieceIds: ['5', '7', 'E', 'V1'],
  },
]

/** Returns the config for a given 1-based level number, or throws. */
export function getLevelConfig(level: number): LevelConfig {
  const config = LEVEL_CONFIGS.find((c) => c.level === level)
  if (!config) throw new Error(`No config for level ${level}`)
  return config
}

export const MAX_LEVEL = LEVEL_CONFIGS.length
