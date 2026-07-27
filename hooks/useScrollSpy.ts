'use client'

import { useEffect, useState } from 'react'

// Tracks which section is most in view (IntersectionObserver, so it works under
// GSAP ScrollSmoother's transform-driven scroll). Ported from zarpei landing-1.
export function useScrollSpy(ids: string[], opts?: { rootMargin?: string }): string {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join(',')
  const rootMargin = opts?.rootMargin ?? '-45% 0px -50% 0px'

  useEffect(() => {
    const list = key.split(',').filter(Boolean)
    const els = list
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    if (els.length === 0) return

    const visible = new Map<string, number>()
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        }
        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        if (best) setActive(best)
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [key, rootMargin])

  return active
}
