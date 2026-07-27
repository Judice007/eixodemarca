'use client'
// Single place that registers GSAP plugins. Import gsap/plugins from here.
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

// Só os plugins realmente usados são registrados — Flip/Draggable/InertiaPlugin/
// Observer foram removidos (não usados); menos JS pra baixar e parsear no load.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin)
}

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin }
