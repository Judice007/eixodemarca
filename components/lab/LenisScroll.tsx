'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from '@/lib/registerGsap'

// Lenis smooth scroll for the standalone lab pages (which have no GSAP
// ScrollSmoother — that lives in the real (site) layout). Driven off gsap.ticker
// so it shares one clock with SpiralSection's scroll-progress reader.
export default function LenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    const raf = (time: number) => lenis.raf(time * 1000) // gsap.ticker time is seconds; lenis wants ms
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33) // restore GSAP default
      lenis.destroy()
    }
  }, [])
  return null
}
