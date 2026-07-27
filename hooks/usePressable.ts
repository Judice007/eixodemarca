'use client'

import { useEffect, useState } from 'react'
import type { TargetAndTransition, Transition } from 'framer-motion'
import { isMobileViewport, prefersReducedMotion } from '@/lib/capability'

type PressableProps = { whileTap?: TargetAndTransition; transition?: Transition }

const PRESS: PressableProps = {
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 420, damping: 24 },
}

// Press físico pra CTAs de conversão: scale sutil no touch-down, spring no release.
// Só mobile e nunca sob reduced-motion; no desktop/SSR devolve {} (spread inócuo),
// então o desktop fica intocado. A ação em si continua no clique (up-event) do
// consumidor — WCAG pointer cancellation preservada.
export function usePressable(): PressableProps {
  const [on, setOn] = useState(false)
  useEffect(() => {
    // wrapper existe só pra regra react-hooks/set-state-in-effect (espelha useIsMobile)
    const update = () => setOn(isMobileViewport() && !prefersReducedMotion())
    update()
  }, [])
  return on ? PRESS : {}
}
