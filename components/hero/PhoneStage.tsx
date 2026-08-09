'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { Work } from '@/lib/works'
import { ASSET_ASPECT, SCREEN, SCREEN_RADIUS_PCT, TRANSITION } from './constants'

/**
 * O aparelho: as mãos + o celular são um asset único com a tela vazada, então o
 * conteúdo entra ATRÁS da imagem e aparece pelo buraco. O notch é opaco no
 * próprio asset, então ele cobre o conteúdo sozinho — é de propósito.
 */

const DEVICE_SRC = '/assets/device/hands-phone.webp'

function ScreenMedia({ work, active, reduce }: { work: Work; active: boolean; reduce: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Só o vídeo do serviço ativo existe no DOM (o AnimatePresence monta um de
  // cada vez), e mesmo esse só toca quando a seção está visível.
  useEffect(() => {
    const el = videoRef.current
    if (!el || reduce) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && active) void el.play().catch(() => undefined)
        else el.pause()
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [active, reduce])

  if (work.screen.type === 'video') {
    return (
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster={work.screen.poster}
        aria-hidden
      >
        <source src={work.screen.src} type="video/mp4" />
      </video>
    )
  }

  return (
    <Image
      src={work.screen.src}
      alt=""
      fill
      sizes="(min-width: 1280px) 190px, (min-width: 768px) 150px, 110px"
      className="object-cover"
    />
  )
}

export default function PhoneStage({ work, reduce }: { work: Work; reduce: boolean }) {
  return (
    <div
      className="relative"
      style={{ width: 'min(38vw, 520px)', minWidth: 190, aspectRatio: String(ASSET_ASPECT) }}
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
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={work.id}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
            transition={{ duration: reduce ? 0 : TRANSITION.screen, ease: [0.25, 1, 0.5, 1] }}
          >
            <ScreenMedia work={work} active reduce={reduce} />
          </motion.div>
        </AnimatePresence>

        {/* reflexo do vidro */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(115deg, rgba(255,255,255,.16), transparent 38%)',
          }}
        />
      </div>

      {/* mãos + aparelho. filter integra a pele ao roxo do palco. */}
      <Image
        src={DEVICE_SRC}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 1280px) 520px, (min-width: 768px) 40vw, 55vw"
        className="pointer-events-none select-none object-contain"
        style={{ zIndex: 2, filter: 'saturate(.92) contrast(1.03)' }}
      />
    </div>
  )
}
