'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/**
 * Indicador de progresso do scroll. A scrollbar nativa é escondida de
 * propósito (ver app/globals.css — resquício de uma tentativa de
 * ScrollSmoother), então isso vira o único jeito de perceber onde você está
 * na página.
 *
 * useSpring atrasa o cometa em relação ao scroll real — ele "arrasta" pra
 * alcançar a posição em vez de grudar 1:1 como uma barra comum, e é esse
 * atraso elástico que dá a sensação de diferente/vivo.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 24, mass: 0.5 })

  // Container tem largura 0 e cada filho usa left-0 + -translate-x-1/2, então
  // trilho e cometa ficam sempre centrados na mesma linha vertical, não
  // importa a largura própria de cada um.
  const top = useTransform(progress, (v) => `calc(12px + (100% - 24px) * ${v})`)
  const trailHeight = useTransform(progress, (v) => `calc((100% - 24px) * ${v})`)

  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 right-3 z-[60] w-0">
      <div className="absolute inset-y-3 left-0 w-px -translate-x-1/2 bg-ink/10" />
      <motion.div
        className="absolute left-0 top-3 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-azure/60 to-azure"
        style={{ height: trailHeight }}
      />
      <motion.div className="absolute left-0 -translate-x-1/2 -translate-y-1/2" style={{ top }}>
        <motion.span
          className="block size-[7px] rounded-full bg-azure"
          style={{ boxShadow: '0 0 10px 3px rgba(255,102,92,.55)' }}
          animate={reduce ? undefined : { scale: [1, 1.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
}
