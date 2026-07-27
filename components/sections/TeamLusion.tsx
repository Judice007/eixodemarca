'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@/lib/registerGsap'
import { prefersReducedMotion } from '@/lib/capability'
import { revealSectionTitle } from '@/lib/titleReveal'
import { teams } from '@/lib/data'
import { useTeamPin } from '@/hooks/useTeamPin'

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
        {teams.map((t) => (
          <article
            key={t.key}
            data-team-key={t.key}
            style={{ width: 300 }}
            className="team-card relative h-full max-h-[520px] shrink-0 overflow-hidden rounded-[20px] bg-ink shadow-[0_30px_70px_-40px_rgba(22,21,27,0.6)]"
          >
              <Image src={t.cover} alt={t.label} fill sizes="560px" className="object-cover opacity-55" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(8,8,12,0.85))]" />
              {/* nome vertical (recolhido) */}
              <span className="team-vname absolute bottom-4 left-4 z-10 font-display text-base font-extrabold text-white [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                {t.label}
              </span>
              {/* conteúdo revelado (aberto) */}
              <div className="team-reveal invisible absolute inset-x-6 bottom-6 z-10 opacity-0">
                <h3 className="mb-4 whitespace-nowrap font-display text-2xl font-extrabold tracking-[-0.02em] text-white">{t.label}</h3>
                <div className="flex gap-4">
                  {t.members.map((m, i) => (
                    <div
                      key={m.name}
                      data-team-key={t.key}
                      data-member-index={i}
                      className="team-member flex w-16 flex-col items-center gap-1.5 text-center"
                    >
                      <span className="relative size-12 overflow-hidden rounded-full ring-2 ring-white/70">
                        <Image src={m.photo} alt={m.name} fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="text-[11px] font-semibold leading-tight text-white">{m.name}</span>
                      <span className="text-[9px] leading-tight text-cyan">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* ===== STACK VERTICAL (mobile, <768) =====
           Carrossel horizontal antigo brigava com o normalizeScroll do ScrollSmoother
           (swipe não pegava) e só mostrava o rótulo. Aqui cada time abre num card
           com a capa + os membros (foto/nome/função): scroll nativo vertical, sempre
           funciona, e mostra "as pessoas por trás" — o objetivo da seção. */}
      <div className="mx-auto flex w-full max-w-[var(--maxw)] flex-col gap-6 px-[var(--gutter)] md:hidden">
        {teams.map((t) => (
          <article
            key={t.key}
            data-team-key={t.key}
            className="overflow-hidden rounded-[22px] bg-ink ring-1 ring-white/10"
          >
            <div className="relative h-[150px] w-full overflow-hidden">
              <Image src={t.cover} alt={t.label} fill sizes="100vw" className="object-cover opacity-70" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(8,8,12,0.92))]" />
              <h3 className="absolute bottom-3 left-5 z-10 font-display text-[26px] font-extrabold tracking-[-0.02em] text-white">
                {t.label}
              </h3>
            </div>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-5 p-5">
              {t.members.map((m) => (
                <li key={m.name} className="flex w-[76px] flex-col items-center gap-1.5 text-center">
                  <span className="relative size-16 overflow-hidden rounded-full ring-2 ring-white/15">
                    <Image src={m.photo} alt={m.name} fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="text-[12px] font-semibold leading-tight text-white">{m.name}</span>
                  <span className="text-[10px] leading-tight text-cyan">{m.role}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
