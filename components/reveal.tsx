'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'

export function SectionNumber({ number }: { number: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/65">
      <span className="h-px w-10 bg-ink/20" />
      {number}
    </div>
  )
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduce ? 0 : 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const revealGroupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } },
}

// Mesmo efeito visual do Reveal (fade + sobe ao entrar na tela), mas pra
// GRADES de cards: um único whileInView no container dispara o stagger de
// todos os filhos via variants, em vez de cada card montar seu próprio
// observer/animação — bem mais leve no carregamento em seções com vários
// itens (projetos, vídeos do portfólio, método).
export function RevealGroup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={reduce ? undefined : revealGroupVariants}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  // Checa reduced-motion aqui também, em vez de confiar no initial={false} do
  // RevealGroup se propagar: se a propagação falhasse, o item ficaria preso em
  // opacity 0 — ou seja, conteúdo invisível. Sem variants não há estado oculto.
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} variants={reduce ? undefined : revealItemVariants}>
      {children}
    </motion.div>
  )
}

/**
 * A grade inteira é tratada como um painel único (não cada card por si) que
 * sobe uma "ladeira": além de girar (rotateX) e crescer (scale), ela também
 * se desloca de baixo pra cima (y), ligada à posição do scroll — não é só
 * virar de frente, é subir E nivelar ao mesmo tempo, como se estivesse
 * escalando uma rampa até chegar no plano reto da tela. transformOrigin
 * embaixo: o painel gira a partir da base, então a base fica "ancorada"
 * enquanto o topo se aproxima do plano da tela.
 */
export function TiltGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // Janela mais larga (98% -> 15%) = mais distância de scroll pro efeito
  // acontecer, ou seja, transição mais lenta/gradual.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 98%', 'start 15%'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [50, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.68, 1])
  const y = useTransform(scrollYProgress, [0, 1], [140, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.25, 1])

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ perspective: 1400 }}>
      <motion.div ref={ref} className={className} style={{ rotateX, scale, y, opacity, transformOrigin: '50% 100%' }}>
        {children}
      </motion.div>
    </div>
  )
}
