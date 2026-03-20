// src/components/board/BoardCell/BoardCell.tsx

import { useDroppable } from '@dnd-kit/core'
import { CELL_SIZE } from '@/constants/grid'
import styles from './BoardCell.module.css'

interface BoardCellProps {
  x: number
  y: number
  isOccupied: boolean
  isHighlighted: boolean
}

export function BoardCell({ x, y, isOccupied, isHighlighted }: BoardCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${x}-${y}`,
    data: { x, y },
  })

  return (
    <div
      ref={setNodeRef}
      className={`${styles.cell} ${isOver ? styles.over : ''} ${isHighlighted ? styles.highlighted : ''} ${isOccupied ? styles.occupied : ''}`}
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
      aria-label={`Cellule ${x},${y}`}
    />
  )
}
