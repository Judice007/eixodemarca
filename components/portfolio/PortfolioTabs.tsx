'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { key: 'tudo', label: 'Tudo', href: '/#portfolio' },
  { key: 'artes', label: 'Artes', href: '/portfolio/artes' },
  { key: 'video', label: 'Vídeos', href: '/portfolio/video' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function PortfolioTabs({ hidden = [] }: { hidden?: readonly TabKey[] }) {
  const pathname = usePathname()
  const active = pathname === '/portfolio/artes' ? 'artes' : pathname === '/portfolio/video' ? 'video' : 'tudo'
  const visible = TABS.filter((tab) => !hidden.includes(tab.key))

  return (
    <nav aria-label="Filtrar portfólio" className="flex w-fit gap-1 border border-white/15 p-1">
      {visible.map((tab) => {
        const isActive = tab.key === active
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
              isActive ? 'bg-azure text-ink' : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
