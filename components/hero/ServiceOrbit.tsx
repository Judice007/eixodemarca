'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { works } from '@/lib/works'
import { whatsappUrl } from '@/lib/data'
import PhoneStage from './PhoneStage'
import { OrbitCards, StaticCards } from './OrbitCards'
import ProgressBar from './ProgressBar'
import CtaChip from './CtaChip'
import { DEPTH, LAYER, PARALLAX, SCROLL, SPACING, SPAN } from './constants'

const N = works.length

/** Módulo sempre positivo — o `%` do JS devolve negativo e quebraria a órbita. */
const mod = (n: number, m: number) => ((n % m) + m) % m
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)

/**
 * Vitrine de serviços em órbita, dirigida pelo scroll.
 *
 * A seção é alta (works.length * SCROLL.vhPerService) e o palco fica preso na
 * tela com position: sticky. O progresso da rolagem dentro dela vira a "fase"
 * da órbita: fase 0 = primeiro serviço no centro, fase N-1 = último. O card i
 * fica a `t = i - fase` slots do centro, normalizado pra [-N/2, N/2), e disso
 * saem posição, escala, giro, blur e z-index.
 *
 * O scroll define uma fase ALVO; o ticker interpola até ela. Sem essa
 * suavização a roda do mouse faria a órbita andar aos saltos.
 */
