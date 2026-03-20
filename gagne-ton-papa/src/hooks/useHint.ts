// src/hooks/useHint.ts

import { useGameStore } from '@/store/gameStore'

export function useHint() {
  const activeHint = useGameStore((s) => s.activeHint)
  const requestHint = useGameStore((s) => s.requestHint)
  const dismissHint = useGameStore((s) => s.dismissHint)

  return { activeHint, requestHint, dismissHint }
}
