'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import type { MethodStep } from '@/lib/data'

/**
 * As etapas do método sobre um eixo que se preenche conforme a página rola.
 *
 * O eixo é o nome da marca, então ele carrega o significado aqui: o traço de
 * coral avança com a rolagem e cada etapa acende quando a linha a alcança —
 * o processo andando, não um enfeite.
 *
 * Nada de texto claro sobre claro: o numeral inativo é ink/60 (5.7:1) e o
 * ativo é azure-heading (3.5:1, o mínimo pra texto grande). A mudança de
 * estado é de COR, não de opacidade, justamente pra não haver estado ilegível.
 */
function Step({ step, index, reduce }: { step: MethodStep; index: number; reduce: boolean }) {
  const ref = useRef<HTMLElement>(null)
  // margem estreita: só a etapa que está na faixa central da tela fica acesa,
  // então existe sempre uma "etapa atual" enquanto se rola.
  const active = useInView(ref, { margin: '-42% 0px -45% 0px' })
  const on = reduce || active

  return (
    <motion.article
      ref={ref}
      className="relative grid items-baseline gap-x-8 gap-y-2 py-[clamp(28px,3.4vw,48px)] md:grid-cols-[4.6rem_minmax(0,1fr)] md:pl-12"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* marcador sobre o eixo */}
      <span
        aria-hidden
        className="absolute left-0 top-[clamp(34px,3.9vw,56px)] hidden size-[13px] rounded-full border-[3px] border-[#fffdfa] transition-all duration-500 md:block"
        style={{
          backgroundColor: on ? 'var(--color-azure-heading)' : 'var(--color-ink)',
          opacity: on ? 1 : 0.28,
          transform: on ? 'scale(1.25)' : 'scale(1)',
        }}
      />

      <span
        className="font-display text-[clamp(38px,4.4vw,60px)] font-black leading-[0.8] tracking-[-0.05em] transition-colors duration-500"
        style={{ color: on ? 'var(--color-azure-heading)' : 'rgba(42, 16, 74, 0.6)' }}
      >
        0{index + 1}
      </span>

      <div className="max-md:mt-2">
        <h3 className="font-display text-[clamp(22px,2.3vw,31px)] font-black leading-[1.02] tracking-[-0.03em]">
          {step.label}
        </h3>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.7] text-ink/65">{step.description}</p>
        <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-ink/70">
          {step.bullets.join(' · ')}
        </p>
      </div>
    </motion.article>
  )
}

export default function MethodAxis({ steps }: { steps: MethodStep[] }) {
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)

  // O traço acompanha a rolagem DESTA lista, não da página: assim ele começa
  // vazio ao entrar na seção e termina cheio ao sair dela.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 65%', 'end 55%'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 })

  return (
    <div ref={listRef} className="relative mt-[clamp(40px,5vw,72px)]">
      {/* trilho do eixo */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[clamp(34px,3.9vw,56px)] left-[6px] top-[clamp(34px,3.9vw,56px)] hidden w-px bg-ink/12 md:block"
      />
      {/* preenchimento coral que avança com a rolagem */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute bottom-[clamp(34px,3.9vw,56px)] left-[6px] top-[clamp(34px,3.9vw,56px)] hidden w-px origin-top bg-azure-heading md:block"
        style={{ scaleY: reduce ? 1 : fill }}
      />

      <div className="divide-y divide-ink/10">
        {steps.map((step, index) => (
          <Step key={step.key} step={step} index={index} reduce={!!reduce} />
        ))}
      </div>
    </div>
  )
}
