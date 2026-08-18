'use client'

import { pontoCegoWhatsappUrl } from '@/lib/data'

// Luz que segue o cursor: acompanha o próprio conceito (achar o que você não
// enxerga sozinho). Só no hover — não é decoração ambiente, é resposta a uma
// ação da pessoa.
function spotlightMove(event: React.MouseEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`)
}

/** Mira: remete a "pinpointar" o ponto cego em vez de um emoji genérico. */
function TargetIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative shrink-0 text-azure">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
      <path d="M8 .5V3M8 13v2.5M.5 8H3M13 8h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function PontoCegoCta({
  variant = 'solid',
  className = '',
}: {
  /** solid: pílula ink cheia, pro fundo claro da hero. outline: contorno, pro rodapé (já é bg-ink). */
  variant?: 'solid' | 'outline'
  className?: string
}) {
  const skin =
    variant === 'solid'
      ? 'rounded-full bg-ink text-paper shadow-[0_14px_32px_-14px_rgba(42,16,74,.6)]'
      : 'border border-white/25 text-white hover:border-azure/60'

  return (
    <a
      href={pontoCegoWhatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={spotlightMove}
      className={`group relative flex w-fit items-center gap-2.5 overflow-hidden px-5 py-3 text-[13px] font-bold transition-transform hover:-translate-y-0.5 sm:text-[14px] ${skin} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(120px circle at var(--x, 50%) var(--y, 50%), rgba(255,102,92,.4), transparent 70%)',
        }}
      />
      <TargetIcon />
      <span className="relative">
        Quero descobrir meu <span className="text-azure">Ponto Cego</span>
      </span>
      <span aria-hidden className="relative">
        ↗
      </span>
    </a>
  )
}
