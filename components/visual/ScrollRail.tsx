'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap, ScrollTrigger, ScrollSmoother } from '@/lib/registerGsap'
import {
  SECTIONS,
  type Section,
  scrollProgress,
  thumbTop,
  markerTop,
  velocityStretch,
  dragTargetScroll,
  trackClickScroll,
  activeIndex,
} from '@/lib/scroll-rail'

// Branded scroll rail (desktop fine-pointer), ported from zarpei landing-1 — same
// behaviour, DigiThree azure instead of orange. Replaces the native scrollbar:
// azure thumb synced to GSAP ScrollSmoother's *smoothed* position, clickable
// section markers (mini-nav), hover label, and velocity "stretch". Math lives in
// lib/scroll-rail. Lives OUTSIDE #smooth-content (fixed), mounted in the layout.
export default function ScrollRail() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false) // só monta em pointer:fine (no cliente)
  const [active, setActive] = useState(0)
  const [present, setPresent] = useState<Section[]>([]) // seções no DOM, em ordem
  const [pos, setPos] = useState<number[]>([]) // px de cada marcador no trilho

  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null) // alvo de arraste (transparente)
  const barRef = useRef<HTMLSpanElement>(null) // barra visível (recebe scaleY)
  const sectionTops = useRef<number[]>([])
  const drag = useRef<{ grabOffset: number } | null>(null)

  // Gating: ponteiro fino (mouse/trackpad). Touch/coarse -> trilho não monta.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const apply = () => setEnabled(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Marca o <html> enquanto ativo -> o CSS esconde a scrollbar nativa só aí.
  useEffect(() => {
    if (!enabled) return
    document.documentElement.dataset.scrollRail = 'on'
    return () => {
      delete document.documentElement.dataset.scrollRail
    }
  }, [enabled])

  // Limite de scroll canônico do GSAP (funciona com ou sem smoother).
  const getLimit = () => ScrollTrigger.maxScroll(window)

  // Mede offsetTop das seções + posição dos marcadores (cacheado; recalcula em
  // refresh do ScrollTrigger / resize / load). Marcadores só mudam com o layout.
  useEffect(() => {
    if (!enabled) return
    const recompute = () => {
      const track = trackRef.current
      const thumb = thumbRef.current
      if (!track || !thumb) return
      const trackPx = track.clientHeight
      const thumbPx = thumb.offsetHeight
      const limit = getLimit()
      // Só as seções realmente presentes no DOM, ordenadas pela posição.
      const found = SECTIONS.map((s) => {
        const el = document.getElementById(s.id)
        return el ? { ...s, top: el.offsetTop } : null
      })
        .filter((x): x is Section & { top: number } => x !== null)
        .sort((a, b) => a.top - b.top)
      sectionTops.current = found.map((f) => f.top)
      setPresent(found.map(({ id, label }) => ({ id, label })))
      setPos(found.map((f) => markerTop(f.top, limit, trackPx, thumbPx)))
    }
    recompute()
    const raf = requestAnimationFrame(recompute) // após o 1º layout
    ScrollTrigger.addEventListener('refresh', recompute) // após o smoother medir
    window.addEventListener('resize', recompute)
    window.addEventListener('load', recompute)
    return () => {
      cancelAnimationFrame(raf)
      ScrollTrigger.removeEventListener('refresh', recompute)
      window.removeEventListener('resize', recompute)
      window.removeEventListener('load', recompute)
    }
  }, [enabled])

  // Núcleo: posiciona thumb (translateY) + estica barra (scaleY) + seção ativa.
  // Fonte: posição SUAVIZADA do ScrollSmoother (transform do #smooth-content), pra
  // o thumb andar junto com o conteúdo — igual ao thumb+Lenis do zarpei. Sem
  // smoother (reduced-motion): scroll nativo.
  useEffect(() => {
    if (!enabled) return
    let prev = 0
    const tick = () => {
      const track = trackRef.current
      const thumb = thumbRef.current
      const bar = barRef.current
      if (!track || !thumb || !bar) return
      const smoother = ScrollSmoother.get()
      let scroll = window.scrollY
      if (smoother) {
        const content = smoother.content() as HTMLElement
        const y = gsap.getProperty(content, 'y') as number
        if (Number.isFinite(y)) scroll = -y
      }
      const limit = getLimit()
      const velocity = scroll - prev
      prev = scroll

      const trackPx = track.clientHeight
      const thumbPx = thumb.offsetHeight
      const p = scrollProgress(scroll, limit)
      thumb.style.transform = `translate(-50%, ${thumbTop(p, trackPx, thumbPx)}px)`
      bar.style.transform = `scaleY(${reduce ? 1 : velocityStretch(velocity)})`
      const i = activeIndex(sectionTops.current, scroll, window.innerHeight / 2)
      if (i >= 0) setActive((prevI) => (prevI === i ? prevI : i))
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [enabled, reduce])

  // Navegação: roteia pelo ScrollSmoother (não briga com o scroll suavizado).
  const scrollToPx = (px: number, immediate = false) => {
    const smoother = ScrollSmoother.get()
    if (smoother) smoother.scrollTo(px, !immediate)
    else window.scrollTo({ top: px, behavior: immediate ? 'auto' : 'smooth' })
  }

  const goTo = (id: string) => {
    const smoother = ScrollSmoother.get()
    if (smoother) smoother.scrollTo(`#${id}`, !reduce, 'top top')
    else document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  // Arrastar o thumb.
  const onThumbDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const thumb = thumbRef.current
    if (!thumb) return
    drag.current = { grabOffset: e.clientY - thumb.getBoundingClientRect().top }
    thumb.setPointerCapture(e.pointerId)
  }
  const onThumbMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track || !thumb) return
    scrollToPx(
      dragTargetScroll({
        pointerY: e.clientY,
        trackTop: track.getBoundingClientRect().top,
        trackPx: track.clientHeight,
        thumbPx: thumb.offsetHeight,
        grabOffset: drag.current.grabOffset,
        limit: getLimit(),
      }),
      true
    )
  }
  const onThumbUp = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null
    thumbRef.current?.releasePointerCapture(e.pointerId)
  }

  // Clique no trilho nu (fora do thumb/marcadores) -> pula pra aquela altura.
  const onTrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return
    const track = trackRef.current
    if (!track) return
    scrollToPx(
      trackClickScroll({
        pointerY: e.clientY,
        trackTop: track.getBoundingClientRect().top,
        trackPx: track.clientHeight,
        limit: getLimit(),
      })
    )
  }

  if (!enabled) return null

  return (
    <div className="fixed right-3 top-[14vh] z-50 h-[72vh] md:right-4">
      <div
        ref={trackRef}
        onPointerDown={onTrackDown}
        className="relative h-full w-[5px] rounded-full"
        style={{ background: 'rgb(15 15 18 / 0.16)' }}
      >
        {/* marcadores das seções (mini-nav acessível) */}
        {present.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={`Ir para ${s.label}`}
            onClick={(e) => {
              e.preventDefault()
              goTo(s.id)
            }}
            style={{ top: pos[i] ?? 0 }}
            className="group absolute left-1/2 grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <span
              className={`block rounded-full transition-all ${
                i === active
                  ? 'h-1.5 w-1.5 scale-125 bg-azure shadow-[0_0_8px_2px_rgb(47_107_255/0.6)]'
                  : i < active
                    ? 'h-1.5 w-1.5 bg-azure/60'
                    : 'h-1 w-1 bg-[rgb(15_15_18/0.35)]'
              }`}
            />
            <span className="pointer-events-none absolute right-5 whitespace-nowrap rounded-full bg-[rgb(15_15_18/0.92)] px-2.5 py-1 font-display text-xs text-white opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur transition-all group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:translate-x-1 motion-safe:group-hover:translate-x-0 motion-safe:group-focus-visible:translate-x-0">
              {s.label}
            </span>
          </a>
        ))}

        {/* thumb: outer = alvo de arraste (transparente), inner = barra visível */}
        <div
          ref={thumbRef}
          onPointerDown={onThumbDown}
          onPointerMove={onThumbMove}
          onPointerUp={onThumbUp}
          aria-hidden
          className="absolute left-1/2 top-0 flex h-12 w-4 cursor-grab touch-none justify-center active:cursor-grabbing"
          style={{ transform: 'translate(-50%, 0px)' }}
        >
          <span
            ref={barRef}
            className="h-full w-[6px] rounded-full bg-azure"
            style={{
              transformOrigin: 'center',
              boxShadow: '0 0 12px 2px rgb(47 107 255 / 0.55), 0 0 0 1px rgb(255 255 255 / 0.6)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
