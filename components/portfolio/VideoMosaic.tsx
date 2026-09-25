'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { portfolioVideos } from '@/lib/portfolio'
import { RevealGroup, RevealItem } from '@/components/reveal'

// Mosaico de verdade: as células têm alturas diferentes, mas TODAS ficam mais
// altas que largas — a proporção varia de ~0.59 a ~0.44, ou seja, sempre no
// formato reels dos vídeos, nunca deitada.
//
// No mobile o `aspect-[9/16]` manda; de `sm` pra cima o row-span assume (por
// isso o `sm:aspect-auto`), com auto-rows curtas fazendo o escalonamento.
// Alturas calculadas, não sorteadas: scripts/balancear-mosaico.mjs escolhe o
// row-span de cada vídeo pra que as colunas terminem na mesma altura. Com 19
// vídeos em 6 colunas, uma coluna sempre ganha um vídeo a mais — a saída é a
// coluna de 4 ter tiles mais baixos (17) e as de 3 mais altos (23). Resultado:
// 6 colunas terminam com ~40px de diferença; 3 colunas, exato. (Em 4 e 5
// colunas sobra ~260-320px: 19 não divide por 4 nem por 5.)
// Se a lista de vídeos mudar, rode o script de novo e cole o array aqui.
const SPANS = [
  'aspect-[9/16] sm:aspect-auto sm:row-span-21',
  'aspect-[9/16] sm:aspect-auto sm:row-span-23',
  'aspect-[9/16] sm:aspect-auto sm:row-span-22',
  'aspect-[9/16] sm:aspect-auto sm:row-span-23',
  'aspect-[9/16] sm:aspect-auto sm:row-span-17',
  'aspect-[9/16] sm:aspect-auto sm:row-span-23',
  'aspect-[9/16] sm:aspect-auto sm:row-span-17',
  'aspect-[9/16] sm:aspect-auto sm:row-span-23',
  'aspect-[9/16] sm:aspect-auto sm:row-span-22',
  'aspect-[9/16] sm:aspect-auto sm:row-span-20',
  'aspect-[9/16] sm:aspect-auto sm:row-span-21',
  'aspect-[9/16] sm:aspect-auto sm:row-span-23',
  'aspect-[9/16] sm:aspect-auto sm:row-span-17',
  'aspect-[9/16] sm:aspect-auto sm:row-span-23',
  'aspect-[9/16] sm:aspect-auto sm:row-span-22',
  'aspect-[9/16] sm:aspect-auto sm:row-span-23',
  'aspect-[9/16] sm:aspect-auto sm:row-span-22',
  'aspect-[9/16] sm:aspect-auto sm:row-span-20',
  'aspect-[9/16] sm:aspect-auto sm:row-span-17',
]

function MosaicTile({ video, index }: { video: (typeof portfolioVideos)[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  // Mesma regra do VideoGrid: nada de autoplay no scroll. Seis vídeos tocando
  // juntos disputavam banda e decodificação enquanto a pessoa só passava pela
  // seção. O observer aqui serve só pra pausar o que saiu da tela.
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
    <RevealItem className={SPANS[index % SPANS.length]}>
      <article className="group relative h-full overflow-hidden bg-white/5">
        {/* Capa como next/image em vez do atributo `poster` do <video>: o
            poster é buscado sempre, mesmo com o card muito abaixo da dobra, e
            sem passar pelo otimizador. Como next/image, ele é lazy (só carrega
            ao chegar perto) e sai em AVIF/WebP no tamanho certo.
            Some quando o vídeo começa, senão cobriria a imagem em movimento. */}
        {!playing && (
          <Image
            src={video.poster}
            alt=""
            fill
            sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        <video
          ref={videoRef}
          className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          muted
          loop
          playsInline
          // "none", não "metadata": com metadata o navegador abria as 6
          // requisições e montava os 6 decoders assim que a home carregava,
          // travando a abertura. A capa acima cobre o card até o clique.
          preload="none"
          // Só depois do primeiro play, senão a barra nativa aparece por cima
          // do botão redondo custom, com dois controles empilhados.
          controls={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label={`${video.title}: ${video.tag}`}
        >
          <source src={video.src} type="video/mp4" />
        </video>

        <span className="pointer-events-none absolute left-2 top-2 border border-white/30 bg-ink/70 px-2 py-0.5 font-sans text-[8px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Legenda sempre visível, não só no hover: no toque não existe hover,
            então antes o nome do projeto nunca aparecia no celular. Some
            enquanto toca pra não brigar com os controles nativos embaixo. */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-2.5 pt-9 transition-opacity duration-300 ${
            playing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-azure-on-dark">{video.tag}</p>
          <h3 className="mt-1 font-display text-[12px] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-white">
            {video.title}
          </h3>
        </div>

        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Reproduzir vídeo: ${video.title}`}
            className="absolute inset-0 flex items-center justify-center bg-ink/15 transition-colors group-hover:bg-ink/25"
          >
            <span className="grid size-9 place-items-center rounded-full bg-white/95 text-ink shadow-lg transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </article>
    </RevealItem>
  )
}

export default function VideoMosaic() {
  return (
    // grid-flow-row-dense: sem isso os spans diferentes deixam buracos no meio
    // do mosaico em vez de encaixarem uns nos outros.
    //
    // Sem max-w/mx-auto: o mosaico acompanha a largura do container da seção,
    // então a primeira coluna nasce na mesma margem do título. Centralizado e
    // mais estreito que o texto, ele lia como um bloco solto no meio.
    //
    // Densidade (pedido: mais vídeos, grade menor): 3 colunas em sm, 4 em md,
    // 5 em lg, 6 em xl, sempre com gap de 12px e auto-rows de 8px — altura da
    // célula = 20*span - 12. Com spans 18-22 a proporção fica entre ~0.44 e
    // ~0.61 em qualquer coluna de 175 a 215px, ainda formato reels.
    //
    // (Comentário antigo, pra 4 colunas grandes:) Em lg vira 4 colunas: na largura cheia, 3 colunas dariam células de
    // 440px e o formato sairia de reels pra quase 4:5. Com 4 colunas a célula
    // fica em ~325px e as auto-rows de 27px seguram a proporção entre 0.44 e
    // 0.60 — largura da coluna e auto-rows andam sempre juntas.
    <RevealGroup className="mt-10 grid grid-cols-2 gap-3 sm:auto-rows-[8px] sm:grid-cols-3 sm:grid-flow-row-dense md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {portfolioVideos.map((video, index) => (
        <MosaicTile key={video.src} video={video} index={index} />
      ))}
    </RevealGroup>
  )
}
