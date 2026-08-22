'use client'

import type { Work } from '@/lib/works'

/**
 * Lista dos serviços ao lado do celular. Existe porque o palco sozinho só
 * mostra UM serviço por vez — sem isso não dá pra saber que existem sete nem
 * quais são sem rolar a seção inteira.
 *
 * Os cards em órbita passam POR TRÁS dela (a lista tem fundo próprio e fica
 * numa camada acima), então ela lê como um painel sobre a cena em vez de
 * disputar espaço com o arco.
 */
export default function ServiceList({
  works,
  activeIndex,
  onSelect,
}: {
  works: Work[]
  activeIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <nav
      aria-label="Serviços"
      className="w-[236px] rounded-2xl border border-white/10 bg-ink/70 p-2 backdrop-blur-md"
    >
      <ul className="flex flex-col">
        {works.map((work, i) => {
          const isActive = i === activeIndex
          return (
            <li key={work.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? 'step' : undefined}
                className={`group relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stage-accent ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {/* barrinha de acento marca o ativo sem depender só da cor do texto */}
                <span
                  aria-hidden
                  className="h-5 w-[3px] shrink-0 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? work.accent : 'transparent',
                    transform: isActive ? 'scaleY(1)' : 'scaleY(0.3)',
                  }}
                />
                <span
                  className={`font-sans text-[13px] leading-tight transition-colors ${
                    isActive ? 'font-bold text-stage-text' : 'font-medium text-stage-text-muted group-hover:text-stage-text'
                  }`}
                >
                  {work.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
