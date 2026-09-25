'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MethodStep } from '@/lib/data'

// Roxo Norte (#2a0b2e) e o vermelho de rótulo (#d22532, 4.52:1 sobre o papel)
// em rgb, porque o framer só interpola cor entre strings do mesmo formato.
const INK = '42,11,46'
const VERMELHO = '210,37,50'
// Fundo real da página (a <main> usa #fffdfa, não o --color-bone): é a cor do
// anel que "corta" o eixo em volta de cada nó.
const FUNDO = '#fffdfa'

/**
 * Uma etapa. Cada linha lê o PRÓPRIO progresso de rolagem e desenha o seu
 * trecho do eixo — como as linhas são coladas umas nas outras, o conjunto
 * parece um único traço vermelho descendo. Medir cada linha por si só (em vez
 * de um progresso global repartido em fatias iguais) é o que mantém o traço e
 * o texto sincronizados, mesmo quando uma etapa quebra em duas linhas e fica
 * mais alta que as outras.
 */
function Etapa({ step, index, reduce }: { step: MethodStep; index: number; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null)
  // 0 quando o topo da etapa cruza 78% da tela, 1 quando o pé cruza 58%.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 58%'] })

  // O texto acende logo no começo do trecho e fica aceso: é o pouso, não um
  // efeito que continua depois de lido.
  const acende = useTransform(scrollYProgress, [0, 0.18], [0, 1])
  const titulo = useTransform(acende, [0, 1], [`rgba(${INK},.2)`, `rgba(${INK},1)`])
  const corpo = useTransform(acende, [0, 1], [`rgba(${INK},.26)`, `rgba(${INK},.78)`])
  const entregas = useTransform(acende, [0, 1], [`rgba(${INK},.2)`, `rgba(${INK},.62)`])
  const numero = useTransform(acende, [0, 1], [`rgba(${VERMELHO},.3)`, `rgba(${VERMELHO},1)`])
  const no = useTransform(acende, [0, 1], [`rgba(${INK},.18)`, `rgba(${VERMELHO},1)`])

  const estatico = {
    titulo: { color: `rgba(${INK},1)` },
    corpo: { color: `rgba(${INK},.78)` },
    entregas: { color: `rgba(${INK},.62)` },
    numero: { color: `rgba(${VERMELHO},1)` },
  }

  return (
    <li ref={ref} className="group relative border-t border-ink/15">
      {/* trecho do eixo */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-ink/10">
        <motion.span
          className="absolute inset-0 origin-top bg-azure"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
        />
      </span>
      {/* nó: losango sobre o eixo, com anel na cor do fundo pra "furar" o traço.
          O top é o padding de cima + metade da primeira linha do título (a
          mesma clamp() do h3 x line-height .95 / 2) - meio losango, então ele
          fica no centro da linha em qualquer largura. */}
      <motion.span
        aria-hidden
        className="absolute left-[1.5px] top-[calc(clamp(30px,4.4vw,64px)_+_clamp(32px,5.4vw,82px)_*_0.475_-_5.5px)] size-[11px] -translate-x-1/2 rotate-45"
        style={{
          backgroundColor: reduce ? `rgba(${VERMELHO},1)` : no,
          boxShadow: `0 0 0 4px ${FUNDO}`,
        }}
      />

      <div className="grid gap-x-12 gap-y-5 py-[clamp(30px,4.4vw,64px)] pl-[clamp(28px,4.2vw,64px)] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
        <div className="flex items-baseline gap-[clamp(14px,2vw,30px)]">
          <motion.span
            className="font-display text-[clamp(15px,1.5vw,20px)] font-normal tabular-nums"
            style={reduce ? estatico.numero : { color: numero }}
          >
            0{index + 1}
          </motion.span>
          {/* Cal Sans só existe em peso 400: qualquer peso maior vira negrito
              sintético e as letras se fundem. Por isso font-normal aqui. */}
          <motion.h3
            className="font-display text-[clamp(32px,5.4vw,82px)] font-normal uppercase leading-[0.95] tracking-[-0.005em] [text-wrap:balance] transition-transform duration-500 group-hover:translate-x-2"
            style={reduce ? estatico.titulo : { color: titulo }}
          >
            {step.label}
          </motion.h3>
        </div>

        <div className="md:pt-[clamp(6px,1.1vw,16px)]">
          <motion.p
            className="max-w-[46ch] text-[15px] leading-[1.65] sm:text-[16px]"
            style={reduce ? estatico.corpo : { color: corpo }}
          >
            {step.description}
          </motion.p>
          <motion.p
            className="mt-4 font-mono text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em]"
            style={reduce ? estatico.entregas : { color: entregas }}
          >
            {step.bullets.join('  ·  ')}
          </motion.p>
        </div>
      </div>
    </li>
  )
}

export default function MethodProcess({ steps }: { steps: MethodStep[] }) {
  const reduce = !!useReducedMotion()

  return (
    <ol className="mt-[clamp(42px,6vw,80px)] border-b border-ink/15">
      {steps.map((step, index) => (
        <Etapa key={step.key} step={step} index={index} reduce={reduce} />
      ))}
    </ol>
  )
}
