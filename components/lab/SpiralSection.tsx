'use client'

import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '@/lib/registerGsap'
import { revealSectionTitle } from '@/lib/titleReveal'
import { prefersReducedMotion } from '@/lib/capability'
import { spiralReelState } from '@/lib/spiralReelState'
import SpiralReelGL from '@/components/visual/SpiralReelGL'

// Lab section: cards rising in a spiral (trionn.com card treatment on a
// vertical helix). A tall scroll track holds a CSS-sticky viewport; a native
// scroll listener maps how far through the track we are to progress (0→1),
// which the WebGL loop reads to advance the helix. Sticky + native scroll is
// used here instead of GSAP pin because these standalone lab pages have no
// ScrollSmoother (the real site sections use GSAP pin, like ReelLusion).
const TRACK_VH = 500 // scroll track height → 4 viewports of spiral travel

export default function SpiralSection() {
  const track = useRef<HTMLElement>(null)

  // title reveal (works fine standalone); GL is driven by the scroll listener below
  useGSAP(() => {
    document.fonts.ready.then(() => revealSectionTitle('.spiral-title', '#spiral'))
  }, { scope: track })

  useEffect(() => {
    if (prefersReducedMotion()) {
      spiralReelState.progress = 0.5 // static mid-spiral fallback
      return
    }
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
    const update = () => {
      const el = track.current
      if (!el) return
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      // -rect.top = pixels scrolled since the track's top hit the viewport top
      const scrolled = -el.getBoundingClientRect().top
      spiralReelState.progress = clamp01(scrolled / total)
    }
    update()
    // gsap.ticker keeps it smooth + frame-aligned with the WebGL loop
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <section id="spiral" ref={track} className="relative w-full" style={{ height: `${TRACK_VH}vh` }}>
      {/* sticky viewport — stays put while the track scrolls past */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper">
        {/* the helix of cards */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <SpiralReelGL />
        </div>

        {/* centred title, behind the front card / in front of the back cards */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <h2 className="spiral-title section-title text-center text-[clamp(44px,7vw,110px)] leading-[0.9] text-ink/85">
            Rising
            <br />
            in motion
          </h2>
        </div>

        <p className="pointer-events-none absolute bottom-[8%] left-1/2 z-20 -translate-x-1/2 text-center text-xs uppercase tracking-[0.18em] text-muted">
          Role para girar a espiral · ajuste em <code>lib/spiralReel.ts</code>
        </p>
      </div>
    </section>
  )
}
