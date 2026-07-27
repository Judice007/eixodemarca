'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, ScrollSmoother } from '@/lib/registerGsap'
import { prefersReducedMotion, isMobileViewport } from '@/lib/capability'
import { revealSectionTitle } from '@/lib/titleReveal'
import { reelState } from '@/lib/reelState'
import ReelCardGL from '@/components/visual/ReelCardGL'
import ReelRibbon from '@/components/visual/ReelRibbon'
import { haptic } from '@/lib/haptics'
import { MOBILE_MQ } from '@/lib/mobileMotion'

// Reel. The ribbon is a thin wavy band that draws in from the left and STAYS at the
// top (separate zone). The card is left-anchored just below it and grows right + DOWN
// to fill, then ESTOURA past the viewport bottom and settles into the centred reel,
// resolving into PLAY ▸ REEL + "+" markers. Pinned + scrubbed.
const MARK_ROWS = [3.5, 96.5]

export default function ReelLusion() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // mobile = reel estático (card full-bleed), sem pin/scrub/WebGL
      if (isMobileViewport()) return
      if (prefersReducedMotion()) {
        gsap.set('.reel-card', { left: '3vw', top: '22vh', width: '94vw', height: '70vh' })
        gsap.set('.reel-overlay, .reel-mark', { autoAlpha: 1 })
        reelState.disp = 0
        reelState.duotone = 0
        return
      }

      // título de seção: reveal letra-a-letra (token unificado)
      document.fonts.ready.then(() => revealSectionTitle('.reel-headline', '#reel'))
      gsap.from('.reel-intro-fade', {
        autoAlpha: 0,
        y: 20,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#reel', start: 'top 68%' },
      })

      // the ribbon draws itself in as the section rises into view — starting the moment
      // you begin scrolling toward it (not only once it's pinned at the top) — then stays
      gsap.fromTo(
        '.reel-ribbon-path',
        { drawSVG: '0% 0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: { trigger: '#reel', start: 'top center', end: 'top top', scrub: true },
        }
      )

      // AUTO-PLAY: when the reel pins (scrolling down into it), roll the scroll through the
      // pinned region on its own so the animation plays automatically (~1.6s). The timeline
      // stays scrub-bound, so the auto-scroll simply drives it — and the moment the user makes
      // a real scroll gesture we kill the auto tween and control returns to manual scrubbing.
      const smoother = ScrollSmoother.get()
      const getY = () => (smoother ? smoother.scrollTop() : window.scrollY)
      const setY = (y: number) => (smoother ? smoother.scrollTop(y) : window.scrollTo(0, y))
      let auto: gsap.core.Tween | null = null
      const stopAuto = () => {
        if (auto) {
          auto.kill()
          auto = null
        }
      }
      const playThrough = (self: { end: number }) => {
        stopAuto()
        const proxy = { y: getY() }
        auto = gsap.to(proxy, {
          y: self.end - 1,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => setY(proxy.y),
          onComplete: stopAuto,
        })
      }
      const cancelEvents = ['wheel', 'touchmove']
      cancelEvents.forEach((e) => window.addEventListener(e, stopAuto, { passive: true, capture: true }))

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#reel',
          start: 'top top',
          end: () => '+=' + window.innerHeight * 2.4,
          scrub: true,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          // play through automatically on the first (downward) arrival
          onEnter: (self) => playThrough(self),
        },
      })

      // intro recedes
      tl.to('.reel-intro', { autoAlpha: 0, y: -28, duration: 0.3 }, 0.06)
      // card rises from the lower zone + grows right to fill (top stays below the ribbon)
      tl.to('.reel-card', { left: '3vw', top: '22vh', width: '94vw', height: '70vh', duration: 0.44, ease: 'power2.inOut' }, 0.16)
      // blue duotone releases + liquid swirl peaks mid-grow
      tl.fromTo(reelState, { duotone: 1 }, { duotone: 0, duration: 0.5 }, 0.2)
      tl.fromTo(reelState, { disp: 0 }, { disp: 1, duration: 0.3 }, 0.18).to(reelState, { disp: 0, duration: 0.3 }, 0.42)
      // card ESTOURA past the viewport bottom, then SETTLES
      tl.to('.reel-card', { height: '108vh', duration: 0.12 }, 0.6)
      tl.to('.reel-card', { height: '70vh', duration: 0.16, ease: 'power2.out' }, 0.72)
      // the ribbon's tail REACTS to the estouro — gets pulled down, then settles back
      tl.to('.reel-ribbon-path', { scaleY: 1.1, transformOrigin: '50% 0%', duration: 0.12, ease: 'power2.out' }, 0.6).to(
        '.reel-ribbon-path',
        { scaleY: 1, transformOrigin: '50% 0%', duration: 0.18, ease: 'power1.inOut' },
        0.72
      )
      // PLAY ▸ REEL + "+" markers resolve
      tl.fromTo('.reel-overlay', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.66)
      tl.fromTo('.reel-mark', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, stagger: 0.004 }, 0.84)

      return () => {
        stopAuto()
        cancelEvents.forEach((e) => window.removeEventListener(e, stopAuto, { capture: true }))
      }
    },
    { scope: root }
  )

  // MOBILE: o ESTOURO — pin de ~1 tela; o card 4:5 cresce até full-bleed via
  // scale (função-based, recalcula no refresh), passa do ponto (overshoot) e
  // ASSENTA com haptic tick. Depois de assentado a arte ganha parallax interno.
  // borderRadius é paint-only (sem reflow). Reduced-motion: card estático atual.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOBILE_MQ, () => {
        if (prefersReducedMotion()) return
        const card = root.current?.querySelector<HTMLElement>('.reel-card-m')
        if (!card) return
        const fullScale = () => window.innerWidth / card.offsetWidth
        // folga pro parallax interno não abrir fresta na borda
        gsap.set('.reel-img-m', { scale: 1.12 })

        let settledFired = false
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '#reel',
            start: 'top top',
            end: () => '+=' + window.innerHeight,
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // tick UMA vez ao cruzar o assentamento descendo; rearma ao voltar
              if (self.direction > 0 && !settledFired && self.progress >= 0.72) {
                settledFired = true
                haptic('tick')
              } else if (settledFired && self.progress < 0.6) {
                settledFired = false
              }
            },
          },
        })

        // intro recua enquanto o card toma a tela
        tl.to('.reel-intro-m', { autoAlpha: 0, y: -24, duration: 0.3 }, 0.05)
        // cresce até passar do ponto (overshoot 3%)…
        // centraliza verticalmente enquanto cresce: a intro some (autoAlpha) mas
        // continua no fluxo, então sem isso o card assenta ~90px abaixo do centro
        tl.to('.reel-card-m', { scale: () => fullScale() * 1.03, y: () => window.innerHeight / 2 - (card.offsetTop + card.offsetHeight / 2), borderRadius: 0, ease: 'power2.inOut', duration: 0.55 }, 0.1)
        // …e ASSENTA no full-bleed exato (o "encaixe" que o tick acompanha)
        tl.to('.reel-card-m', { scale: () => fullScale(), ease: 'power2.out', duration: 0.12 }, 0.65)
        // card vivo: parallax interno da arte no resto da travessia
        tl.fromTo('.reel-img-m', { yPercent: -3.5 }, { yPercent: 3.5, ease: 'none', duration: 0.23 }, 0.77)
      })
    },
    { scope: root }
  )

  return (
    <section id="reel" ref={root} className="relative z-10 overflow-hidden lg:min-h-screen">
      {/* ===== DESKTOP: reel animado (pinado + WebGL) ===== */}
      <div className="hidden lg:block">
        {/* intro framing */}
        <div className="reel-intro pointer-events-none absolute inset-0 z-30">
          <div className="absolute right-[var(--edge)] top-1/2 flex max-w-[42vw] -translate-y-1/2 flex-col items-start gap-7">
            <span className="section-eyebrow reel-intro-fade">Nossa abordagem</span>
            <h2 className="reel-headline section-title text-ink">
              Ideias ousadas,
              <br />
              ganham vida.
            </h2>
            <p className="reel-intro-fade max-w-[40ch] text-[15px] leading-[1.55] text-ink/80">
              Combinamos estratégia, design, conteúdo, movimento e tecnologia para construir marcas coerentes em cada ponto de contato.
            </p>
          </div>
        </div>

        <ReelRibbon />

        {/* + grid markers */}
        <div className="pointer-events-none absolute inset-0 z-[15]">
          {MARK_ROWS.flatMap((y) =>
            Array.from({ length: 7 }, (_, i) => (
              <span
                key={`${y}-${i}`}
                className="reel-mark absolute -translate-x-1/2 -translate-y-1/2 text-[18px] text-ink/40"
                style={{ left: `${(i / 6) * 100}vw`, top: `${y}vh` }}
              >
                +
              </span>
            ))
          )}
        </div>

        {/* card — left-anchored, grows right + down */}
        <div className="reel-card absolute left-[var(--edge)] top-[27vh] z-10 h-[46vh] w-[46vh] overflow-hidden rounded-[20px]">
          <ReelCardGL />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.5))]" />
          <div className="reel-overlay absolute inset-0 z-20 flex items-center justify-center gap-[clamp(16px,3vw,52px)]">
            <span className="select-none font-display text-[clamp(30px,6vw,92px)] font-extrabold tracking-[-0.03em] text-white">MARCA</span>
            <span className="grid size-[clamp(64px,8vw,112px)] place-items-center rounded-full bg-white">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-[8%] size-[36%] fill-ink">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="select-none font-display text-[clamp(30px,6vw,92px)] font-extrabold tracking-[-0.03em] text-white">VIVA</span>
          </div>
        </div>
      </div>

      {/* ===== MOBILE: reel estático premium (sem WebGL, sem trava de scroll) ===== */}
      <div className="reel-stage-m min-h-[100svh] mx-auto flex w-full max-w-[var(--maxw)] flex-col items-center justify-center gap-7 px-[var(--gutter)] py-[clamp(44px,8vw,56px)] text-center lg:hidden">
        <div className="reel-intro-m">
          <h2 className="section-title text-ink">Ideias ousadas, ganham vida.</h2>
          <p className="mt-4 mx-auto max-w-[46ch] text-[15px] leading-[1.55] text-ink/75">
            Combinamos estratégia, design, conteúdo, movimento e tecnologia para construir marcas coerentes em cada ponto de contato.
          </p>
        </div>
        <div
          className="reel-card-m group relative block w-full overflow-hidden rounded-[22px] shadow-[0_30px_80px_-40px_rgba(22,21,27,0.55)]"
        >
          <span className="block aspect-[4/5] w-full" />
          <Image
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
            alt=""
            fill
            sizes="100vw"
            className="reel-img-m object-cover"
          />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.58))]" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <span className="grid size-[74px] place-items-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-300 group-active:scale-95">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-[8%] size-7 fill-ink">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="font-display text-[clamp(26px,8vw,40px)] font-extrabold tracking-[-0.03em] text-white">
              MARCA EM MOVIMENTO
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}
