'use client'

import Image from 'next/image'
import type { MutableRefObject } from 'react'
import type { Work } from '@/lib/works'
import { CARD_SIZE } from './constants'

/**
 * Os cards que orbitam o celular.
 *
 * O transform de cada card é escrito direto no style pelo ticker do
 * ServiceOrbit (translate/scale/rotate), então a flutuação leve mora num
 * wrapper interno — dois transforms no mesmo elemento se sobrescreveriam.
 */

function CardFace({
  work,
  sizes,
  active = false,
  showText = true,
}: {
  work: Work
  sizes: string
  active?: boolean
  showText?: boolean
}) {
  return (
    <span
      className={`flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-stage-card transition-[border-color,box-shadow] duration-300 ${
        active ? 'border-2 border-stage-accent' : 'border border-white/10'
      }`}
      style={{
        boxShadow: active
          ? `0 0 0 4px ${work.accent}55, var(--shadow-near), var(--shadow-far)`
          : 'var(--shadow-near), var(--shadow-far)',
      }}
    >
      <span className={`relative block overflow-hidden rounded-[18px] p-0 ${showText ? 'flex-[0_0_70%]' : 'flex-1'}`}>
        <Image src={work.card} alt="" aria-hidden fill sizes={sizes} className="object-cover" />
        {/* tinta de acento, só pra amarrar o card ao halo do serviço */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: work.accent, mixBlendMode: 'soft-light', opacity: 0.18 }}
        />
      </span>
      {showText && (
        <span className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-2 text-left">
          <span className="font-sans text-[11px] font-semibold leading-tight text-stage-card-ink">{work.label}</span>
          <span className="font-sans text-[10px] leading-tight text-stage-card-muted">{work.caption}</span>
        </span>
      )}
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
            // Atalho só pra mouse e toque: teclado e leitor de tela usam a lista
            // (desktop) e a barra de baixo (celular), que fazem o mesmo e estão
            // sempre visíveis. Parar em cards escondidos atrás do aparelho era
            // um beco.
            tabIndex={-1}
            aria-hidden
            className="pointer-events-auto absolute left-1/2 top-1/2 rounded-[26px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stage-accent"
            style={{
              width: size.width,
              aspectRatio: size.aspect,
              // valor inicial: o ticker sobrescreve no primeiro frame
              transform: 'translate3d(-50%, -50%, 0)',
              willChange: 'transform, opacity, filter',
            }}
          >
            <span className="block h-full w-full">
              <CardFace work={work} sizes={`${size.width}px`} active={activeIndex === i} showText={false} />
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
          <CardFace work={work} sizes="(min-width: 640px) 190px, 44vw" active={activeIndex === i} />
        </button>
      ))}
    </div>
  )
}
