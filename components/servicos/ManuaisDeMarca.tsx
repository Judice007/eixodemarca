'use client'

import Image from 'next/image'
import { useState } from 'react'

export type PaginaManual = { src: string; w: number; h: number }
export type Manual = { id: string; nome: string; nota: string; paginas: PaginaManual[] }

const Seta = ({ lado }: { lado: 'esq' | 'dir' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
    <path d={lado === 'esq' ? 'M11.5 3.5 6 9l5.5 5.5' : 'M6.5 3.5 12 9l-5.5 5.5'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Visualizador dos manuais de marca que entregamos: escolhe a marca, passa as
// páginas pelas setas (ou teclado) e pula direto por uma miniatura.
export default function ManuaisDeMarca({ manuais }: { manuais: Manual[] }) {
  const [ativo, setAtivo] = useState(manuais[0]!.id)
  const [pagina, setPagina] = useState(0)
  const atual = manuais.find((m) => m.id === ativo) ?? manuais[0]!
  const total = atual.paginas.length
  const p = atual.paginas[pagina]!

  const ir = (i: number) => setPagina((i + total) % total)
  const trocar = (id: string) => {
    setAtivo(id)
    setPagina(0)
  }

  return (
    <div>
      <div role="group" aria-label="Manuais de marca" className="flex flex-wrap gap-2">
        {manuais.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={m.id === atual.id}
            onClick={() => trocar(m.id)}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[13px] font-semibold transition-colors ${
              m.id === atual.id ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink/75 hover:bg-ink/5'
            }`}
          >
            {m.nome}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[13px] leading-snug text-ink/60">
        Manual de marca <strong className="text-ink">{atual.nome}</strong>: {atual.nota}.
      </p>

      <div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') ir(pagina + 1)
          if (e.key === 'ArrowLeft') ir(pagina - 1)
        }}
        aria-label={`Páginas do manual ${atual.nome}`}
        className="relative mt-3 flex h-[300px] items-center justify-center rounded-xl bg-ink/[0.06] p-3 outline-offset-2 sm:h-[500px] sm:p-5"
      >
        <Image
          key={p.src}
          src={p.src}
          alt={`Manual de marca ${atual.nome}, página ${pagina + 1} de ${total}`}
          width={p.w}
          height={p.h}
          sizes="(min-width: 1024px) 700px, 92vw"
          className="h-full w-auto max-w-full rounded-md object-contain shadow-md"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(pagina - 1)}
              aria-label="Página anterior"
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-105"
            >
              <Seta lado="esq" />
            </button>
            <button
              type="button"
              onClick={() => ir(pagina + 1)}
              aria-label="Próxima página"
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-105"
            >
              <Seta lado="dir" />
            </button>
          </>
        )}

        <span className="absolute bottom-2 left-3 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[11px] text-white">
          {pagina + 1} / {total}
        </span>
        <a href={p.src} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-3 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-ink shadow-sm">
          Ampliar
        </a>
      </div>

      <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" aria-label="Páginas">
        {atual.paginas.map((x, i) => (
          <li key={x.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setPagina(i)}
              aria-label={`Ir para a página ${i + 1}`}
              aria-current={i === pagina}
              className={`block overflow-hidden rounded-md border-2 transition-opacity ${i === pagina ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <Image src={x.src} alt="" width={x.w} height={x.h} sizes="120px" className="h-14 w-auto sm:h-16" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
