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
import { DEPTH, LAYER, PARALLAX, SLOT, SPACING, SPAN, TRANSITION } from './constants'

const N = works.length

/** Módulo sempre positivo — o `%` do JS devolve negativo e quebraria a órbita. */
const mod = (n: number, m: number) => ((n % m) + m) % m

/**
 * Vitrine de serviços em órbita.
 *
 * A cena é dirigida por uma única "fase" contínua, medida em slots (0..N).
 * O card i fica a `t = i - fase` slots do centro, normalizado pra [-N/2, N/2),
 * e é isso que gera posição, escala, giro, blur e z-index.
 *
 * Por que gsap.ticker e não gsap.to(...{repeat:-1}) como o desenho original
 * pedia: um tween com repeat reinicia o valor a cada volta, e aí tanto o
 * arrasto quanto o "caminho mais curto" do clique quebram justamente na virada
 * do ciclo. Com uma fase acumulada, a volta é contínua e o resto fica trivial.
 * Continua sendo um ticker só.
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
  const speed = useRef({ v: 1 })
  const layout = useRef<{ spacing: number; span: number }>({ spacing: SPACING.xl, span: SPAN.xl })
  const pointer = useRef({ tx: 0, ty: 0, x: 0, y: 0 })
  const drag = useRef({ active: false, startX: 0, startPhase: 0, last: 0, velocity: 0, moved: 0 })
  const seizing = useRef(false) // true enquanto um clique está centralizando
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

  /** Leva a fase até o slot pedido pelo caminho mais curto (inclusive cruzando o 0). */
  const goTo = useCallback(
    (index: number, duration: number = TRANSITION.recenter) => {
      const delta = mod(index - phase.current + N / 2, N) - N / 2
      seizing.current = true
      gsap.to(phase, {
        current: phase.current + delta,
        duration,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: () => {
          seizing.current = false
        },
      })
    },
    []
  )

  useGSAP(
    () => {
      if (reduce) return

      const draw = (_time: number, deltaMs: number) => {
        const { spacing, span } = layout.current

        // avança sozinho, a não ser que o dedo ou um clique estejam no comando
        if (!drag.current.active && !seizing.current) {
          phase.current += deltaMs / 1000 / SLOT * speed.current.v
        }

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
          // some exatamente no fim do alcance — sem o corte seco do desenho original
          const opacity = a >= span ? 0 : Math.min(1, (span - a) / 0.7)

          el.style.transform =
            `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0)` +
            ` scale(${scale.toFixed(4)}) rotate(${rotate.toFixed(2)}deg)`
          el.style.opacity = opacity.toFixed(3)
          el.style.filter = `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`
          el.style.zIndex = String(LAYER.cardBase - Math.round(a))
          // card invisível não pode continuar clicável
          el.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto'
        }

        // barra: o traço ativo preenche conforme o card atravessa o centro
        const centred = Math.round(phase.current)
        const within = phase.current - centred + 0.5
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

      gsap.ticker.add(draw)
      return () => {
        gsap.ticker.remove(draw)
      }
    },
    { scope: sectionRef, dependencies: [reduce] }
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

  /* ----------------------------- interações ----------------------------- */

  const onEnter = useCallback(() => {
    if (reduce) return
    gsap.to(speed.current, { v: TRANSITION.hoverScale, duration: 0.3, overwrite: true })
  }, [reduce])

  const onLeave = useCallback(() => {
    if (reduce) return
    pointer.current.tx = 0
    pointer.current.ty = 0
    gsap.to(speed.current, { v: 1, duration: TRANSITION.hoverRamp, overwrite: true })
  }, [reduce])

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || !stageRef.current) return
      const r = stageRef.current.getBoundingClientRect()
      pointer.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      pointer.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 2

      if (drag.current.active) {
        const dx = e.clientX - drag.current.startX
        drag.current.moved = Math.max(drag.current.moved, Math.abs(dx))
        drag.current.velocity = e.clientX - drag.current.last
        drag.current.last = e.clientX
        phase.current = drag.current.startPhase - dx / layout.current.spacing
      }
    },
    [reduce]
  )

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      if (reduce) return
      drag.current = {
        active: true,
        startX: e.clientX,
        startPhase: phase.current,
        last: e.clientX,
        velocity: 0,
        moved: 0,
      }
      gsap.killTweensOf(phase)
      seizing.current = false
    },
    [reduce]
  )

  const endDrag = useCallback(() => {
    if (reduce || !drag.current.active) return
    drag.current.active = false
    // inércia curta e encaixe no slot mais próximo
    const carry = -(drag.current.velocity * 2.2) / layout.current.spacing
    const target = Math.round(phase.current + carry)
    goTo(mod(target, N), 0.55)
  }, [goTo, reduce])

  /** Um arrasto não pode virar clique no card que ficou embaixo do dedo. */
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = 0
    }
  }, [])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      const next = mod(activeRef.current + (e.key === 'ArrowRight' ? 1 : -1), N)
      if (reduce) {
        activeRef.current = next
        setActive(next)
      } else {
        goTo(next)
      }
    },
    [goTo, reduce]
  )

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

  const current = works[active]!

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="eixo-stage relative scroll-mt-24 overflow-hidden px-[var(--gutter)] py-[clamp(64px,8vw,110px)]"
    >
      {/* grão + vinheta */}
      <span aria-hidden className="eixo-stage-grain pointer-events-none absolute inset-0" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(transparent 48%, rgba(8,3,20,.55))' }}
      />

      <div className="relative mx-auto max-w-[1420px]">
        <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-stage-text-muted">
          <span className="h-px w-10 bg-stage-text/20" />
          02
        </div>

        {/* palco */}
        <div
          ref={stageRef}
          className="relative mt-8 flex justify-center sm:mt-12"
          onPointerEnter={onEnter}
          onPointerLeave={() => {
            onLeave()
            endDrag()
          }}
          onPointerMove={onMove}
          onPointerDown={onDown}
          onPointerUp={endDrag}
          onClickCapture={onClickCapture}
          style={{ perspective: 1200 }}
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

          {/* Título gigante: fica atrás de tudo e é cortado pelos antebraços —
              é essa oclusão que cria a profundidade da cena. Continua exposto
              pra leitores de tela: é o único heading da seção. */}
          <h2
            className="pointer-events-none absolute bottom-[2%] left-1/2 w-full -translate-x-1/2 text-center font-display font-black uppercase leading-[0.92] tracking-[-0.04em] text-stage-display/[.92]"
            // O mínimo de 3rem do desenho original era maior que 8.5vw abaixo
            // de ~500px, e "SEMPRE NO EIXO" vazava a tela no celular. Com um
            // mínimo baixo, quem manda no mobile é o 8.5vw e o texto cabe.
            style={{ zIndex: LAYER.title, fontSize: 'clamp(1.5rem, 8.5vw, 7.5rem)' }}
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
            <PhoneStage work={current} reduce={!!reduce} />
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
        <div className="relative mt-8 text-center sm:mt-10">
          <AnimatePresence mode="wait">
            <motion.div key={current.id} aria-hidden>
              <h3
                className="font-serif italic text-stage-text"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
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
              <p className="mx-auto mt-2 max-w-[42ch] text-[14px] leading-relaxed text-stage-text-muted">
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
          className="mt-8 outline-none"
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
    </section>
  )
}
