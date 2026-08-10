'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { Work } from '@/lib/works'
import { ASSET_ASPECT, SCREEN, SCREEN_RADIUS_PCT, TRANSITION } from './constants'

/**
 * O aparelho: as mãos + o celular são um asset único com a tela vazada, então o
 * conteúdo entra ATRÁS da imagem e aparece pelo buraco. O notch é opaco no
 * próprio asset, então ele cobre o conteúdo sozinho — é de propósito.
 *
 * IMPORTANTE — por que TODAS as telas ficam montadas o tempo todo:
 * a primeira versão trocava a tela dentro de um <AnimatePresence> com key por
 * serviço. Como o rotador volta a cada 2,6s, o <video> era desmontado e
 * remontado o tempo inteiro, e o navegador rebaixava o arquivo em cada volta —
 * 138 MB de vídeo numa única visita. Agora cada clipe é montado uma vez, com
 * key estável, e a troca é só opacity/visibility. Nada de mexer em src/key.
 */

const DEVICE_SRC = '/assets/device/hands-phone-final.webp'

/** Uma camada por serviço. Só a ativa fica visível; nenhuma é desmontada. */
function ScreenLayer({
  work,
  active,
  inView,
  reduce,
}: {
  work: Work
  active: boolean
  inView: boolean
  reduce: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (active && inView && !reduce) {
      void el.play().catch(() => undefined)
    } else {
      el.pause()
    }
  }, [active, inView, reduce])

  return (
    <div
      className="absolute inset-0"
      aria-hidden
      style={{
        opacity: active ? 1 : 0,
        // esconde de verdade depois do fade, pra camada inativa nem compor
        visibility: active ? 'visible' : 'hidden',
        transition: reduce
          ? 'none'
          : `opacity ${TRANSITION.screen}s cubic-bezier(.25,1,.5,1), visibility 0s linear ${
              active ? '0s' : `${TRANSITION.screen}s`
            }`,
      }}
    >
      {work.screen.type === 'video' ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          // nunca baixa sozinho: só quando esta camada vira a ativa e dá play()
          preload="none"
          poster={work.screen.poster}
          src={work.screen.src}
          aria-hidden
        />
      ) : (
        <Image
          src={work.screen.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 240px, (min-width: 768px) 195px, 155px"
          className="object-cover"
        />
      )}
    </div>
  )
}

export default function PhoneStage({
  works,
  activeIndex,
  reduce,
}: {
  works: Work[]
  activeIndex: number
  reduce: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  // um observer só pro palco inteiro, em vez de um por vídeo
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(!!entry?.isIntersecting),
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      // A altura é ~0.86x a largura (ASSET_ASPECT do novo mockup, quase
      // quadrado), então o teto em vh é o que impede o aparelho de empurrar
      // o rótulo e a barra pra fora da tela presa. O fator em vw sobe no
      // mobile: com 38vw o celular ficava menor que o próprio chip de CTA.
      className="relative w-[min(86vw,49vh)] sm:w-[min(60vw,53vh)] lg:w-[min(50vw,590px,59vh)]"
      style={{ minWidth: 150, aspectRatio: String(ASSET_ASPECT) }}
    >
      {/* conteúdo da tela — fica atrás do asset */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          top: `${SCREEN.top}%`,
          left: `${SCREEN.left}%`,
          width: `${SCREEN.width}%`,
          height: `${SCREEN.height}%`,
          borderRadius: `${SCREEN_RADIUS_PCT}%`,
          zIndex: 1,
        }}
      >
        {works.map((w, i) => (
          <ScreenLayer
            key={w.id}
            work={w}
            active={i === activeIndex}
            inView={inView}
            reduce={reduce}
          />
        ))}

        {/* reflexo do vidro */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(115deg, rgba(255,255,255,.16), transparent 38%)',
          }}
        />
      </div>

      {/* Mãos + aparelho. O asset termina numa linha reta embaixo (os antebraços
          são cortados pela borda do render), então o container recebe um fade
          pra que eles se dissolvam no palco em vez de parecerem amputados. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 2,
          maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
        }}
      >
        <Image
          src={DEVICE_SRC}
          alt=""
          fill
          sizes="(min-width: 1280px) 600px, (min-width: 768px) 44vw, 52vw"
          className="select-none object-contain"
          style={{ filter: 'saturate(.92) contrast(1.03)' }}
        />
      </div>
    </div>
  )
}