export default function ServiceOrbit() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([])

  // estado da animação vive em refs: o ticker roda fora do ciclo de render
  const phase = useRef(0)
  const targetPhase = useRef(0)
  const layout = useRef<{ spacing: number; span: number }>({ spacing: SPACING.xl, span: SPAN.xl })
  const pointer = useRef({ tx: 0, ty: 0, x: 0, y: 0 })
  const activeRef = useRef(0)

  /** Distância/alcance mudam por breakpoint (e não dá pra fazer isso só com CSS). */
  useEffect(() => {
    const xl = window.matchMedia('(min-width: 1280px)')
    const md = window.matchMedia('(min-width: 768px)')
    const apply = () => {
      layout.current = xl.matches
        ? { spacing: SPACING.xl, span: SPAN.xl }
        : md.matches
          ? { spacing: SPACING.md, span: SPAN.md }
          : { spacing: SPACING.base, span: SPAN.base }
    }
    apply()
    xl.addEventListener('change', apply)
    md.addEventListener('change', apply)
    return () => {
      xl.removeEventListener('change', apply)
      md.removeEventListener('change', apply)
    }
  }, [])

  /** Quanto de rolagem existe dentro da seção presa. */
  const scrollRange = useCallback(() => {
    const el = sectionRef.current
    if (!el) return { top: 0, total: 0 }
    const top = el.offsetTop
    const total = Math.max(el.offsetHeight - window.innerHeight, 1)
    return { top, total }
  }, [])

  /** Rola até deixar o serviço `index` no centro. */
  const goTo = useCallback(
    (index: number) => {
      const { top, total } = scrollRange()
      const y = top + (index / (N - 1)) * total
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
    },
    [reduce, scrollRange]
  )

  useGSAP(
    () => {
      if (reduce) return

      const readScroll = () => {
        const { top, total } = scrollRange()
        const progress = clamp((window.scrollY - top) / total, 0, 1)
        targetPhase.current = progress * (N - 1)
      }

      const draw = () => {
        const { spacing, span } = layout.current

        // segue a fase alvo do scroll com suavização
        phase.current += (targetPhase.current - phase.current) * SCROLL.smoothing

        // parallax com lerp
        pointer.current.x += (pointer.current.tx - pointer.current.x) * PARALLAX.lerp
        pointer.current.y += (pointer.current.ty - pointer.current.y) * PARALLAX.lerp
        const px = pointer.current.x
        const py = pointer.current.y

        if (deviceRef.current) {
          deviceRef.current.style.transform =
            `translate3d(${(px * PARALLAX.device).toFixed(2)}px, ${(py * PARALLAX.device).toFixed(2)}px, 0)` +
            ` rotateY(${(px * PARALLAX.deviceTilt).toFixed(2)}deg)`
        }

        for (let i = 0; i < N; i++) {
          const el = cardRefs.current[i]
          if (!el) continue

          let t = mod(i - phase.current, N)
          if (t > N / 2) t -= N
          const a = Math.abs(t)

          const x = t * spacing - px * PARALLAX.cards
          const y = Math.pow(a, DEPTH.liftPow) * DEPTH.lift - py * PARALLAX.cards
          const clamped = Math.min(a, DEPTH.scaleClamp)
          const scale = 1 - clamped * DEPTH.scaleStep
          const rotate = t * DEPTH.rotate
          const blur = Math.min(a * DEPTH.blurStep, DEPTH.blurMax)
          const bright = 1 - clamped * DEPTH.dim
          // some exatamente no fim do alcance — sem corte seco
          const opacity = a >= span ? 0 : Math.min(1, (span - a) / 0.7)

          el.style.transform =
            `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0)` +
            ` scale(${scale.toFixed(4)}) rotate(${rotate.toFixed(2)}deg)`
          el.style.opacity = opacity.toFixed(3)
          el.style.filter = `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`
          el.style.zIndex = String(LAYER.cardBase - Math.round(a))
          el.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto'
        }

        // barra: o traço ativo preenche conforme o card atravessa o centro
        const centred = Math.round(phase.current)
        const within = clamp(phase.current - centred + 0.5, 0, 1)
        for (let i = 0; i < N; i++) {
          const fill = fillRefs.current[i]
          if (!fill) continue
          fill.style.transform = `scaleX(${i === mod(centred, N) ? within.toFixed(3) : '0'})`
        }

        const nextActive = mod(centred, N)
        if (nextActive !== activeRef.current) {
          activeRef.current = nextActive
          setActive(nextActive)
        }
      }

      readScroll()
      phase.current = targetPhase.current
      gsap.ticker.add(draw)
      window.addEventListener('scroll', readScroll, { passive: true })
      window.addEventListener('resize', readScroll)

      return () => {
        gsap.ticker.remove(draw)
        window.removeEventListener('scroll', readScroll)
        window.removeEventListener('resize', readScroll)
      }
    },
    { scope: sectionRef, dependencies: [reduce, scrollRange] }
  )

  /** Halo e sombra de contato reagem à troca de serviço. */
  useGSAP(
    () => {
      if (reduce) return
      if (haloRef.current) {
        gsap.to(haloRef.current, {
          backgroundColor: works[active]!.accent,
          duration: 0.9,
          ease: 'power2.out',
        })
      }
      if (shadowRef.current) {
        gsap.fromTo(
          shadowRef.current,
          { scaleX: 1 },
          { scaleX: 1.03, duration: 0.45, yoyo: true, repeat: 1, ease: 'power2.inOut' }
        )
      }
    },
    { scope: sectionRef, dependencies: [active, reduce] }
  )

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || !stageRef.current) return
      const r = stageRef.current.getBoundingClientRect()
      pointer.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      pointer.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    },
    [reduce]
  )

  const onLeave = useCallback(() => {
    pointer.current.tx = 0
    pointer.current.ty = 0
  }, [])

  const select = useCallback(
    (index: number) => {
      if (reduce) {
        activeRef.current = index
        setActive(index)
        return
      }
      goTo(index)
    },
    [goTo, reduce]
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      select(clamp(activeRef.current + (e.key === 'ArrowRight' ? 1 : -1), 0, N - 1))
    },
    [select]
  )

  const current = works[active]!

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="eixo-stage relative scroll-mt-0"
      // Seção alta + palco sticky: a rolagem dentro dela é o que gira a órbita.
      // Sem movimento, não há o que percorrer — vira uma seção normal.
      style={reduce ? undefined : { height: `${N * SCROLL.vhPerService}vh` }}
    >
      <div
        className={`${reduce ? '' : 'sticky top-0 h-screen'} flex flex-col justify-center overflow-hidden px-[var(--gutter)] py-10`}
      >
        {/* grão + vinheta */}
        <span aria-hidden className="eixo-stage-grain pointer-events-none absolute inset-0" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(transparent 48%, rgba(8,3,20,.55))' }}
        />

        <div className="relative mx-auto w-full max-w-[1420px]">
          <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-stage-text-muted">
            <span className="h-px w-10 bg-stage-text/20" />
            02
          </div>

          {/* palco */}
          <div
            ref={stageRef}
            className="relative mt-4 flex justify-center sm:mt-6"
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            // O padding embaixo reserva a faixa do título gigante, senão o
            // aparelho cobria o miolo da palavra.
            style={{ perspective: 1200, paddingBottom: 'clamp(1.4rem, 7vw, 5.5rem)' }}
          >
            {/* halo do serviço ativo */}
            <div
              ref={haloRef}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] h-[42%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                zIndex: LAYER.halo,
                backgroundColor: works[0]!.accent,
                filter: 'blur(100px)',
                opacity: 0.28,
              }}
            />

            {/* Título gigante, na faixa reservada pelo padding do palco. */}
            <h2
              className="pointer-events-none absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center font-display font-black uppercase leading-[0.92] tracking-[-0.04em] text-stage-display/[.92]"
              style={{ zIndex: LAYER.title, fontSize: 'clamp(1.4rem, 7vw, 6rem)' }}
            >
              Sempre no eixo
            </h2>

            {/* trilha da órbita */}
            <svg
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[46%] h-[36%] w-[92%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
              style={{ zIndex: LAYER.track }}
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
            >
              <ellipse
                cx="50"
                cy="20"
                rx="49"
                ry="19"
                fill="none"
                stroke="var(--color-stage-accent)"
                strokeWidth="0.25"
                opacity="0.12"
              />
            </svg>

            {!reduce && (
              <OrbitCards works={works} activeIndex={active} cardRefs={cardRefs} onSelect={select} />
            )}

            {/* sombra de contato */}
            <div
              ref={shadowRef}
              aria-hidden
              className="pointer-events-none absolute bottom-[2%] left-1/2 h-[5%] w-[38%] -translate-x-1/2 rounded-[50%]"
              style={{ zIndex: LAYER.halo, background: 'rgba(8,3,20,.55)', filter: 'blur(22px)' }}
            />

            {/* aparelho */}
            <div ref={deviceRef} className="relative" style={{ zIndex: LAYER.phone }}>
              <PhoneStage works={works} activeIndex={active} reduce={!!reduce} />
            </div>

            <CtaChip href={whatsappUrl} reduce={!!reduce} />
          </div>

          {/* grade estática substitui a órbita quando o usuário pede menos movimento */}
          {reduce && (
            <div className="mt-10">
              <StaticCards works={works} activeIndex={active} onSelect={select} />
            </div>
          )}

          {/* nome do serviço ativo */}
          <div className="relative mt-5 text-center sm:mt-7">
            <AnimatePresence mode="wait">
              <motion.div key={current.id} aria-hidden>
                <h3
                  className="font-serif italic text-stage-text"
                  style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)' }}
                >
                  {current.label.split('').map((char, i) => (
                    <motion.span
                      key={`${current.id}-${i}`}
                      className="inline-block whitespace-pre"
                      initial={reduce ? false : { y: 14, opacity: 0, filter: 'blur(6px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={reduce ? { opacity: 0 } : { y: -10, opacity: 0, filter: 'blur(6px)' }}
                      transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.02, ease: [0.25, 1, 0.5, 1] }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h3>
                <p className="mx-auto mt-1.5 max-w-[42ch] text-[13px] leading-relaxed text-stage-text-muted">
                  {current.caption}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* leitor de tela: só isto anuncia a troca, o título acima é decorativo */}
            <p aria-live="polite" className="sr-only">
              {current.label}. {current.caption}
            </p>
          </div>

          <div
            className="mt-5 outline-none"
            role="group"
            aria-label="Navegar entre os serviços"
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            <ProgressBar
              count={N}
              activeIndex={active}
              fillRefs={fillRefs}
              labels={works.map((w) => w.label)}
              onSelect={select}
              reduce={!!reduce}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
