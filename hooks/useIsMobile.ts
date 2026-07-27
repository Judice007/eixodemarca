'use client'

import { useEffect, useState } from 'react'

// Mobile = viewport estreita OU ponteiro grosso (toque). Default `true` no SSR e no
// primeiro render client (mobile-first → combina na hidratação e garante que efeitos/
// WebGL desktop nunca montem antes de confirmarmos um desktop real).
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px), (pointer: coarse)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return isMobile
}
