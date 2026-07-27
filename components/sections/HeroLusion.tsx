'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap, useGSAP } from '@/lib/registerGsap'
import { prefersReducedMotion } from '@/lib/capability'
import { heroServices } from '@/lib/data'
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

const PANEL_CLIPS = [
  'polygon(0 0, 86% 0, 100% 14%, 100% 100%, 14% 100%, 0 86%)',
  'polygon(14% 0, 100% 0, 100% 86%, 86% 100%, 0 100%, 0 14%)',
  'polygon(0 0, 86% 0, 100% 14%, 100% 86%, 86% 100%, 0 100%)',
  'polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 86%, 0 14%)',
]

export default function HeroLusion() {
  const root = useRef<HTMLElement>(null)
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
      intro.from('.hero-x-arm', { scaleX: 0, duration: 0.7, stagger: 0.06, ease: 'power4.out' }, 0.48)
      intro.from('.hero-footrow', { autoAlpha: 0, duration: 0.7 }, 0.82)

      gsap.fromTo(
        '.hero-ribbon-path',
        { drawSVG: '0% 0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'center top', scrub: true },
        }
      )
    },
    { scope: root }
  )

  const selectService = (index: number, withHaptic = false) => {
    if (index === active) return
    setActive(index)
    if (withHaptic) haptic('tick')
  }

  return (
    <section
      id="hero"
      ref={root}
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden bg-bone"
    >
      <HeroParticles />
      <HeroRibbon />

      <div className="relative z-10 mx-auto grid w-full max-w-[var(--maxw)] grid-cols-1 items-center gap-10 px-[var(--gutter)] pb-16 pt-[118px] lg:grid-cols-[0.7fr_1.3fr] lg:gap-[clamp(44px,6vw,96px)] lg:pb-12 lg:pt-[96px]">
        <div className="mx-auto max-w-[560px] text-center lg:mx-0 lg:max-w-[380px] lg:text-left">
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
              href="#contato"
              aria-label="Começar um projeto com o Eixo de Marca"
              onClick={() => haptic('confirm')}
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              className="inline-flex items-center justify-center gap-2.5 border border-ink/15 bg-white/60 px-6 py-4 text-[15px] font-semibold text-ink transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-azure hover:text-azure"
            >
              <span aria-hidden className="text-azure">◎</span>
              Começar um projeto
            </motion.a>
          </div>
        </div>

        <div className="hero-x-visual relative h-[560px] min-w-0 lg:h-[min(68vh,650px)] lg:min-h-[540px]">
          <div className="absolute inset-x-0 top-0 bottom-[104px] overflow-hidden bg-dark sm:bottom-[96px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={{
                  opacity: 0,
                  scale: 1.06,
                  clipPath: 'polygon(48% 46%, 54% 48%, 52% 55%, 45% 52%)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  clipPath: PANEL_CLIPS[active],
                }}
                exit={{
                  opacity: 0,
                  scale: 1.03,
                  clipPath: 'polygon(48% 46%, 54% 48%, 52% 55%, 45% 52%)',
                }}
                transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt=""
                  fill
                  priority={active === 0}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(24,5,37,0.38),rgba(24,5,37,0.82))]" />
              </motion.div>
            </AnimatePresence>

            <div aria-hidden className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

            <div className="absolute left-5 top-5 z-30 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65 sm:left-7 sm:top-7">
              <span className="h-px w-7 bg-azure" />
              <span className="hidden sm:inline">Passe o cursor pelos braços</span>
              <span className="sm:hidden">Toque nos braços</span>
            </div>

            <div className="absolute inset-[15%] z-20 sm:inset-[13%]" role="tablist" aria-label="Serviços do Eixo de Marca">
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
                    onFocus={() => selectService(index)}
                    onClick={() => selectService(index, true)}
                    style={{ clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 9% 50%)' }}
                    className={`hero-x-arm absolute flex h-[19%] w-[53%] items-center ${arm.position} ${arm.alignment} transition-[background-color,color,filter] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive
                        ? 'z-30 bg-azure text-white drop-shadow-[0_12px_22px_rgba(255,102,92,0.36)]'
                        : 'z-20 bg-[#f2ebff]/90 text-ink hover:bg-white'
                    }`}
                  >
                    <span className={`${arm.counter} flex items-center gap-2 whitespace-nowrap`}>
                      <span className="font-mono text-[10px] font-bold tracking-[0.18em] opacity-70">0{index + 1}</span>
                      <span className="hidden font-display text-[11px] font-extrabold uppercase tracking-[0.08em] sm:inline md:text-[12px]">
                        {service.title}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div aria-hidden className="absolute left-1/2 top-1/2 z-40 size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white shadow-[0_0_0_7px_rgba(24,5,37,0.28)]" />
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
