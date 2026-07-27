'use client'

// Barra geométrica inspirada nos cortes retos e diagonais da marca Eixo.
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap, ScrollSmoother } from '@/lib/registerGsap'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { whatsappUrl } from '@/lib/data'

// seções (desktop) — aparecem no header quando a pill "viaja" pra cima (passou da hero)
const SECTIONS = [
  { id: 'hero', label: 'Início' },
  { id: 'reel', label: 'Reel' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'work', label: 'Frentes' },
  { id: 'equipe', label: 'Método' },
]
const SECTION_IDS = SECTIONS.map((s) => s.id)

export default function SiteNav() {
  const [pill, setPill] = useState(false)
  const [past, setPast] = useState(false) // passou da hero → header vira a nav completa
  const reduce = useReducedMotion()
  const activeId = useScrollSpy(SECTION_IDS)

  // O header fica fixo a página inteira, incluindo sobre o rodapé — perto do fim
  // ele cobria a primeira linha e duplicava visualmente a logo (a mesma marca
  // aparece nos dois). Mesmo padrão do BottomNav: some suavemente quando o
  // rodapé (#contato) entra em vista.
  const [nearEnd, setNearEnd] = useState(false)
  useEffect(() => {
    const footer = document.getElementById('contato')
    if (!footer) return
    const io = new IntersectionObserver(([e]) => setNearEnd(!!e?.isIntersecting))
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  // Detecção de scroll via GSAP: o useScroll do framer-motion NÃO acompanha sob o
  // ScrollSmoother + normalizeScroll (o scroll nativo é interceptado) → pill/past
  // nunca mudavam e o morph não disparava. Lê o scroll do smoother por frame;
  // fallback nativo quando não há smoother (reduced-motion). Histerese evita flip.
  useEffect(() => {
    const update = () => {
      const sm = ScrollSmoother.get()
      const y = sm ? sm.scrollTop() : window.scrollY
      if (y > 64) setPill(true)
      else if (y < 24) setPill(false)
      // morph já no começo do scroll: a pill abre pro header
      if (y > 40) setPast(true)
      else if (y < 10) setPast(false)
    }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  // navega via ScrollSmoother (não briga com o scroll suavizado); fallback nativo
  // quando o smoother não existe (reduced-motion).
  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const smoother = ScrollSmoother.get()
    if (smoother) smoother.scrollTo(el, true, 'top top')
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-[55] px-[var(--gutter)] py-4 md:py-5"
      style={{ pointerEvents: nearEnd ? 'none' : undefined }}
    >
      <motion.nav
        initial={false}
        animate={{
          maxWidth: past ? 1160 : 680,
          backgroundColor: 'rgba(24, 5, 37, 0.96)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.18), 0 18px 40px -20px rgba(0,0,0,0.55)',
          opacity: nearEnd ? 0 : 1,
          y: nearEnd ? -16 : 0,
        }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }}
        style={{
          clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
        }}
        className="mx-auto flex items-center justify-between gap-3 whitespace-nowrap border border-white/10 px-4 py-2.5 backdrop-blur-xl sm:gap-5 md:px-6 md:py-3"
      >
        {/* lockup — wordmark Eixo de Marca */}
        <button
          type="button"
          onClick={() => goTo('hero')}
          aria-label="Eixo de Marca — início"
          className="flex shrink-0 items-center gap-[9px] font-display text-[15px] font-extrabold tracking-[-0.02em] text-white sm:gap-[11px] sm:text-[18px]"
        >
          <Image
            src="/eixo-symbol.png"
            alt=""
            width={32}
            height={32}
            priority
            className="size-7 sm:size-8"
          />
          <Image
            src="/eixo-wordmark.png"
            alt="Eixo de Marca"
            width={1515}
            height={573}
            priority
            className="h-[15px] w-auto sm:h-[17px]"
          />
        </button>

        {/* menu de seções (desktop) — a pill "pousa" aqui ao rolar pra fora da hero */}
        <motion.div
          aria-hidden={!past}
          className="hidden items-center overflow-hidden lg:flex"
          initial={false}
          animate={{ maxWidth: past ? 500 : 0, opacity: past ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30, delay: past ? 0.22 : 0 }}
          style={{ pointerEvents: past ? 'auto' : 'none' }}
        >
          <ul className="flex items-center gap-0.5 px-1">
            {SECTIONS.map((s) => {
              const isActive = activeId === s.id
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goTo(s.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-white/8 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    {s.label}
                    {isActive ? <span aria-hidden className="absolute inset-x-3.5 bottom-0 h-px bg-azure" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </motion.div>

        {/* ações */}
        <div className="flex shrink-0 items-center gap-2">
          {!pill ? (
            <button
              type="button"
              onClick={() => goTo('contato')}
              className="hidden items-center px-2 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white md:inline-flex"
            >
              Contato
            </button>
          ) : null}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
            className="group inline-flex items-center gap-1.5 bg-azure px-4 py-2 text-[13px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <span className="sm:hidden">Conversar</span>
            <span className="hidden sm:inline">Vamos conversar</span>
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </motion.nav>
    </header>
  )
}
