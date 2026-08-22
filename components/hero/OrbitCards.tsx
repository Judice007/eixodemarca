'use client'

import Image from 'next/image'
import type { Work } from '@/lib/works'
import { CARD_SIZE } from './constants'

function CardFace({ work, sizes }: { work: Work; sizes: string }) {
  return (
    <span
      className="flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-stage-card"
      style={{ boxShadow: 'var(--shadow-near), var(--shadow-far)' }}
    >
      <span className="relative block flex-[0_0_70%] overflow-hidden rounded-[18px] p-0">
        <Image src={work.card} alt="" aria-hidden fill sizes={sizes} className="object-cover" />
        {/* tinta de acento, só pra amarrar o card ao halo do serviço */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: work.accent, mixBlendMode: 'soft-light', opacity: 0.18 }}
        />
      </span>
      <span className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-2 text-left">
        <span className="font-sans text-[11px] font-semibold leading-tight text-stage-card-ink">
          {work.label}
        </span>
        <span className="font-sans text-[10px] leading-tight text-stage-card-muted">
          {work.caption}
        </span>
      </span>
    </span>
  )
}

/** Versão sem movimento: grade legível, troca só no clique. */
export function StaticCards({
  works,
  activeIndex,
  onSelect,
}: {
  works: Work[]
  activeIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="mx-auto grid w-full max-w-[900px] grid-cols-2 gap-3 sm:grid-cols-4">
      {works.map((work, i) => (
        <button
          key={work.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${work.label} — ${work.caption}`}
          aria-current={activeIndex === i ? 'step' : undefined}
          className={`rounded-[26px] transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stage-accent ${
            activeIndex === i ? 'opacity-100' : 'opacity-70'
          }`}
          style={{ aspectRatio: CARD_SIZE[work.format].aspect }}
        >
          <CardFace work={work} sizes="(min-width: 640px) 190px, 44vw" />
        </button>
      ))}
    </div>
  )
}
