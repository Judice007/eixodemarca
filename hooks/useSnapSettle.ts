'use client'

import { useEffect, useState, type RefObject } from 'react'

// Detecta o ASSENTAMENTO de um scroller horizontal com scroll-snap: 'scrollend'
// nativo onde existir (Chrome/Firefox), fallback de debounce 120ms no Safari.
// Reporta o índice do filho [data-slide] mais próximo do centro — só quando o
// momentum para, nunca durante o drag (pra isso o consumidor usa outro sinal).
// onSettle não dispara no mount (só em mudanças reais de índice pós-gesto).
// IMPORTANTE: memoize o onSettle (useCallback) — ele é dep do effect interno;
// um callback inline re-subscreve o listener a cada render do consumidor.
export function useSnapSettle(
  ref: RefObject<HTMLElement | null>,
  onSettle?: (index: number) => void
): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const nearestIndex = () => {
      const mid = el.scrollLeft + el.clientWidth / 2
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-slide]'))
      let best = 0
      let bestDist = Infinity
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      return best
    }

    // baseline no mount: sincroniza o índice retornado com a posição real,
    // SEM disparar onSettle (a garantia de silêncio no mount é só do callback)
    let last = nearestIndex()
    const syncBaseline = () => setIndex(last)
    syncBaseline()
    let timer = 0

    const settled = () => {
      const i = nearestIndex()
      if (i !== last) {
        last = i
        setIndex(i)
        onSettle?.(i)
      }
    }
    const onScrollDebounced = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(settled, 120)
    }

    const hasScrollEnd = 'onscrollend' in window
    const event = hasScrollEnd ? 'scrollend' : 'scroll'
    const handler = hasScrollEnd ? settled : onScrollDebounced
    el.addEventListener(event, handler, { passive: true })
    return () => {
      window.clearTimeout(timer)
      el.removeEventListener(event, handler)
    }
  }, [ref, onSettle])

  return index
}
