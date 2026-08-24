'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type FloatingCard = {
  title: string
  description: string
  image: string
  /** Assinatura de quem fez a peça. */
  author?: string
  avatar?: string
  category?: string
  /** Destino do card. O card inteiro é o link. */
  href: string
  /** Texto do contador, ex.: "3 peças". */
  meta?: string
}

type Props = {
  cards: FloatingCard[]
  /** Cor do brilho ao redor do card no hover. */
  accentColor?: string
  maxCards?: number
  className?: string
}

/** Pseudo-aleatório determinístico — o original usava Math.random() no render,
 *  o que gera valores diferentes no servidor e no cliente e quebra a
 *  hidratação (o React reclama e descarta a marcação do servidor). */
function noise(seed: number) {
  return ((Math.sin(seed * 12.9898) * 43758.5453) % 1 + 1) / 2
}

export default function FloatingCardGallery({
  cards,
  accentColor = 'rgba(255, 102, 92, 0.5)',
  maxCards = 12,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // O original guardava a posição do mouse em ESTADO e re-renderizava a
  // galeria inteira a cada movimento do cursor. Aqui o transform é escrito
  // direto no DOM: mesma inclinação, sem um render por evento de mouse.
  useEffect(() => {
    if (reduce) return
    const container = containerRef.current
    const grid = gridRef.current
    if (!container || !grid) return

    let frame = 0
    const onMove = (event: MouseEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = container.getBoundingClientRect()
        // só reage com a seção na tela
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        const x = (event.clientX - rect.left - rect.width / 2) / 40
        const y = (event.clientY - rect.top - rect.height / 2) / 40
        grid.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduce])

  const displayCards = cards.slice(0, maxCards)

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      style={{ perspective: '1500px' }}
    >
      <div
        ref={gridRef}
        className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ transformStyle: 'preserve-3d', transition: 'transform .25s ease-out' }}
      >
        {displayCards.map((card, index) => (
          <motion.div
            key={card.href}
            className="group relative"
            initial={reduce ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: reduce ? 0 : (index % 3) * 0.08,
              type: 'spring',
              stiffness: 100,
            }}
            whileHover={reduce ? undefined : { scale: 1.03, transition: { duration: 0.2 } }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* brilho no hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, transparent 80%)`,
                boxShadow: `0 0 40px 2px ${accentColor}`,
              }}
            />

            {/* O card INTEIRO é o link: antes ele abria uma sobreposição em
                cima da própria grade, que dava pouco espaço pra arte e não
                tinha URL própria. Agora leva a uma página real da marca. */}
            <Link
              href={card.href}
              className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azure"
              style={{ transformStyle: 'preserve-3d', boxShadow: '0 25px 50px -12px rgba(0,0,0,.5)' }}
            >
              {/* 4:5 — mesma proporção das peças reais, então a arte aparece
                  inteira em vez de recortada numa faixa fixa. */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-white/5">
                <Image
                  src={card.image}
                  alt={card.description || card.title}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <h3 className="font-display text-[18px] font-bold uppercase leading-tight tracking-[-0.02em] text-white">
                  {card.title}
                </h3>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-[15px] text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-azure"
                >
                  ↗
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                {card.author && (
                  <span className="flex items-center gap-2">
                    {card.avatar && (
                      <span className="relative size-7 shrink-0 overflow-hidden rounded-full border border-white/25 bg-ink/60">
                        <Image src={card.avatar} alt="" fill sizes="28px" className="object-contain p-1" />
                      </span>
                    )}
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
                      {card.author}
                    </span>
                  </span>
                )}
                <span className="shrink-0 rounded bg-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/65">
                  {card.meta ?? card.category}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Partículas de fundo. Determinísticas (ver `noise`) e ausentes em
          prefers-reduced-motion. */}
      {!reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: `${noise(i + 1) * 5 + 1}px`,
                height: `${noise(i + 2) * 5 + 1}px`,
                top: `${noise(i + 3) * 100}%`,
                left: `${noise(i + 4) * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
