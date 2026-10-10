'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

// 'some' + margem no pé da tela: dispara quando o topo do bloco passa de 88%
// da altura da tela, qualquer que seja a altura do bloco. Com amount numérico
// (fração do bloco), uma grade mais alta que ~10 telas nunca mostrava 10% de
// si e ficava invisível pra sempre.
const REVEAL_VIEWPORT = { once: true, amount: 'some', margin: '0px 0px -12% 0px' } as const

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
      viewport={REVEAL_VIEWPORT}
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
      viewport={REVEAL_VIEWPORT}
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
