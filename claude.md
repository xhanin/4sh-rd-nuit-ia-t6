# Gagne ton Papa — Architecture du projet

## Vue d'ensemble

Application web solo de puzzle de placement de pièces (inspirée du jeu physique "Gagne ton Papa").
Le joueur doit remplir une grille en plaçant toutes les pièces disponibles, sans chevauchement ni débordement.
4 niveaux progressifs : Penta 3 → 4 → 5 → 6 (grilles de 3×5 à 6×5).

**Stack** : React 18 + TypeScript + Vite 5 + Zustand + @dnd-kit + CSS Modules

---

## Sources de vérité

- `html-example/example.html` — maquette statique de l'UI (Tailwind + Material Symbols, palette bois chaud)
- `game_rule.md` — règles complètes du jeu

---

## Structure du projet

```
gagne-ton-papa/
├── src/
│   ├── types/          Types TypeScript partagés (aucune dépendance React)
│   ├── constants/      Données statiques : formes des pièces, configs de niveau, constantes grille
│   ├── game/           Logique pure, sans React — 100% testable en isolation
│   ├── store/          État global Zustand + immer
│   ├── hooks/          Pont entre le store et les composants
│   └── components/     Composants React, organisés par zone UI
│       ├── layout/     Header, Footer, Sidebar
│       ├── board/      GameBoard, BoardCell, LevelIndicator
│       ├── pieces/     DraggablePiece, PieceThumbnail, DragOverlay, PlacedPieceLayer
│       ├── timer/      TimerDisplay
│       └── modals/     LevelCompleteModal, GameWonModal, HintModal
├── vitest.config.ts    Config de tests séparée (conflit de version vite 8 / vitest 3)
└── vite.config.ts      Config de build uniquement
```

---

## Couches et responsabilités

### `src/types/`
Vocabulaire TypeScript partagé. Aucune dépendance externe.

- `pieces.ts` — `CellCoord`, `PieceShape`, `Rotation`, `PieceDefinition`
- `board.ts` — `BoardCell`, `PlacedPiece`, `LevelConfig`
- `game.ts` — `GameState`, `GameStatus`, `ActiveHint`
- `index.ts` — re-exports centralisés

### `src/constants/`
Données statiques immuables.

- `pieces.ts` — Les 6 formes de pièces encodées en `PieceShape[]` + `PIECE_MAP` (dictionnaire par id). **Source de vérité pour toutes les formes.**
- `levels.ts` — Les 4 `LevelConfig` (Penta 3/4/5/6) + `getLevelConfig(level)` + `MAX_LEVEL`
- `grid.ts` — `CELL_SIZE = 64px`, `CELL_GAP = 8px`, `GRID_ROWS = 5`

### `src/game/`
Fonctions pures. Zéro React, zéro store — entièrement testables avec Vitest.

- `geometry.ts` — `rotatePiece(shape, rotation)`, `getAbsoluteCoords(shape, origin, rotation)`, `normalizeShape()`, `getUniqueRotations()`
- `validation.ts` — `isInBounds()`, `hasOverlap()`, `checkPlacement()`, `checkWin()`
- `board.ts` — `buildEmptyBoard()`, `applyPlacement()`, `removePieceFromBoard()` (opérations immutables)
- `hints.ts` — `computeHint()` : brute-force, tente toutes les rotations et positions pour trouver un placement valide
- `timer.ts` — `formatMs(ms)` → `"MM:SS"`

**Tests** : `geometry.test.ts`, `validation.test.ts`, `board.test.ts` — 26 tests, tous verts.

### `src/store/`
État global réactif.

- `gameStore.ts` — Store Zustand + middleware `immer`. Contient tout l'état de jeu (`board`, `placedPieces`, `inventoryPieceIds`, `elapsedMs`, `gameStatus`, etc.) et toutes les actions (`placePiece`, `removePiece`, `rotateSelected`, `validateBoard`, `advanceToNextLevel`, etc.). Les actions appellent les fonctions pures de `src/game/`.
- `settingsStore.ts` — Store Zustand + middleware `persist` (localStorage). Uniquement `soundEnabled`.

### `src/hooks/`
Comportements avec cycle de vie React.

