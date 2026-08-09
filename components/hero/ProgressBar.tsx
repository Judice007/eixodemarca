'use client'

import type { MutableRefObject } from 'react'

/**
 * Um traço por serviço. O traço ativo preenche no ritmo real da órbita — quem
 * escreve o scaleX é o ticker do ServiceOrbit, então ele acompanha a pausa do
 * hover e o salto do clique em vez de rodar num tempo próprio e dessincronizar.
 */
export default function ProgressBar({
  count,
  activeIndex,
  fillRefs,
  labels,
  onSelect,
  reduce,
}: {
  count: number
  activeIndex: number
  fillRefs: MutableRefObject<(HTMLSpanElement | null)[]>
  labels: string[]
  onSelect: (index: number) => void
  /** Sem movimento o ticker não roda, então o traço ativo precisa vir preenchido daqui. */
  reduce: boolean
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Ir para ${labels[i]}`}
          aria-current={activeIndex === i ? 'step' : undefined}
          className="group relative h-4 w-10 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent"
        >
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-stage-text/20">
            <span
              ref={(el) => {
                fillRefs.current[i] = el
              }}
              className="block h-full w-full origin-left rounded-full bg-stage-accent"
              style={{ transform: `scaleX(${reduce && activeIndex === i ? 1 : 0})` }}
            />
          </span>
        </button>
      ))}
    </div>
  )
}
