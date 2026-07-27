// Pure math for the "cards rising in a spiral → settling into a grid" reel (the
// trionn.com treatment). Two phases driven by one scroll progress:
//   Phase A (0 … gridStart):  a SNAKE of cards climbs a fixed wide helix path
//                             (head leads, contiguous body follows).
//   Phase B (gridStart … 1):  the snake FREEZES and morphs into a flat 3×2 grid
//                             (6 of the 8 cards); the 2 end cards fade out.
// `cardState` returns both targets (spiral + grid) plus the morph factor so the
// render layer can slerp orientation and lerp position between them. Kept
// dependency-free — see components/lab/SpiralReelGL.tsx.

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Vec3 = [number, number, number]
const norm = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  CARD SIZE — just change these two numbers. No maths required.             ║
// ║  The code works out width, height and the grid shrink for you, and keeps   ║
// ║  the image proportion. The two are INDEPENDENT: changing one never         ║
// ║  affects the other.                                                        ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

export const SPIRAL_CARD_SIZE = 2.0 // card size while it sweeps past on the spiral — bigger = fills more of the screen
export const GRID_CARD_SIZE = 1.43 // card size once it settles into the grid — layout 2 colunas: o grid recua p/ a DIREITA (via SPIRAL.gridX), abrindo a esquerda p/ o título
// Tip: to think in %, set GRID_CARD_SIZE relative to the spiral, e.g.
//   SPIRAL_CARD_SIZE * 0.5  → grid card is 50% of the spiral card.

// ─── derived — you don't need to touch anything below ────────────────────────
const CARD_ASPECT = 3 / 2 // width ÷ height (image crop); change only to re-crop
export const SPIRAL_CARD_W = SPIRAL_CARD_SIZE * CARD_ASPECT
export const SPIRAL_CARD_H = SPIRAL_CARD_SIZE
export const GRID_CARD_W = GRID_CARD_SIZE * CARD_ASPECT
export const GRID_CARD_H = GRID_CARD_SIZE
// Geometry is built at the SPIRAL size — so contiguous spacing = CARD_W in arc
// length makes neighbours meet edge-to-edge (the snake's body). The grid size is
// reached by shrinking that same geometry uniformly by GRID_SCALE.
export const CARD_W = SPIRAL_CARD_W
export const CARD_H = SPIRAL_CARD_H
export const GRID_SCALE = GRID_CARD_SIZE / SPIRAL_CARD_SIZE

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  GAP between cards — just change the number (world units, same as size).   ║
// ║  Independent for each phase; 0 = cards touch, − = they overlap.            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
export const SPIRAL_GAP = 0.2 // gap between cards along the snake (0 = contiguous body)
export const GRID_GAP = 0.1 // gap between grid tiles

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  ROUNDED corners — 0 = square, 1 = fully round (pill). Independent per      ║
// ║  phase; the corner smoothly morphs from SPIRAL_ROUNDED to GRID_ROUNDED as   ║
// ║  a card settles into the grid.                                             ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
export const SPIRAL_ROUNDED = 0.1 // corner roundness while on the spiral
export const GRID_ROUNDED = 0.1 // corner roundness in the grid

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  BEND — how much each card CURVES to follow the coil while on the spiral    ║
// ║  (the trionn-style "fold", instead of a flat rigid rectangle).             ║
// ║  0 = flat cards · 1 = curved to the coil's radius · >1 = extra curve.       ║
// ║  A card flattens back to 0 as it settles into the grid.                    ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
export const SPIRAL_BEND = 1

// Fixed spiral path + snake + grid config — all tunable.
export const SPIRAL = {
  radius: 4.4, // helix radius (horizontal spread of the coil)
  climb: 1.0, // vertical rise per radian → MORE vertical stretch (taller, spaced coils)
  snake: 8, // number of cards in the snake body — one per photo
  cameraZ: 9.5, // camera distance on +Z — closer so the front card comes big + near as it passes
  headStartY: -8.5, // head enters from well below the frame (fades in at the bottom) …
  headEndY: 16, // … climb rate: the head lerps this range as progress 0→1
  yFadeInner: 6.8, // fully visible while |y| < inner …
  yFadeOuter: 9.6, // … faded out by |y| > outer (high so cards stay visible while they
  //                   STACK above peelY during the buffer, before peeling)

  // Phase B — CONTINUOUS peel-off with a BUFFER. A card reaches peelY (top of the
  // coil) but does NOT leave immediately — it keeps climbing and stacks for peelBuffer
  // longer, so ~3 cards pile up at the top before the first one peels off into the grid
  // (appearing at the far end). Cards reach the peel one after another in climb order,
  // so the grid still fills as a clean ordered raster cascade.
  peelY: 4.6, // world-Y that marks the top of the coil
  peelBuffer: 0.08, // progress a card keeps climbing past the top before it peels (~3 cards)
  peelDurP: 0.12, // peel/fade flight duration, in progress units
  gridZ: 2.6, // depth of the flat grid plane (closer than the origin → prominent)
  gridX: -1.2, // LAYOUT 2 COLUNAS: recua o grid pra DIREITA (o render espelha X, então
  //              negativo = direita na tela), abrindo a coluna esquerda p/ o título vertical
  gridY: 0, // 0 = grid centrado na vertical (alinha com o título centrado à esquerda)
  // NOTE: grid card size / gap / rounded are the simple knobs at the top of this file.
}

export const CARD_COUNT = SPIRAL.snake

