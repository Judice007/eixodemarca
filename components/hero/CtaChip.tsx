'use client'

import { LAYER } from './constants'

/**
 * Chip flutuante sobre a base do aparelho.
 *
 * A centralização é feita por um wrapper flex de largura total, e não por
 * left:50% + translateX(-50%): a flutuação também escreve em `transform`, e as
 * duas coisas juntas se atrapalhavam (o chip saía do centro no mobile). Assim a
 * animação mexe só no eixo Y e a posição horizontal não depende dela.
 */
export default function CtaChip({ href, reduce }: { href: string; reduce: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 flex justify-center"
      // ~onde a base do aparelho encontra as mãos. Mais baixo que isso e o chip
      // atropela o título gigante que fica no rodapé do palco.
      style={{ top: '64%', zIndex: LAYER.cta }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`pointer-events-auto whitespace-nowrap rounded-2xl border border-white/12 bg-stage-card px-5 py-3 text-center shadow-[var(--shadow-far)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stage-accent ${
          reduce ? '' : 'eixo-cta-float'
        }`}
      >
        <span className="block font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-stage-card-muted">
          Comece pelo eixo
        </span>
        <span className="mt-1 block font-display text-[13px] font-black leading-none text-stage-card-ink">
          Falar no WhatsApp
        </span>
      </a>
    </div>
  )
}
