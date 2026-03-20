// src/hooks/useWinDetection.ts
// Watches board state and calls validateBoard after each placement.
// The actual check is also called inline in placePiece, so this hook
// is a safety net for edge cases (e.g. direct board manipulation in tests).

import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

export function useWinDetection() {
  const placedPieces = useGameStore((s) => s.placedPieces)
  const inventoryPieceIds = useGameStore((s) => s.inventoryPieceIds)
  const validateBoard = useGameStore((s) => s.validateBoard)

  useEffect(() => {
    if (inventoryPieceIds.length === 0) {
      validateBoard()
    }
  }, [placedPieces, inventoryPieceIds, validateBoard])
}
