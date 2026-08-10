'use client'

import { LAYER } from './constants'

/**
 * Chip do CTA. Por padrão flutua sobre a base do aparelho; com `inline`,
 * renderiza como um bloco normal no fluxo (usado abaixo do celular, fora da
 * órbita, pra não competir com o vídeo do slide ativo).
 *
 * A centralização é feita por um wrapper flex de largura total, e não por
 * left:50% + translateX(-50%): a flutuação também escreve em `transform`, e as
 * duas coisas juntas se atrapalhavam (o chip saía do centro no mobile). Assim a
 * animação mexe só no eixo Y e a posição horizontal não depende dela.
 */
export default function CtaChip({
  href,
  reduce,
  inline = false,
}: {
  href: string
  reduce: boolean
  inline?: boolean
}) {
  return (
    <div
      className={
        inline
          ? 'flex justify-center'
          : 'pointer-events-none absolute inset-x-0 flex justify-center'
      }
      // Sobre a base da tela do celular. Percentual da caixa da órbita, que
      // começa junto com o aparelho.
      style={inline ? undefined : { top: '58%', zIndex: LAYER.cta }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`pointer-events-auto whitespace-nowrap rounded-2xl border border-white/12 bg-stage-card px-3 py-2 text-center shadow-[var(--shadow-far)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stage-accent sm:px-5 sm:py-3 ${
          reduce ? '' : 'eixo-cta-float'
        }`}
      >
        <span className="block font-sans text-[7px] font-bold uppercase tracking-[0.16em] text-stage-card-muted sm:text-[9px]">
          Comece pelo eixo
        </span>
        <span className="mt-0.5 block font-display text-[11px] font-black leading-none text-stage-card-ink sm:mt-1 sm:text-[13px]">
          Falar no WhatsApp
        </span>
      </a>
    </div>
  )
}