- `useGameTimer.ts` — `setInterval` à 100ms, écrit dans le store via `tickTimer(deltaMs)`. S'arrête quand `gameStatus !== 'playing'`.
- `useWinDetection.ts` — `useEffect` sur `placedPieces`/`inventoryPieceIds`, appelle `validateBoard()` quand l'inventaire est vide.
- `useHint.ts` — Simple façade sur `requestHint`/`dismissHint`/`activeHint` du store.

### `src/components/`
Organisés par zone UI (pas par atome), co-localisés avec leurs CSS Modules.

**Layout**
- `Header` — Barre fixe en haut (jaune). Lit `elapsedMs` et `timerStarted` du store. Affiche `TimerDisplay`.
- `Footer` — Barre fixe en bas. Props : `onRestart`, `onHint`, `onValidate`. Boutons 3D avec shadow décalée.
- `Sidebar` — Panneau fixe à droite ("INVENTAIRE"). Affiche les `DraggablePiece` de l'inventaire.

**Board**
- `GameBoard` — Conteneur principal. Rend la grille de `BoardCell` + le `PlacedPieceLayer` en overlay absolu. Prend `cols`, `rows`, `board`, `placedPieces`, `highlightedCells`.
- `BoardCell` — Cellule `useDroppable` avec id `cell-{x}-{y}`. Feedback visuel : `isOver`, `isHighlighted`, `isOccupied`.
- `LevelIndicator` — Tabs "Penta 3/4/5/6" avec états `active` / `done`.

**Pieces**
- `PieceThumbnail` — Grille CSS mini (cellSize par défaut 16px). Applique `rotatePiece()` avant rendu.
- `DraggablePiece` — Wrapper `useDraggable` autour de `PieceThumbnail`. Data : `{ type: 'inventory', definitionId, rotation }`. Clic droit ou bouton ↻ pour tourner.
- `GameDragOverlay` — `<DragOverlay>` de @dnd-kit avec `PieceThumbnail` en taille `CELL_SIZE`.
- `PlacedPieceLayer` — Div `position: absolute` qui rend toutes les pièces placées comme cellules colorées positionnées absolument via `left/top = x*(CELL_SIZE+CELL_GAP)`.

**Timer** — `TimerDisplay` : lit `elapsedMs`, affiche via `formatMs()`.

**Modals** — `LevelCompleteModal`, `GameWonModal`, `HintModal` : overlays conditionnels (renvoient `null` si `!isOpen`).

---

## Flux principal (drag & drop)

```
DndContext (App.tsx)
  onDragStart → startTimer()
  onDragEnd   → parse active.data (definitionId, rotation)
               → parse over.data (x, y) = cellule cible
               → getAbsoluteCoords() pour valider les bornes
               → placePiece(definitionId, rotation, origin)
                   → checkPlacement() [validation.ts]
                   → applyPlacement() [board.ts]
                   → validateBoard() [checkWin()]
                       → gameStatus = 'level_complete' ou 'game_won'
```

**Note** : l'origine est actuellement la cellule survolée (coin haut-gauche de la pièce). L'offset pointer→forme sera calculé à l'itération 4 pour un placement plus naturel.

---

## Modèle de données clés

```ts
// Représentation d'une pièce dans l'inventaire
PieceDefinition { id, name, color, baseShape: CellCoord[] }

// Pièce posée sur le plateau
PlacedPiece { definitionId, rotation: 0|90|180|270, origin: CellCoord }

// Cellule du plateau
BoardCell { x, y, placedPieceId: string | null }

// État global du jeu
GameState {
  currentLevel, board, placedPieces, inventoryPieceIds,
  timerStarted, elapsedMs, gameStatus,
  selectedPieceId, selectedRotation, activeHint
}
```

---

## Contraintes importantes

- **Pas de flip** : seules les rotations 0°/90°/180°/270° sont autorisées
- **Timer continu** : `elapsedMs` est préservé lors du passage de niveau (`advanceToNextLevel`)
- **Immutabilité** : toutes les opérations sur `board` retournent de nouveaux tableaux
- **Séparation vitest/vite** : vite 8.x et vitest 3.x embarquent des versions de vite incompatibles → config séparée dans `vitest.config.ts`

---

## Roadmap (itérations restantes)

| Itération | Objectif |
|-----------|----------|
| **3** ✅ | Store + DnD câblé + détection de victoire — level 1 jouable |
| **4** | Offset pointer précis, re-drag depuis plateau, raccourcis clavier complets |
| **5** | Accessibilité (aria), reduced-motion, CI GitHub Actions |
