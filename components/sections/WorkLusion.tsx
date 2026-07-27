'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, ScrollTrigger, SplitText } from '@/lib/registerGsap'
import { isMobileViewport, prefersReducedMotion } from '@/lib/capability'
import { portfolio } from '@/lib/data'
import { spiralReelState } from '@/lib/spiralReelState'
import SpiralReelGL from '@/components/visual/SpiralReelGL'
import { haptic } from '@/lib/haptics'
import { arcIn, MOBILE_MQ } from '@/lib/mobileMotion'

// Stable module-level reference — SpiralReelGL takes `images` as a useEffect dep,
// so it must not be a fresh array each render. The 6 project covers become the
// snake's cards; the reel cycles them (2 trailing cards fade, 6 fill the grid).
const PROJECT_IMAGES = portfolio.map((p) => p.image)

// Work. The trionn-style spiral reel: on desktop the section pins and a Three.js
// "snake" of the project cards climbs a spiral, then settles into a flat 3×2 grid
// as you scroll (mechanics live in lib/spiralReel.ts + visual/SpiralReelGL.tsx).
// Mobile falls back to a static grid (no pin / no WebGL), like ReelLusion.
export default function WorkLusion() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // O título "Nossos Trabalhos" entra LETRA A LETRA (SplitText mascarado, scrubbado no pin
      // — ver reveal no fim deste efeito), enquanto o túnel dissolve por cima.

      // mobile / reduced-motion → static grid, no pin/scrub/WebGL
      if (isMobileViewport() || prefersReducedMotion()) {
        spiralReelState.progress = 1 // hold the assembled grid (static fallback)
        // desktop reduced-motion: grid montado JÁ com a legenda no canto (sem o beat central)
        gsap.set('.work-hero', { autoAlpha: 0 })
        gsap.set('.work-label', { autoAlpha: 1 })
        return
      }

      // desktop: pin + scrub. Scroll drives the reel (progress 0→1) — the snake
      // rises and assembles the grid. Real GSAP pin (the site has ScrollSmoother),
      // unlike the /lab page which used a CSS-sticky hack.
      //
      // Anchor progress to the pinned region so the reel never flashes a stale
      // state: BEFORE the pin (approaching from above) it's 0 (empty, snake still
      // below); AFTER the pin it's 1 (assembled grid scrolls away built). Without
      // this the shared module keeps its last value and the grid appears fully
      // built before the effect plays. Reset first (re-mount / HMR safety).
      // A Work fica ATRÁS do túnel (via -mt): a espiral já POPULADA em repouso (START) é
      // REVELADA quando o manifesto some no fim (não sobe até o topo pra depois começar).
      // O pin dirige START→1 (climb + grid) em MENOS scroll (1.6 tela, era 2.4, era 3.4 —
      // pin geral do site encurtado ~35% pra reduzir o tanto de rolagem quase vazia).
      const PIN_SCREENS = 1.6
      const START = 0 // espiral em REPOUSO = snake ABAIXO do frame (nada visível) enquanto o
                      // túnel ainda cobre/clareia — nenhum card espia antes da hora.
      const REVEAL_AT = 0.14 // fração do pin em que o TÍTULO aparece — DEPOIS do túnel clarear
                             // (~0.12), pra não vazar por trás do corredor. Aumente = atrasa mais.
      const HOLD = 0.4 // BEAT DO TÍTULO: a espiral fica parada (escondida) enquanto "Nossos
                       // Trabalhos" entra letra a letra e RESPIRA no centro; só COMEÇA A SUBIR
                       // aqui, passando o bastão pro título (que sobe+some). Aumente = respira mais.
      spiralReelState.progress = START
      ScrollTrigger.create({
        trigger: root.current ?? undefined,
        start: 'top top',
        end: () => '+=' + window.innerHeight * PIN_SCREENS,
        scrub: true,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // segura em START até HOLD; depois remapeia o resto do pin pra START→1 (climb+grid)
          const climb = self.progress <= HOLD ? 0 : (self.progress - HOLD) / (1 - HOLD)
          spiralReelState.progress = START + climb * (1 - START)
        },
        onLeaveBack: () => {
          spiralReelState.progress = START // voltou acima → espiral em repouso (já populada)
        },
        onLeave: () => {
          spiralReelState.progress = 1 // passou → segura o grid montado
        },
      })

      // ── TÍTULO — beats amarrados ao MESMO pin (timelines scrub, sem pinar de novo):
      //   Beat 1: "Nossos Trabalhos" GIGANTE no centro entra LETRA A LETRA (reveal abaixo) e RESPIRA até HOLD.
      //   Beat 2: em HOLD, SOBE+SOME (passa o bastão) exatamente quando a espiral sobe de baixo.
      //   Beat 3: perto do fim, a legenda ATRACA no canto e nomeia o grid montado.
      gsap.set('.work-hero', { autoAlpha: 0, yPercent: 0 }) // ESCONDIDO até o túnel clarear
      gsap.set('.work-label', { autoAlpha: 0 })
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current ?? undefined,
            start: 'top top',
            end: () => '+=' + window.innerHeight * PIN_SCREENS,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        // container (subtítulo) aparece SÓ em REVEAL_AT — depois do túnel, junto com as letras
        .fromTo('.work-hero', { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power2.out', duration: 0.05 }, REVEAL_AT)
        .to('.work-hero', { autoAlpha: 0, yPercent: -22, ease: 'power2.in', duration: 0.12 }, HOLD)
        .fromTo('.work-label', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.1 }, 0.88)

      // Reveal ELEGANTE, LETRA A LETRA (mascarado por linha — mesmo token dos outros títulos),
      // porém SCRUBBADO neste pin: cada letra sobe de trás da linha conforme a seção entra e o
      // túnel dissolve. autoSplit re-divide em resize/troca de fonte. Termina antes do respiro.
      document.fonts.ready.then(() => {
        SplitText.create('.work-hero .work-title', {
          type: 'lines,chars',
          mask: 'lines',
          autoSplit: true,
          onSplit(self) {
            // Timeline scrubbada no MESMO pin (config que funciona), com as letras entrando
            // em REVEAL_AT → DEPOIS do túnel, sem o offset 'top-=' que quebrava no pin.
            // Explícito (set escondido + .to) pra TODAS animarem de forma confiável.
            gsap.set(self.chars, { yPercent: 110 }) // todas escondidas atrás da máscara de linha
            return gsap
              .timeline({
                scrollTrigger: {
                  trigger: root.current ?? undefined,
                  start: 'top top',
                  end: () => '+=' + window.innerHeight * PIN_SCREENS,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              .to(self.chars, { yPercent: 0, ease: 'power3.out', stagger: 0.01, duration: 0.08 }, REVEAL_AT)
          },
        })
      })
    },
    { scope: root }
  )

  // MOBILE: a espiral vira ENTRADA — cada card voa numa trajetória curva
  // (eases distintos por eixo) e pousa no grid 1-col, que segue sendo o browse.
  // Tick de haptic só quando o ÚLTIMO pousa (um encaixe, não seis).
  // Reduced-motion: grid estático como hoje (nada roda).
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOBILE_MQ, () => {
        if (prefersReducedMotion()) return
        const cards = gsap.utils.toArray<HTMLElement>('#work .grid > article')
        cards.forEach((card, i) => {
          arcIn(card, i, i === cards.length - 1 ? { onComplete: () => haptic('tick') } : undefined)
        })
      })
    },
    { scope: root }
  )

  return (
    <section
      id="work"
      ref={root}
      className="relative z-10 overflow-hidden bg-bone lg:-mt-[140vh] lg:h-screen max-lg:px-[var(--gutter)] max-lg:py-[clamp(44px,8vw,56px)] max-lg:text-center"
    >
      {/* ===== DESKTOP: spiral → grid (pinned + WebGL) ===== */}
      <div className="hidden lg:block">
        {/* canvas fills the pinned viewport; the reel plays across it */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <SpiralReelGL images={PROJECT_IMAGES} />
        </div>
        {/* BEAT 1 — título GIGANTE no CENTRO (revelado pelo túnel dissolvendo); respira e
            depois SOBE+SOME passando o bastão pra espiral (dirigido pela timeline acima) */}
        <div className="work-hero pointer-events-none absolute inset-0 z-10 grid place-items-center px-[var(--gutter)] text-center">
          <div>
            <h2 className="work-title font-display text-[clamp(52px,8.5vw,120px)] font-semibold leading-[0.9] tracking-[-0.035em] text-ink">
              Frentes
              <br />
              em movimento
            </h2>
            <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.2em] text-muted">Seis territórios criativos</p>
          </div>
        </div>

        {/* BEAT 3 — título ATRACA na COLUNA ESQUERDA (vertical-centro); o grid vive à direita
            (recuado via SPIRAL.gridX), então nunca se sobrepõem — layout 2 colunas estilo trionn */}
        <div className="work-label pointer-events-none absolute left-[var(--edge)] top-1/2 z-20 max-w-[16vw] -translate-y-1/2 opacity-0">
          <span aria-hidden className="mb-5 block h-px w-12 bg-azure/70" />
          <h3 className="font-display text-[clamp(26px,2.9vw,42px)] font-semibold leading-[1.0] tracking-[-0.025em] text-ink">
            Frentes
            <br />
            em movimento
          </h3>
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">Seis territórios</p>
        </div>
      </div>

      {/* ===== MOBILE: static grid (no WebGL, no scroll lock) ===== */}
      <div className="mx-auto max-w-[var(--maxw)] lg:hidden">
        <div className="mb-9">
          <p className="section-eyebrow mb-3">O que movimentamos</p>
          <h2 className="section-title text-ink">Frentes em movimento</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {portfolio.map((p) => (
            <article key={p.title} className="group text-left">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[20px] bg-card shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
                <Image src={p.image} alt={p.title} fill sizes="100vw" className="object-cover" />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">{p.title}</h3>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{p.category}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
