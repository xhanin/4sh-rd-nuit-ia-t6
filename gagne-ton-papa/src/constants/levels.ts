// src/constants/levels.ts
// Level configurations: 4 levels with increasing grid size and piece count.
// Pieces are cumulative: Penta N includes the first N pieces.

import type { LevelConfig } from '@/types'

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    name: 'Penta 3',
    cols: 3,
    rows: 5,
    pieceIds: ['L', 'J', 'I'],
  },
  {
    level: 2,
    name: 'Penta 4',
    cols: 4,
    rows: 5,
    pieceIds: ['L', 'J', 'I', 'T'],
  },
  {
    level: 3,
    name: 'Penta 5',
    cols: 5,
    rows: 5,
    pieceIds: ['L', 'J', 'I', 'T', 'S'],
  },
  {
    level: 4,
    name: 'Penta 6',
    cols: 6,
    rows: 5,
    pieceIds: ['L', 'J', 'I', 'T', 'S', 'O'],
  },
]

/** Returns the config for a given 1-based level number, or throws. */
export function getLevelConfig(level: number): LevelConfig {
  const config = LEVEL_CONFIGS.find((c) => c.level === level)
  if (!config) throw new Error(`No config for level ${level}`)
  return config
}

export const MAX_LEVEL = LEVEL_CONFIGS.length
