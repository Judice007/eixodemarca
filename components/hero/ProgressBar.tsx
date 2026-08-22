'use client'

import type { MutableRefObject } from 'react'

/**
 * Um traço por serviço, com o nome embaixo. O traço ativo preenche no ritmo
 * real da órbita — quem escreve o scaleX é o ticker do ServiceOrbit, então ele
 * acompanha a pausa do hover e o salto do clique em vez de rodar num tempo
 * próprio e dessincronizar.
 *
 * Os nomes aparecem até lg; a partir daí a lista lateral já cumpre esse papel
 * e repetir os sete nomes duas vezes na mesma tela seria ruído.
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
    <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Ir para ${labels[i]}`}
          aria-current={activeIndex === i ? 'step' : undefined}
          className="group relative flex flex-col items-center gap-1.5 rounded-lg px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent"
        >
          <span className="relative block h-[3px] w-10 overflow-hidden rounded-full bg-stage-text/20">
            <span
              ref={(el) => {
                fillRefs.current[i] = el
              }}
              className="block h-full w-full origin-left rounded-full bg-stage-accent"
              style={{ transform: `scaleX(${reduce && activeIndex === i ? 1 : 0})` }}
            />
          </span>
          <span
            className={`font-sans text-[10px] leading-none transition-colors lg:hidden ${
              activeIndex === i ? 'font-bold text-stage-text' : 'text-stage-text-muted group-hover:text-stage-text'
            }`}
          >
            {labels[i]}
          </span>
        </button>
      ))}
    </div>
  )
}
