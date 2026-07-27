// Pure math for the DigiThree branded scroll rail (ScrollRail). No DOM here — the
// component (visual/ScrollRail.tsx) only calls these. Ported from zarpei landing-1
// (logic kept verbatim; only SECTIONS differ).

export type Section = { id: string; label: string }

export const SECTIONS: Section[] = [
  { id: 'hero', label: 'Início' },
  { id: 'reel', label: 'Reel' },
  { id: 'manifesto', label: 'Estúdio' },
  { id: 'work', label: 'Trabalhos' },
]

export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v))

// Global scroll progress 0..1. Guards limit<=0 (short / unmeasured page).
export function scrollProgress(scroll: number, limit: number): number {
  if (!(limit > 0)) return 0
  return clamp(scroll / limit, 0, 1)
}

// Top (px) of the thumb inside the track. Sweeps 0 → (trackPx - thumbPx).
export function thumbTop(progress: number, trackPx: number, thumbPx: number): number {
  const range = Math.max(trackPx - thumbPx, 0)
  return clamp(progress, 0, 1) * range
}

// Position (px) of a marker on the track, aligned to the CENTER of the thumb when
// it sits at that section's progress — so dot and thumb coincide visually.
export function markerTop(
  sectionTop: number,
  limit: number,
  trackPx: number,
  thumbPx: number
): number {
  const f = limit > 0 ? clamp(sectionTop / limit, 0, 1) : 0
  const range = Math.max(trackPx - thumbPx, 0)
  return f * range + thumbPx / 2
}

// scaleY of the thumb from |velocity| (px/frame). Rest=1, ceiling=max.
export function velocityStretch(velocity: number, k = 0.012, max = 1.6): number {
  return clamp(1 + Math.abs(velocity) * k, 1, max)
}

// Target scroll (px) while dragging the thumb. grabOffset = where on the thumb the
// pointer grabbed (px from thumb top), to keep that point under the cursor.
export function dragTargetScroll(a: {
  pointerY: number
  trackTop: number
  trackPx: number
  thumbPx: number
  grabOffset: number
  limit: number
}): number {
  const range = Math.max(a.trackPx - a.thumbPx, 0)
  if (range <= 0 || !(a.limit > 0)) return 0
  const localTop = a.pointerY - a.trackTop - a.grabOffset
  return clamp(localTop / range, 0, 1) * a.limit
}

// Target scroll (px) when clicking the bare track (outside the thumb).
export function trackClickScroll(a: {
  pointerY: number
  trackTop: number
  trackPx: number
  limit: number
}): number {
  if (a.trackPx <= 0 || !(a.limit > 0)) return 0
  return clamp((a.pointerY - a.trackTop) / a.trackPx, 0, 1) * a.limit
}

// Index of the active section: the last one whose top is at/above the viewport
// center line. -1 if the list is empty.
export function activeIndex(
  sectionTops: number[],
  scroll: number,
  viewportCenter: number
): number {
  const line = scroll + viewportCenter
  let idx = sectionTops.length ? 0 : -1
  for (let i = 0; i < sectionTops.length; i++) {
    const top = sectionTops[i]
    if (top !== undefined && top <= line) idx = i
  }
  return idx
}
