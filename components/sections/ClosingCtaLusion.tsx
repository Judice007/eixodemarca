'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '@/lib/registerGsap'
import { prefersReducedMotion } from '@/lib/capability'
import { whatsappUrl } from '@/lib/data'

// Fecho de marca PINADO (mesmo efeito da landing-1): a seção azure fica fixa e o
// footer escuro SOBE POR CIMA ao rolar (revelação em camadas, alto contraste).
// Como o site usa ScrollSmoother (que quebra position:sticky), o pin é feito com
// ScrollTrigger (mesmo idiom do Manifesto/Equipe). Só desktop ≥lg; no mobile a
// seção é estática (sem pin), como na landing-1.
export default function ClosingCtaLusion() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const st = ScrollTrigger.create({
          trigger: root.current ?? undefined,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false, // sem espaçador → o footer sobe por cima do CTA fixo
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })
        return () => st.kill()
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      aria-label="Vamos tirar sua marca do comum"
      className="relative z-0 flex min-h-[60svh] flex-col items-center justify-center overflow-hidden bg-azure px-[var(--gutter)] py-20 text-center text-white lg:min-h-screen"
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
        Próximo passo
      </p>
      <h2 className="mt-4 max-w-4xl font-display text-[clamp(42px,7vw,112px)] font-extrabold leading-[0.95] tracking-[-0.04em] drop-shadow-[0_2px_22px_rgba(0,0,0,0.18)]">
        Vamos tirar sua marca do comum.
      </h2>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-ink shadow-[0_18px_40px_-22px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5"
      >
        Falar com o Eixo <span aria-hidden>→</span>
      </a>
    </section>
  )
}