// Arc length per radian along the helix (constant), and the contiguous angular
// gap between body cards so their edges touch (spacing = CARD_W).
const arcPerRad = () => Math.hypot(SPIRAL.radius, SPIRAL.climb)
// angular step between cards on the coil: card width + gap, in arc length
export const dTheta = () => (CARD_W + SPIRAL_GAP) / arcPerRad()
// Vertical spacing between contiguous cards along the coil (world-Y per card).
const dThetaClimb = () => dTheta() * SPIRAL.climb
// The progress at which card `index` climbs to peelY — i.e. reaches the top of the
// coil and peels off. Cards reach it in climb order, giving the ordered cascade.
const reachPeel = (index: number) =>
  (SPIRAL.peelY + index * dThetaClimb() - SPIRAL.headStartY) / (SPIRAL.headEndY - SPIRAL.headStartY)

// The FIRST 6 cards (index 0..5) fill the grid — the leading card (index 0) is the
// first to peel, as it should be. The last two (index 6, 7) fade out. The grid fills
// in RASTER order (like trionn.com): top row left→right, THEN bottom row left→right —
// so after the 3rd card lands (top-right), the 4th appears at the opposite end
// (bottom-left). The render layer mirrors X (spiral rises to the right), so these
// pre-mirror cell ids are chosen to land VISUALLY as TL,TC,TR,BL,BC,BR:
//   visual:  TL  TC  TR  BL  BC  BR
//   cell id:  2   1   0   5   4   3   (col is flipped by the render mirror)
const CELL_ORDER = [2, 1, 0, 5, 4, 3]
// Returns { order, cell } for a grid card, or null for the two trailing (fading) cards.
function gridSlot(index: number): { order: number; cell: number } | null {
  if (index > 5) return null
  return { order: index, cell: CELL_ORDER[index] } // peel order = climb order
}
// Flat 3-column × 2-row grid, on the z = gridZ plane, shifted down by SPIRAL.gridY.
function gridPos(cell: number): Vec3 {
  const col = cell % 3
  const row = Math.floor(cell / 3) // 0 = top, 1 = bottom
  // cells are spaced by the (independent) grid card size + grid gap
  const cellW = GRID_CARD_W + GRID_GAP
  const cellH = GRID_CARD_H + GRID_GAP
  return [(col - 1) * cellW + SPIRAL.gridX, (0.5 - row) * cellH + SPIRAL.gridY, SPIRAL.gridZ]
}

interface Transform {
  pos: Vec3
  right: Vec3
  up: Vec3
  normal: Vec3
  opacity: number
}

// Phase-A spiral transform for one card at a given (frozen) spiral progress.
function spiralTransform(sp: number, index: number): Transform {
  const headTheta = lerp(SPIRAL.headStartY, SPIRAL.headEndY, sp) / SPIRAL.climb
  const theta = headTheta - index * dTheta()

  const R = SPIRAL.radius
  const sin = Math.sin(theta)
  const cos = Math.cos(theta)
  const y = SPIRAL.climb * theta

  const tangent = norm([R * cos, SPIRAL.climb, -R * sin])
  const normal = norm([sin, 0, cos]) // faces +Z (camera) at θ=0, edge-on at ±90°
  const up = norm(cross(normal, tangent))

  const vis = 1 - smoother(clamp01((Math.abs(y) - SPIRAL.yFadeInner) / (SPIRAL.yFadeOuter - SPIRAL.yFadeInner)))

  return { pos: [R * sin, y, R * cos], right: tangent, up, normal, opacity: vis }
}

export interface CardState {
  spiralPos: Vec3
  spiralRight: Vec3
  spiralUp: Vec3
  spiralNormal: Vec3
  gridPos: Vec3
  gridRight: Vec3
  gridUp: Vec3
  gridNormal: Vec3
  morph: number // 0 = pure spiral, 1 = fully grid
  opacity: number
}

// Full state for one card. Each card climbs the spiral (live) until the instant
// it reaches peelY — reachPeel(index) — then its spiral pose FREEZES at that peel
// point and, over peelDurP, it either flies into its grid slot (body cards) or
// fades away (head/tail). Cards reach peelY in climb order, so the grid fills as a
// clean ordered diagonal cascade with no card bunching or fading on the spiral.
export function cardState(progress: number, index: number): CardState {
  // Delay the peel by peelBuffer so the card keeps climbing past the top and stacks
  // (~3 cards pile up before the first leaves for the grid at the far end).
  const peelP = reachPeel(index) + SPIRAL.peelBuffer
  const t = smoother(clamp01((progress - peelP) / SPIRAL.peelDurP)) // peel/fade factor
  const climbSp = Math.min(progress, peelP) // climb live, then freeze at the peel point
  const s = spiralTransform(climbSp, index)
  const slot = gridSlot(index)

  if (!slot) {
    // Trailing cards (index 6, 7): no grid slot — fade out the moment they reach
    // the top (peelY), so neither lingers as a detached fragment or edge-on sliver.
    return {
      spiralPos: s.pos, spiralRight: s.right, spiralUp: s.up, spiralNormal: s.normal,
      gridPos: s.pos, gridRight: s.right, gridUp: s.up, gridNormal: s.normal,
      morph: 0, opacity: s.opacity * (1 - t),
    }
  }

  return {
    spiralPos: s.pos, spiralRight: s.right, spiralUp: s.up, spiralNormal: s.normal,
    gridPos: gridPos(slot.cell), gridRight: [1, 0, 0], gridUp: [0, 1, 0], gridNormal: [0, 0, 1],
    morph: t, opacity: lerp(s.opacity, 1, t),
  }
}
