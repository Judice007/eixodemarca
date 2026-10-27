'use client'

import Image from 'next/image'
import { useState } from 'react'

export type PaginaManual = { src: string; w: number; h: number }
export type Manual = { id: string; nome: string; nota: string; paginas: PaginaManual[] }

// Páginas dos manuais de marca que entregamos. Troca de marca pelos botões;
// as páginas correm para o lado, como virar o manual.
export default function ManuaisDeMarca({ manuais }: { manuais: Manual[] }) {
  const [ativo, setAtivo] = useState(manuais[0]!.id)
  const atual = manuais.find((m) => m.id === ativo) ?? manuais[0]!

  return (
    <div>
      <div role="group" aria-label="Manuais de marca" className="flex flex-wrap gap-2">
        {manuais.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={m.id === atual.id}
            onClick={() => setAtivo(m.id)}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[13px] font-semibold transition-colors ${
              m.id === atual.id ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink/75 hover:bg-ink/5'
            }`}
          >
            {m.nome}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[13px] text-ink/55">
        Manual de marca · {atual.nota} · {atual.paginas.length} páginas, arraste para o lado
      </p>

      <ul key={atual.id} className="mt-3 flex snap-x gap-3 overflow-x-auto rounded-xl bg-ink/[0.04] p-3 [scrollbar-width:thin]">
        {atual.paginas.map((p, i) => {
          const alta = p.h > p.w
          return (
            <li key={p.src} className="shrink-0 snap-start">
              <Image
                src={p.src}
                alt={`Manual de marca ${atual.nome}, página ${i + 1}`}
                width={p.w}
                height={p.h}
                sizes={alta ? '260px' : '460px'}
                className={`w-auto rounded-md shadow-sm ${alta ? 'h-[360px] sm:h-[420px]' : 'h-[200px] sm:h-[260px]'}`}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
