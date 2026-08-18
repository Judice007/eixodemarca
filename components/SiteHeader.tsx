'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import PontoCegoCta from '@/components/PontoCegoCta'

// Hrefs com /#... (não só #...) pra funcionar tanto na home quanto nas
// páginas dedicadas de portfólio — de lá, precisa voltar pra home antes de
// rolar até a seção.
const NAV_LINKS = [
  ['Serviços', '/#servicos'],
  ['Portfólio', '/#portfolio'],
  ['Método', '/#metodo'],
  ['Contato', '/#contato'],
] as const

export default function SiteHeader() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 72)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'px-4 pt-2 sm:px-7' : 'px-3 pt-3 sm:px-5 sm:pt-4'}`}>
      <div
        className={`mx-auto flex items-center justify-between border border-ink/10 bg-white/92 shadow-[0_16px_45px_-30px_rgba(42,16,74,.35)] backdrop-blur-xl transition-all duration-500 ${
          scrolled ? 'max-w-[1160px] px-4 py-2 sm:px-5' : 'max-w-[1420px] px-4 py-3 sm:px-7'
        }`}
      >
        <Link href="/#top" aria-label="Eixo de Marca — início" className="shrink-0">
          <Image
            src="/eixo-wordmark.png"
            alt="Eixo de Marca"
            width={1515}
            height={573}
            priority
            sizes="64px"
            className={`w-auto transition-all duration-500 ${scrolled ? 'h-[18px]' : 'h-[21px] sm:h-6'}`}
            style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(37%) saturate(3825%) hue-rotate(258deg) brightness(76%) contrast(104%)' }}
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-[14px] font-medium lg:flex">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-azure after:transition-transform hover:text-azure-label hover:after:scale-x-100"
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid size-10 place-items-center border border-ink/15 lg:hidden"
          >
            <span className="relative h-3.5 w-4">
              <span className={`absolute left-0 top-0.5 h-px w-4 bg-ink transition-transform ${mobileMenuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0.5 left-0 h-px w-4 bg-ink transition-transform ${mobileMenuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
          {/* CTA principal do header — no lugar do antigo "Vamos conversar"
              genérico. Mesmo breakpoint de antes: abaixo de 430px não cabe
              ao lado do logo, então fica só dentro do menu mobile. */}
          <PontoCegoCta variant="header" className="hidden min-[430px]:inline-flex" />
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Navegação mobile"
            className="mx-auto mt-2 grid max-w-[1420px] border border-white/10 bg-ink px-5 py-3 text-white shadow-2xl lg:hidden"
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map(([label, href], index) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-3.5 font-sans text-[13px] font-semibold last:border-b-0"
              >
                <span>{label}</span>
                <span className="font-sans text-[9px] text-azure">0{index + 1}</span>
              </Link>
            ))}
            <PontoCegoCta variant="outline" className="mt-3 justify-center min-[430px]:hidden" />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
