'use client'

import { useRef } from 'react'
import { useGSAP } from '@/lib/registerGsap'
import { prefersReducedMotion } from '@/lib/capability'
import { revealSectionTitle } from '@/lib/titleReveal'
import { methodSteps } from '@/lib/data'
import { useTeamPin } from '@/hooks/useTeamPin'

// "As forças por trás" — método, não pessoas fictícias nem os mesmos 4 eixos
// da seção "Da ideia à entrega" (WorkLusion): Diagnóstico → Planejamento →
// Produção → Gestão & Otimização. Reaproveita o mesmo trilho horizontal pinado (useTeamPin
// é genérico por nº de cards) — só o conteúdo de cada card mudou: em vez de
// foto + membros fictícios, um painel gráfico (numeral + corte diagonal) e uma
// descrição + o que acontece naquela etapa.
export default function TeamLusion() {
  const root = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useTeamPin({ rootRef: root, trackRef })

  // título de seção: reveal letra-a-letra (token unificado)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      document.fonts.ready.then(() => root.current && revealSectionTitle('.team-headline', root.current))
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      id="equipe"
      className="relative z-10 overflow-hidden bg-bone max-md:py-[clamp(44px,8vw,56px)] md:flex md:h-screen md:flex-col md:overflow-hidden"
    >
      {/* cabeçalho — alinhado ao grid 1280; compacto e fixo no topo da coluna quando pinado */}
      <div className="mx-auto w-full max-w-[var(--maxw)] px-[var(--gutter)] max-md:mb-8 max-md:text-center md:shrink-0 md:pb-4 md:pt-[88px]">
        <p className="section-eyebrow mb-4 max-lg:hidden">Como fazemos</p>
        <h2 className="team-headline section-title text-ink">
          As forças
          <br />
          por trás.
        </h2>
      </div>

      {/* ===== TRACK PINADO (iPad + desktop, >=768) — bloom dirigido por scroll =====
           A faixa é o filho flex-1 da coluna: ocupa a altura que sobra abaixo do
           cabeçalho. Os cards usam h-full (preenchem essa altura) com teto de 520px,
           então cabem em QUALQUER altura de viewport — sem corte. */}
      <div
        ref={trackRef}
        data-team-track
        className="hidden gap-4 px-[var(--edge)] py-2 will-change-transform md:flex md:min-h-0 md:flex-1 md:items-center"
      >
        {methodSteps.map((step, i) => (
          <article
            key={step.key}
            data-team-key={step.key}
            style={{ width: 300 }}
            className="team-card relative h-full max-h-[520px] shrink-0 overflow-hidden bg-ink shadow-[0_30px_70px_-40px_rgba(22,21,27,0.6)]"
          >
            {/* painel gráfico próprio — numeral gigante + corte diagonal, sem foto de banco */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#2a104a,#180525_70%)]" />
            <span aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 font-display text-[170px] font-black leading-none text-white/[0.06]">
              0{i + 1}
            </span>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(8,8,12,0.85))]" />
            {/* nome vertical (recolhido) */}
            <span className="team-vname absolute bottom-4 left-4 z-10 font-display text-base font-extrabold text-white [writing-mode:vertical-rl] [transform:rotate(180deg)]">
              {step.label}
            </span>
            {/* conteúdo revelado (aberto) */}
            <div className="team-reveal invisible absolute inset-x-6 bottom-6 z-10 opacity-0">
              <h3 className="mb-3 whitespace-nowrap font-display text-2xl font-extrabold tracking-[-0.02em] text-white">{step.label}</h3>
              <p className="mb-4 text-[13px] leading-snug text-white/70">{step.description}</p>
              <ul className="flex flex-col gap-1.5">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-[12px] font-medium text-white/85">
                    <span aria-hidden className="h-px w-3.5 shrink-0 rotate-[-35deg] bg-azure" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {/* ===== STACK VERTICAL (mobile, <768) =====
           Carrossel horizontal antigo brigava com o normalizeScroll do ScrollSmoother
           (swipe não pegava). Aqui cada etapa abre num card com descrição + o que
           acontece nela: scroll nativo vertical, sempre funciona. */}
      <div className="mx-auto flex w-full max-w-[var(--maxw)] flex-col gap-6 px-[var(--gutter)] md:hidden">
        {methodSteps.map((step, i) => (
          <article key={step.key} data-team-key={step.key} className="relative overflow-hidden rounded-[22px] bg-ink ring-1 ring-white/10">
            <div className="relative h-[130px] w-full overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#2a104a,#180525_70%)]" />
              <span aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 font-display text-[110px] font-black leading-none text-white/[0.07]">
                0{i + 1}
              </span>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(8,8,12,0.92))]" />
              <h3 className="absolute bottom-3 left-5 z-10 font-display text-[24px] font-extrabold tracking-[-0.02em] text-white">{step.label}</h3>
            </div>
            <div className="p-5">
              <p className="mb-4 text-[13px] leading-relaxed text-white/70">{step.description}</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-[12px] font-medium text-white/85">
                    <span aria-hidden className="h-px w-3.5 shrink-0 rotate-[-35deg] bg-azure" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
