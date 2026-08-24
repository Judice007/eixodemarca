'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { portfolioVideos } from '@/lib/portfolio'
import { RevealGroup, RevealItem } from '@/components/reveal'

function PortfolioVideoCard({ video, index }: { video: (typeof portfolioVideos)[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  // Play só quando a pessoa toca no card — sem autoplay no scroll, os vídeos
  // não competem por banda/decodificação ao mesmo tempo enquanto o usuário rola a página.
  useEffect(() => {
    const element = videoRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) element.pause()
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const handlePlay = () => {
    void videoRef.current?.play().catch(() => undefined)
  }

  return (
    <RevealItem>
      <article className="group">
        <div className="relative aspect-[9/16] overflow-hidden bg-white/5">
          {/* Capa como next/image em vez do atributo `poster`: o poster é
              buscado sempre, mesmo com o card longe da dobra, e sem passar
              pelo otimizador. Como next/image ele é lazy e sai no tamanho
              certo. Some quando o vídeo começa. */}
          {!playing && (
            <Image
              src={video.poster}
              alt=""
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />
          )}
          <video
            ref={videoRef}
            className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            muted
            loop
            playsInline
            // "none", não "metadata": com metadata o navegador abria as 6
            // requisições e montava os 6 decoders assim que a página
            // carregava. A capa acima cobre o card até o clique.
            preload="none"
            // Só depois do primeiro play. Antes disso a barra nativa aparecia
            // por cima do botão redondo custom, com dois controles empilhados.
            controls={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label={`${video.title}: ${video.tag}`}
          >
            <source src={video.src} type="video/mp4" />
          </video>
          {!playing && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label={`Reproduzir vídeo: ${video.title}`}
              className="absolute inset-0 flex items-center justify-center bg-ink/15 transition-colors group-hover:bg-ink/25"
            >
              <span className="grid size-12 place-items-center rounded-full bg-white/95 text-ink shadow-lg transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
          <span className="pointer-events-none absolute left-4 top-4 border border-white/30 bg-ink/70 px-3 py-1.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            0{index + 1}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4 border-t border-white/15 py-4">
          <div>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">{video.tag}</p>
            <h3 className="mt-1.5 font-display text-[20px] font-bold leading-[1.15]">{video.title}</h3>
          </div>
          <Image aria-hidden src="/eixo-symbol.png" alt="" width={16} height={16} className="mt-1 shrink-0" />
        </div>
      </article>
    </RevealItem>
  )
}

export default function VideoGrid({ className = 'mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5' }: { className?: string }) {
  return (
    // Antes tinha mx-auto max-w-[720px], então o grid começava ~200px à direita
    // do título da seção e sobrava uma faixa vazia. Agora usa a largura útil,
    // na mesma grid das outras seções.
    <RevealGroup className={className}>
      {portfolioVideos.map((video, index) => (
        <PortfolioVideoCard key={video.src} video={video} index={index} />
      ))}
    </RevealGroup>
  )
}
