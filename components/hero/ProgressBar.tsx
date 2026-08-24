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
    <div className="flex flex-wrap items-start justify-center gap-x-1 gap-y-1 lg:gap-x-2 lg:gap-y-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Ir para ${labels[i]}`}
          aria-current={activeIndex === i ? 'step' : undefined}
          // min-h-11 = 44px, o alvo de toque mínimo. Antes o botão media
          // 70x27 e era desconfortável de acertar no dedo. O padding vertical
          // cresce junto pra área clicável ser real, não só a caixa.
          className="group relative flex min-h-11 flex-col items-center justify-center gap-2 rounded-lg px-2 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent lg:min-h-0 lg:gap-1.5 lg:px-1 lg:py-1"
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
          {/* Inativo em text-stage-text/75, não no muted: no muted o rótulo
              ficava apagado demais sobre o palco escuro. */}
          <span
            className={`font-sans text-[11px] leading-none transition-colors lg:hidden ${
              activeIndex === i ? 'font-bold text-stage-text' : 'font-medium text-stage-text/75 group-hover:text-stage-text'
            }`}
          >
            {labels[i]}
          </span>
        </button>
      ))}
    </div>
  )
}
