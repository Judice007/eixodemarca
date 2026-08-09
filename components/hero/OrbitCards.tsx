'use client'

import Image from 'next/image'
import type { MutableRefObject } from 'react'
import type { Work } from '@/lib/works'
import { CARD_SIZE, FLOAT } from './constants'

/**
 * Os cards que orbitam o celular.
 *
 * O transform de cada card é escrito direto no style pelo ticker do
 * ServiceOrbit (translate/scale/rotate), então a flutuação leve mora num
 * wrapper interno — dois transforms no mesmo elemento se sobrescreveriam.
 */

/** Duração da flutuação derivada do índice (nada de Math.random: quebraria a hidratação). */
function floatTiming(index: number) {
  const span = FLOAT.maxDuration - FLOAT.minDuration
  const duration = FLOAT.minDuration + ((index * 0.37) % 1) * span
  const delay = ((index * 0.61) % 1) * -duration
  return { animationDuration: `${duration.toFixed(2)}s`, animationDelay: `${delay.toFixed(2)}s` }
}

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

export function OrbitCards({
  works,
  activeIndex,
  cardRefs,
  onSelect,
}: {
  works: Work[]
  activeIndex: number
  cardRefs: MutableRefObject<(HTMLButtonElement | null)[]>
  onSelect: (index: number) => void
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {works.map((work, i) => {
        const size = CARD_SIZE[work.format]
        return (
          <button
            key={work.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`${work.label} — ${work.caption}`}
            aria-current={activeIndex === i ? 'step' : undefined}
            className="pointer-events-auto absolute left-1/2 top-1/2 rounded-[26px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stage-accent"
            style={{
              width: size.width,
              aspectRatio: size.aspect,
              // valor inicial: o ticker sobrescreve no primeiro frame
              transform: 'translate3d(-50%, -50%, 0)',
              willChange: 'transform, opacity, filter',
            }}
          >
            <span className="eixo-card-float block h-full w-full" style={floatTiming(i)}>
              <CardFace work={work} sizes={`${size.width}px`} />
            </span>
          </button>
        )
      })}
    </div>
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
