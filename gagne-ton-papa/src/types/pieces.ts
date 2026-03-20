// src/types/pieces.ts

export type CellCoord = { x: number; y: number }
export type PieceShape = CellCoord[]
export type Rotation = 0 | 90 | 180 | 270

export interface PieceDefinition {
  id: string
  name: string
  /** CSS color value used to render this piece */
  color: string
  /** Canonical shape at rotation 0; coords normalized so top-left = {0,0} */
  baseShape: PieceShape
}
