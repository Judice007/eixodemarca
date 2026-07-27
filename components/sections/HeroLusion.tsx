'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap, useGSAP } from '@/lib/registerGsap'
import { prefersReducedMotion } from '@/lib/capability'
import { heroServices, whatsappUrl } from '@/lib/data'
import { haptic } from '@/lib/haptics'
import { usePressable } from '@/hooks/usePressable'
import HeroParticles from '@/components/visual/HeroParticles'
import HeroRibbon from '@/components/visual/HeroRibbon'

const SERVICES = heroServices

const ARMS = [
  {
    position: 'left-1/2 top-1/2 -translate-x-full -translate-y-1/2 rotate-45 origin-right',
    alignment: 'justify-start pl-3 sm:pl-5',
    counter: '-rotate-45',
  },
  {
    position: 'left-1/2 top-1/2 -translate-y-1/2 -rotate-45 origin-left',
    alignment: 'justify-end pr-3 sm:pr-5',
    counter: 'rotate-45',
  },
  {
    position: 'left-1/2 top-1/2 -translate-y-1/2 rotate-45 origin-left',
    alignment: 'justify-end pr-3 sm:pr-5',
    counter: '-rotate-45',
  },
  {
    position: 'left-1/2 top-1/2 -translate-x-full -translate-y-1/2 -rotate-45 origin-right',
    alignment: 'justify-start pl-3 sm:pl-5',
    counter: 'rotate-45',
  },
]


