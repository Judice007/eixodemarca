'use client'

import { useRef, useState } from 'react'

interface PanelDef {
  num: string
  title: string
  content: (active: boolean) => React.ReactNode
}

interface BookLayoutProps {
  panels: PanelDef[]
}

function MagneticHandle({
  num, title, onClick,
}: { num: string; title: string; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 120) {
      const strength = (120 - dist) / 120
      el.style.transform = `translate(${dx * strength * 0.15}px, ${dy * strength * 0.15}px)`
    }
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
    el.style.transform = 'translate(0,0)'
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = ''
    }, 500)
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="handle-btn"
      aria-label={`Ir para ${title}`}
    >
      <span className="text-[0.75rem] font-black text-accent">{num}</span>
      <h2 className="handle-title">{title}</h2>
    </button>
  )
}

export default function BookLayout({ panels }: BookLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = panels.length

  return (
    <div className="relative w-screen overflow-hidden bg-main" style={{ height: '100dvh' }}>
      {panels.map((panel, i) => {
        const isExpanded = i <= activeIndex
        return (
          <div
            key={i}
            className="panel"
            data-expanded={isExpanded ? 'true' : 'false'}
            style={
              {
                '--panel-index': i,
                '--panel-total': total,
                zIndex: i + 1,
              } as React.CSSProperties
            }
          >
            <MagneticHandle
              num={panel.num}
              title={panel.title}
              onClick={() => setActiveIndex(i)}
            />
            <div
              className="flex-1 h-full overflow-y-auto scrollbar-hide"
              style={{ paddingRight: `calc(${(total - i) * 80}px + 40px)` }}
            >
              {panel.content(i === activeIndex)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
