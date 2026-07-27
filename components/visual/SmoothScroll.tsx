'use client'

import { useEffect, useRef } from 'react'
import { ScrollSmoother } from '@/lib/registerGsap'
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
    return () => {
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
