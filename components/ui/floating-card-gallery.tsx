'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type FloatingCard = {
  title: string
  description: string
  fullDescription?: string
  image: string
  /** Assinatura de quem fez a peça. */
  author?: string
  avatar?: string
  category?: string
  tags?: string[]
  /** Destino do botão do card aberto. Sem isso, o botão não aparece. */
  href?: string
  hrefLabel?: string
}

type Props = {
  cards: FloatingCard[]
  /** Cor do brilho ao redor do card em foco. */
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // O original guardava a posição do mouse em estado e re-renderizava a
  // galeria INTEIRA a cada movimento do cursor. Aqui o transform é escrito
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

  const toggle = useCallback((index: number) => {
    setActiveIndex((current) => (current === index ? null : index))
  }, [])

  // Fecha no Esc — sem isso, o card aberto só fecha no X ou clicando de novo.
  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex])

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
        {displayCards.map((card, index) => {
          const isActive = activeIndex === index
          return (
            <motion.div
              key={`${card.title}-${index}`}
              className="group relative cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azure"
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`${card.title}${card.category ? ` — ${card.category}` : ''}`}
              onClick={() => toggle(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(index)
                }
              }}
              initial={reduce ? false : { opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              animate={{ scale: isActive ? 1.04 : 1 }}
              transition={{ duration: 0.6, delay: reduce ? 0 : (index % 3) * 0.08, type: 'spring', stiffness: 100 }}
              whileHover={reduce ? undefined : { scale: 1.03, transition: { duration: 0.2 } }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* brilho de foco */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100"
                animate={{ opacity: isActive ? 0.6 : 0, boxShadow: `0 0 40px 2px ${accentColor}` }}
                transition={{ duration: 0.4 }}
                style={{ background: `linear-gradient(135deg, ${accentColor}, transparent 80%)` }}
              />

              <div
                className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
                style={{ transformStyle: 'preserve-3d', boxShadow: '0 25px 50px -12px rgba(0,0,0,.5)' }}
              >
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-white/5">
                  <Image
                    src={card.image}
                    alt={card.description || card.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>

                <div>
                  <h3 className="font-display text-[18px] font-bold uppercase leading-tight tracking-[-0.02em] text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/60">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
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
                  {card.category && (
                    <span className="shrink-0 rounded bg-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/65">
                      {card.category}
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 z-50 flex flex-col rounded-xl bg-ink/95 p-6 backdrop-blur-md"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveIndex(null)
                      }}
                      className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
                      aria-label="Fechar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <h3 className="max-w-[85%] font-display text-[22px] font-black uppercase leading-tight tracking-[-0.03em] text-white">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-[14px] leading-relaxed text-white/70">
                      {card.fullDescription || card.description}
                    </p>

                    {card.tags && card.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-azure/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-azure"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {card.href && (
                      <a
                        href={card.href}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-azure px-5 py-2.5 text-[13px] font-bold text-ink transition-colors hover:bg-white"
                      >
                        {card.hrefLabel ?? 'Ver mais'} <span aria-hidden>↗</span>
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Partículas de fundo. Determinísticas (ver `noise`) e paradas em
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
