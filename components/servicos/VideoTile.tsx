'use client'

import Image from 'next/image'
import { useState } from 'react'

// Poster leve; o vídeo só é baixado quando a pessoa toca.
export default function VideoTile({
  src,
  poster,
  titulo,
  legenda,
  ratio = 'aspect-[9/16]',
}: {
  src: string
  poster: string
  titulo: string
  legenda?: string
  ratio?: string
}) {
  const [tocando, setTocando] = useState(false)

  return (
    <figure>
      <div className={`relative ${ratio} overflow-hidden rounded-lg bg-ink/5`}>
        {tocando ? (
          <video src={src} poster={poster} autoPlay controls playsInline loop className="absolute inset-0 h-full w-full bg-black object-cover" />
        ) : (
          <button type="button" onClick={() => setTocando(true)} aria-label={`Tocar vídeo: ${titulo}`} className="group absolute inset-0 block h-full w-full">
            <Image src={poster} alt={titulo} fill sizes="(min-width: 1024px) 18vw, 44vw" className="object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-black/10 transition-colors group-hover:bg-black/25">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink shadow-md">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      {legenda && <figcaption className="mt-1.5 text-[12px] leading-snug text-ink/55">{legenda}</figcaption>}
    </figure>
  )
}
