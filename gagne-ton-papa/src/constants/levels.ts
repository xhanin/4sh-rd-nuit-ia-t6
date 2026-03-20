// src/constants/levels.ts
// Level configurations sourced from puzzles.md.

import type { LevelConfig } from '@/types'

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    // puzzles.js — id 1 : L'approche classique
    // Solution:
    //   5  E  E  7  7
    //   5  E  E  7  V1
    //   5  5  5  7  7
    level: 1,
    name: "L'approche classique",
    cols: 5,
    rows: 3,
    pieceIds: ['5', '7', 'E', 'V1'],
  },
  {
    // puzzles.js — id 2 : Le mur de briques
    // Solution:
    //   E  E  B  B  B
    //   E  E  B  W1 W1
    //   A  A  A  A  V1
    level: 2,
    name: 'Le mur de briques',
    cols: 5,
    rows: 3,
    pieceIds: ['A', 'B', 'E', 'W1', 'V1'],
  },
  {
    // puzzles.js — id 3 : Le grand mix
    // Solution:
    //   5  X  X  B  B
    //   5  V1 X  B  W1
    //   5  5  5  B  W1
    level: 3,
    name: 'Le grand mix',
    cols: 5,
    rows: 3,
    pieceIds: ['5', 'B', 'X', 'W1', 'V1'],
  },
]

/** Returns the config for a given 1-based level number, or throws. */
export function getLevelConfig(level: number): LevelConfig {
  const config = LEVEL_CONFIGS.find((c) => c.level === level)
  if (!config) throw new Error(`No config for level ${level}`)
  return config
}

export const MAX_LEVEL = LEVEL_CONFIGS.length
