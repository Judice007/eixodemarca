'use client'

import { useEffect, useRef } from 'react'
import { ScrollSmoother, ScrollTrigger } from '@/lib/registerGsap'
import { prefersReducedMotion } from '@/lib/capability'

// Wraps page content in ScrollSmoother's required #smooth-wrapper > #smooth-content.
// The fixed WebGL canvas lives OUTSIDE this wrapper (in the layout) so the smooth
// transform does not break its position:fixed.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.0, // longer inertial glide (Lenis-like feel) instead of the snappy 0.3
      smoothTouch: 0, // mobile = native scroll
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    })
    // Only apply the fixed/overflow CSS when smoothing is actually on, so the
    // reduced-motion fallback keeps native scrolling.
    const wrapper = wrapRef.current
    wrapper?.setAttribute('data-smooth', '1')

    // Safety net: ScrollTrigger caches trigger positions at creation time. On an
    // image-heavy page, sections below the fold finish loading well after that —
    // each one shifts document height, so anything with a scroll-tied "start"
    // point computed earlier can end up wrong (e.g. crossed already, or past the
    // end of scroll). Real report: footer nav/contact staying invisible — a
    // reveal whose trigger point never gets crossed just never plays.
    // ScrollTrigger.refresh() re-measures everything; re-run it whenever the
    // scrolling content's own height actually changes, not on a timer/guess.
    const content = document.getElementById('smooth-content')
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    if (content) ro.observe(content)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      smoother?.kill()
      wrapper?.removeAttribute('data-smooth')
    }
  }, [])

  return (
    <div id="smooth-wrapper" ref={wrapRef}>
      <div id="smooth-content">{children}</div>
    </div>
  )
}
