'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import type { MethodStep } from '@/lib/data'

const cellLayout = [
  'md:border-b md:border-r md:pb-20 md:pr-24',
  'md:border-b md:items-end md:pb-20 md:pl-24 md:text-right',
  'md:border-r md:pr-24 md:pt-20',
  'md:items-end md:pl-24 md:pt-20 md:text-right',
] as const

function Step({ step, index, reduce }: { step: MethodStep; index: number; reduce: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref, { margin: '-24% 0px -24% 0px', amount: 0.35 })
  const on = reduce || active

  return (
    <motion.article
      ref={ref}
      className={`group relative flex min-h-[270px] flex-col overflow-hidden border-white/14 p-7 transition-colors duration-500 sm:p-9 md:min-h-[350px] md:p-12 ${
        index < 3 ? 'max-md:border-b' : ''
      } ${cellLayout[index]}`}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.75, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ backgroundColor: on ? 'rgba(255,255,255,0.045)' : 'transparent' }}
    >
      <motion.span
        aria-hidden
        className={`absolute top-0 h-1 bg-azure-heading ${index % 2 === 0 ? 'left-0' : 'right-0'}`}
        animate={{ width: on ? '34%' : '10%' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      />

      <span
        aria-hidden
        className={`pointer-events-none absolute top-5 font-display text-[clamp(82px,9vw,142px)] font-black leading-none tracking-[-0.08em] transition-colors duration-500 md:top-8 ${
          index % 2 === 0 ? 'right-6 md:right-9' : 'left-6 md:left-9'
        }`}
        style={{ color: on ? 'rgba(255,103,96,0.24)' : 'rgba(255,255,255,0.07)' }}
      >
        0{index + 1}
      </span>

      <div className="relative z-10 mt-auto max-w-[520px]">
        <div className={`mb-5 flex items-center gap-3 ${index % 2 === 1 ? 'md:justify-end' : ''}`}>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-azure-on-dark">Movimento</span>
          <span aria-hidden className="h-px w-8 bg-azure-heading/70" />
          <span className="font-mono text-[10px] text-white/55">0{index + 1}</span>
        </div>

        <h3 className="font-display text-[clamp(28px,3vw,42px)] font-black leading-[0.98] tracking-[-0.035em] text-white">
          {step.label}
        </h3>
        <p className="mt-4 max-w-[48ch] text-[14px] leading-[1.7] text-white/68 sm:text-[15px]">{step.description}</p>
        <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/52 sm:text-[10px]">
          {step.bullets.join(' / ')}
        </p>
      </div>
    </motion.article>
  )
}

export default function MethodAxis({ steps }: { steps: MethodStep[] }) {
  const reduce = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start 78%', 'end 42%'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 72, damping: 24, mass: 0.45 })

  return (
    <div
      ref={gridRef}
      className="relative mt-[clamp(42px,6vw,80px)] overflow-hidden border border-ink/16 bg-ink text-white shadow-[0_36px_90px_-55px_rgba(40,17,46,.72)]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
        backgroundSize: '42px 42px',
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/12" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/12" />
        <motion.span
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 origin-center bg-azure-heading"
          style={{ scaleY: reduce ? 1 : fill }}
        />
        <motion.span
          className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 origin-center bg-azure-heading"
          style={{ scaleX: reduce ? 1 : fill }}
        />
      </div>

      <div className="relative z-10 grid md:grid-cols-2">
        {steps.map((step, index) => (
          <Step key={step.key} step={step} index={index} reduce={!!reduce} />
        ))}
      </div>

      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 z-20 hidden size-28 -translate-x-1/2 -translate-y-1/2 rotate-45 place-items-center border border-azure-heading bg-ink shadow-[0_0_0_10px_rgba(40,17,46,.88)] md:grid"
      >
        <div className="flex -rotate-45 flex-col items-center justify-center leading-none">
          <span className="font-display text-[46px] font-black tracking-[-0.08em] text-azure-heading">X</span>
          <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.28em] text-white/70">Eixo</span>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 size-56 rotate-45 border border-white/8" />
    </div>
  )
}