export default function HeroLusion() {
  const root = useRef<HTMLElement>(null)
  const tablistRef = useRef<HTMLDivElement>(null)
  const pressable = usePressable()
  const [active, setActive] = useState(0)
  const current = SERVICES[active]!

  useGSAP(
    () => {
      const reduce = prefersReducedMotion()
      if (reduce) return

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro.from('.hero-kicker', { autoAlpha: 0, y: 14, filter: 'blur(7px)', duration: 0.65 }, 0.05)
      intro.from('.hero-wordmark', { yPercent: 112, duration: 0.9, ease: 'power4.out' }, 0.12)
      intro.from('.hero-subhead', { autoAlpha: 0, y: 15, duration: 0.65 }, 0.36)
      intro.from('.hero-micro', { autoAlpha: 0, y: 12, duration: 0.6 }, 0.46)
      intro.from('.hero-action', { autoAlpha: 0, y: 14, duration: 0.6 }, 0.56)
      intro.from('.hero-x-visual', { autoAlpha: 0, scale: 0.96, y: 24, duration: 0.9, ease: 'power4.out' }, 0.28)
      // NOTE: previously scaled the arm hit-zones in from 0 width (`scaleX: 0`).
      // If this tween ever stalls mid-flight — a backgrounded tab, a slow
      // device, anything that delays the GSAP ticker — the arm's clickable box
      // stays collapsed near the center forever, well short of the visible
      // stroke. Real report: hover worked only right at the badge, not along
      // the arm. Dropped for the whole hero-x-visual fade/scale above to cover
      // the reveal instead — arms just appear at full (interactive) size.
      intro.from('.hero-footrow', { autoAlpha: 0, duration: 0.7 }, 0.82)

      // Safety net: this timeline hides the headline, wordmark and the whole X
      // panel until it plays. If the GSAP ticker ever stalls before it finishes
      // (backgrounded tab on load is the common real case — browsers throttle
      // rAF for hidden tabs), that content would stay invisible indefinitely.
      // Force it to its end state once, well past its own ~2.3s runtime; a
      // no-op if it already finished normally.
      const forceComplete = window.setTimeout(() => intro.progress(1), 4000)
      intro.eventCallback('onComplete', () => window.clearTimeout(forceComplete))

      gsap.fromTo(
        '.hero-ribbon-path',
        { drawSVG: '0% 0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: { trigger: root.current ?? undefined, start: 'top top', end: 'center top', scrub: true },
        }
      )

      return () => window.clearTimeout(forceComplete)
    },
    { scope: root }
  )

  const selectService = (index: number, withHaptic = false) => {
    if (index === active) return
    setActive(index)
    if (withHaptic) haptic('tick')
  }

  // Robust fallback: track the pointer continuously over the whole tablist and
  // pick the arm by which quadrant of the X it's in (geometry, not element
  // hit-testing). Real report: onPointerEnter/onMouseEnter on the individual
  // buttons never fired for at least one tester — state stuck on the first
  // arm — even though a dispatched pointer event proved the handler itself
  // works. Whatever the platform-specific reason enter/leave wasn't firing
  // for them, mousemove-based tracking sidesteps it entirely.
  const handleArmsPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tablistRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const index = dx < 0 ? (dy < 0 ? 0 : 3) : dy < 0 ? 1 : 2
    selectService(index)
  }

  return (
    <section
      id="hero"
      ref={root}
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden bg-bone"
    >
      <HeroParticles />
      <HeroRibbon />

      <div className="relative z-10 mx-auto grid w-full max-w-[var(--maxw)] grid-cols-1 items-center gap-10 px-[var(--gutter)] pb-16 pt-[118px] lg:grid-cols-[1.3fr_0.7fr] lg:gap-[clamp(44px,6vw,96px)] lg:pb-12 lg:pt-[96px]">
        <div className="hero-x-visual relative order-2 h-[560px] min-w-0 lg:order-1 lg:col-start-1 lg:row-start-1 lg:h-[min(74vh,760px)] lg:min-h-[560px]">
          <div className="absolute inset-x-0 top-0 bottom-[104px] overflow-hidden sm:bottom-[96px]">
            {/* Mark + hit-zones share ONE sized/centered box, so the invisible
                arm buttons always line up with what's actually drawn — hovering
                the visible strokes now works, not just the little badge tags.
                Sized via container-query min() so it's the largest square that
                fits BOTH dimensions — aspect-square + w-full alone ignored the
                panel's height and let the mark spill past the visible area. */}
            <div className="absolute inset-0 grid place-items-center p-[4%] [container-type:size]">
              <div className="relative aspect-square" style={{ width: 'min(100cqw, 100cqh, 640px)' }}>
                {/* Soft bloom behind the mark — flares up and settles every time you
                    switch arms, so the X itself reacts to the hover, not just the
                    little badge. Framer's `key` re-mounts it on every `active`
                    change, replaying initial→animate as a decaying pulse. */}
                <motion.div
                  key={active}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0"
                  initial={{ opacity: 0.85, scale: 1.08 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: 'radial-gradient(closest-side, rgba(255,102,92,0.55), rgba(255,102,92,0) 70%)',
                    filter: 'blur(28px)',
                  }}
                />

                <Image
                  src="/eixo-symbol.png"
                  alt="Eixo de Marca"
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 90vw"
                  className="pointer-events-none relative z-10 object-contain"
                />

                {/* Hit-zones follow the same four arms as the real X (upper-right
                    arrowhead ↔ lower-left tail is one stroke, upper-left ↔
                    lower-right is the other) — only a small tag near the tip is
                    visible, the mark itself is never covered by a filled shape. */}
                <div
                  ref={tablistRef}
                  onPointerMove={handleArmsPointerMove}
                  className="absolute inset-[5%] z-20 sm:inset-[4%]"
                  role="tablist"
                  aria-label="Serviços do Eixo de Marca"
                >
                  {SERVICES.map((service, index) => {
                    const arm = ARMS[index]!
                    const isActive = active === index
                    return (
                      <button
                        key={service.title}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="hero-service-panel"
                        onPointerEnter={() => selectService(index)}
                        onMouseEnter={() => selectService(index)}
                        onFocus={() => selectService(index)}
                        onClick={() => selectService(index, true)}
                        className={`hero-x-arm absolute flex h-[19%] w-[75%] items-center ${arm.position} ${arm.alignment} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
                      >
                        <span
                          className={`${arm.counter} flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 backdrop-blur-sm transition-[background-color,border-color,color,transform] duration-300 ease-out ${
                            isActive
                              ? 'scale-105 border-azure/60 bg-azure text-white shadow-[0_10px_24px_-10px_rgba(255,102,92,0.55)]'
                              : 'border-ink/12 bg-white/70 text-ink/70 hover:border-ink/25 hover:text-ink'
                          }`}
                        >
                          <span className="font-mono text-[10px] font-bold tracking-[0.18em] opacity-70">0{index + 1}</span>
                          <span className="hidden font-display text-[11px] font-extrabold uppercase tracking-[0.08em] sm:inline md:text-[12px]">
                            {service.title}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="absolute left-5 top-5 z-30 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted sm:left-7 sm:top-7">
              <span className="h-px w-7 bg-azure" />
              <span className="hidden sm:inline">Passe o cursor pelos braços</span>
              <span className="sm:hidden">Toque nos braços</span>
            </div>
          </div>

          <div
            id="hero-service-panel"
            role="tabpanel"
            aria-live="polite"
            className="absolute inset-x-0 bottom-0 flex h-[104px] items-center justify-between gap-6 border-t border-ink/12 bg-bone px-1 sm:h-[96px]"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-azure">Eixo ativo — 0{active + 1}</p>
              <p className="mt-1 truncate font-display text-[clamp(25px,3.1vw,42px)] font-extrabold leading-none tracking-[-0.035em] text-ink">
                {current.title}
              </p>
            </div>
            <p className="max-w-[19ch] text-right text-[12px] font-semibold uppercase leading-[1.45] tracking-[0.1em] text-muted sm:text-[13px]">
              {current.category}
            </p>
          </div>
        </div>

        <div className="order-1 mx-auto max-w-[560px] text-center lg:order-2 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:max-w-[380px] lg:self-start lg:text-left">
          <p className="hero-kicker mb-5 hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-azure lg:flex">
            <span aria-hidden className="h-px w-8 bg-azure" />
            Hub Estratégico Criativo
          </p>

          <h1>
            <span className="sr-only">Eixo de Marca — estratégia que dá direção</span>
            <span aria-hidden className="block overflow-hidden py-[0.06em]">
              <Image
                src="/eixo-wordmark.png"
                alt=""
                width={1515}
                height={573}
                priority
                className="hero-wordmark mx-auto block h-auto w-[min(78vw,470px)] [filter:brightness(0)] lg:mx-0 lg:w-[clamp(280px,31vw,470px)]"
              />
            </span>
          </h1>

          <p className="hero-subhead mt-6 text-[clamp(21px,2.2vw,31px)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
            Estratégia <span className="font-bold text-azure">&amp;</span> Criatividade
          </p>
          <p className="hero-micro mx-auto mt-4 max-w-[34ch] text-[15px] leading-[1.6] text-muted lg:mx-0">
            Cada braço do Eixo ativa uma especialidade. Passe o cursor e descubra como conectamos marca, conteúdo, movimento e crescimento.
          </p>

          <div className="hero-action mx-auto mt-8 flex max-w-[430px] flex-col gap-3 sm:flex-row lg:mx-0">
            <a
              href="#manifesto"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              className="group inline-flex items-center justify-center gap-2 bg-ink px-6 py-4 text-[15px] font-semibold text-bone shadow-[0_16px_40px_-20px_rgba(42,16,74,0.72)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-azure"
            >
              Conhecer o Eixo
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </a>
            <motion.a
              {...pressable}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Começar um projeto com o Eixo de Marca pelo WhatsApp"
              onClick={() => haptic('confirm')}
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              className="inline-flex items-center justify-center gap-2.5 border border-ink/15 bg-white/60 px-6 py-4 text-[15px] font-semibold text-ink transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-azure hover:text-azure"
            >
              <span aria-hidden className="text-azure">◎</span>
              Começar um projeto
            </motion.a>
          </div>

          {/* Case preview — a normal child of the text column now, flowing right
              after the CTAs. It used to be pinned via grid col/row placement,
              which put it a fixed distance from the row's TOP regardless of how
              tall the text block actually rendered — on shorter viewports (or
              with longer copy) it landed on top of the CTA buttons instead of
              below them. Being part of the document flow means it can never
              overlap anything above it, on any viewport. */}
          <AnimatePresence>
            {current.caseImage && (
              <motion.div
                key={current.title}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
                className="relative z-30 mx-auto mt-6 hidden w-[220px] overflow-hidden rounded-[14px] border border-ink/10 bg-white shadow-[0_20px_45px_-20px_rgba(24,5,37,0.45)] lg:mx-0 lg:block"
              >
                <div className="relative aspect-video">
                  <Image src={current.caseImage} alt={`Exemplo de ${current.title}${current.caseLabel ? ` — ${current.caseLabel}` : ''}`} fill sizes="220px" className="object-cover" />
                </div>
                {current.caseLabel && (
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{current.caseLabel}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hero-footrow absolute inset-x-0 bottom-6 z-[11] mx-auto hidden max-w-[var(--maxw)] grid-cols-[1fr_auto_1fr] items-center gap-6 px-[var(--gutter)] lg:grid">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Est. 2026 — Brasil</span>
        <span className="text-center text-[clamp(14px,1.4vw,18px)] font-bold tracking-[-0.01em] text-ink">
          Marcas que não passam <span className="text-azure">despercebidas.</span>
        </span>
        <span className="justify-self-end text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          ↓ Role para explorar
        </span>
      </div>
    </section>
  )
}
