'use client'

import { useEffect, useRef } from 'react'

export function useReveal(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasRevealed = useRef(false)

  useEffect(() => {
    if (!active || hasRevealed.current) return
    hasRevealed.current = true

    let ctx: { revert: () => void } | null = null

    import('gsap').then(({ gsap }) => {
      if (!containerRef.current) return
      const elements = containerRef.current.querySelectorAll('[data-reveal]')
      if (!elements.length) return

      ctx = gsap.context(() => {
        gsap.fromTo(
          elements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out',
            delay: 0.1,
          }
        )
      }, containerRef)
    })

    return () => { ctx?.revert() }
  }, [active])

  return containerRef
}
