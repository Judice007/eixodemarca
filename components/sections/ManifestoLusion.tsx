'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP } from '@/lib/registerGsap'
import { isMobileViewport, prefersReducedMotion } from '@/lib/capability'
import { corridorState } from '@/lib/corridorState'
import { MOBILE_MQ } from '@/lib/mobileMotion'
import ManifestoCorridorGL from '@/components/visual/ManifestoCorridorGL'

// MANIFESTO = "O Corredor" (ao contrário da zarpei): arrita no bone, MERGULHA no escuro, e a
// copy chega REPARTIDA em beats — cada pedaço revela palavra a palavra e SAI conforme você
// atravessa o tubo de partículas. Premium: stagger por palavra, vinheta, finale da marca.

const BEATS = [
  { text: 'Somos estratégia criativa com:', c: '#2a104a', a: 0.04, b: 0.18 }, // entra na LUZ (bone)
]

export default function ManifestoLusion() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (isMobileViewport() || prefersReducedMotion()) return
      corridorState.progress = 0
      gsap.set('.manifesto-finale-path', { drawSVG: '0%' })
      gsap.set('[data-beat] .w, [data-finale]', { autoAlpha: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#manifesto',
          start: 'top top',
          end: () => '+=' + window.innerHeight * 2.2, // era 3.4 — pin encurtado ~35%
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            corridorState.progress = self.progress
          },
        },
      })

      // base da seção é DARK (sem vazar bone na emenda); a ENTRADA clara é uma camada bone
      // que some no mergulho. Assim na entrada é bone, no fundo é dark, sem linha na junção.
      tl.to('.manifesto-bone', { autoAlpha: 0, ease: 'power2.in', duration: 0.25 }, 0.2)
      // a vinheta (escurece bordas) só entra junto com o mergulho — entrada bone fica limpa
      tl.to('.manifesto-vignette', { opacity: 1, ease: 'power2.in', duration: 0.25 }, 0.22)
      tl.fromTo('.manifesto-eyebrow', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.02)
      tl.to('.manifesto-eyebrow', { autoAlpha: 0, duration: 0.07 }, 0.68)

      // beats: revelam PALAVRA A PALAVRA (stagger + scale + easing expo) e saem
      BEATS.forEach((bt, i) => {
        const sel = `[data-beat="${i}"] .w`
        const d = bt.b - bt.a
        tl.fromTo(
          sel,
          { autoAlpha: 0, yPercent: 100, scale: 0.92 },
          { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'power4.out', duration: d * 0.5, stagger: 0.05 },
          bt.a
        )
        tl.to(sel, { autoAlpha: 0, yPercent: -55, ease: 'power2.in', duration: d * 0.32, stagger: 0.03 }, bt.b - d * 0.32)
      })

      // FINALE da marca: assentar suave (sem "pop" de escala) + letter-spacing fechando
      // (começa em 0.68 — antes só tinha de 0.8 a 1.0 pra "pousar", pouco espaço pro hub respirar)
      tl.fromTo(
        '[data-finale]',
        { autoAlpha: 0, y: 16, scale: 0.96, letterSpacing: '0.22em' },
        { autoAlpha: 1, y: 0, scale: 1, letterSpacing: '-0.02em', ease: 'power2.out', duration: 0.22 },
        0.68
      )
      tl.fromTo('.manifesto-finale-path', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: 0.3 }, 0.7)

      // ── EMERGIR = REVELAR a Work atrás. No fim, o túnel INTEIRO (fundo dark + corredor +
      // vinheta + wordmark) faz fade-out, descobrindo a seção Trabalhos pinada logo ATRÁS
      // (z menor, espiral já populada). O túnel "fica claro" mostrando a espiral que já
      // estava lá — sem subir pro topo pra só então começar.
      tl.to(root.current, { opacity: 0, ease: 'power2.inOut', duration: 0.12 }, 0.85)
    },
    { scope: root }
  )

  // MOBILE: a travessia — pin de ~2 telas, scroll nativo como gesto. Mergulho
  // bone→dark, beats palavra a palavra, túnel CSS por parallax de scale, finale
  // com drawSVG. Sem WebGL, sem haptic (leitura, não encaixe). Reduced-motion:
  // sem pin — statement estático legível (o gsap nem roda).
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOBILE_MQ, () => {
        if (prefersReducedMotion()) return
        // estados iniciais (só agora escondemos — sem JS tudo fica visível)
        gsap.set('.manifesto-p2', { color: '#fff8f2' }) // chega já no escuro → bone
        gsap.set('.manifesto-p2 .w', { autoAlpha: 0 })
        gsap.set('.manifesto-finale-path-m', { drawSVG: '0%' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#manifesto',
            start: 'top top',
            end: () => '+=' + window.innerHeight * 1.3, // era 2 — pin encurtado ~35%
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // beat 1 (na luz): revela palavra a palavra assim que pina
        tl.from('.manifesto-p1 .w', { autoAlpha: 0, yPercent: 100, scale: 0.92, ease: 'power4.out', duration: 0.1, stagger: 0.02 }, 0.02)
        // MERGULHO: escuro + vinheta entram, beat 1 sai pra cima
        tl.to('.manifesto-dark-m', { autoAlpha: 1, ease: 'power2.in', duration: 0.18 }, 0.2)
        tl.to('.manifesto-vignette-m', { opacity: 1, ease: 'power2.in', duration: 0.18 }, 0.22)
        tl.to('.manifesto-p1 .w', { autoAlpha: 0, yPercent: -55, ease: 'power2.in', duration: 0.1, stagger: 0.015 }, 0.24)
        // túnel: anéis crescem em velocidades diferentes = profundidade
        tl.fromTo('.manifesto-tunnel-1', { scale: 0.6, autoAlpha: 0 }, { scale: 1.15, autoAlpha: 0.55, ease: 'none', duration: 0.48 }, 0.24)
        tl.fromTo('.manifesto-tunnel-2', { scale: 0.4, autoAlpha: 0 }, { scale: 1.45, autoAlpha: 0.4, ease: 'none', duration: 0.44 }, 0.28)
        // beat 2 (no escuro): serviços, palavra a palavra — e sai
        tl.to('.manifesto-p2 .w', { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'power4.out', duration: 0.14, stagger: 0.02, startAt: { yPercent: 100, scale: 0.92 } }, 0.42)
        tl.to('.manifesto-p2 .w', { autoAlpha: 0, yPercent: -55, ease: 'power2.in', duration: 0.1, stagger: 0.012 }, 0.66)
        // FINALE: wordmark assenta + path ciano desenha; anéis se aquietam
        tl.to('.manifesto-tunnel-1, .manifesto-tunnel-2', { autoAlpha: 0.16, duration: 0.14 }, 0.74)
        tl.fromTo('[data-finale-m]', { autoAlpha: 0, y: 14, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.16 }, 0.76)
        tl.fromTo('.manifesto-finale-path-m', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: 0.2 }, 0.78)
      })
    },
    { scope: root }
  )

  return (
    <section
      id="manifesto"
      ref={root}
      className="relative z-30 overflow-hidden bg-bone px-[var(--gutter)] lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:bg-dark max-lg:flex max-lg:min-h-[100svh] max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:py-[clamp(44px,8vw,56px)] max-lg:text-center"
    >
      {/* DESKTOP: corredor WebGL + vinheta de profundidade + serpente */}
      <div className="hidden lg:block" aria-hidden>
        {/* camada bone: cobre a base dark na ENTRADA (some no mergulho) */}
        <div className="manifesto-bone pointer-events-none absolute inset-0 z-0 bg-bone" />
        <ManifestoCorridorGL />
        {/* vinheta premium — só entra COM o mergulho (na entrada bone fica invisível) */}
        <div
          className="manifesto-vignette pointer-events-none absolute inset-0 z-[6] opacity-0"
          style={{ background: 'radial-gradient(72% 62% at 50% 48%, transparent 46%, rgba(8,8,12,0.6))' }}
        />
        <svg className="pointer-events-none absolute inset-0 z-[7] h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path
            className="manifesto-finale-path"
            d="M-60 600 C 320 470 520 720 760 560 C 1000 400 1180 600 1520 450"
            fill="none"
            stroke="#e8deff"
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 9px rgba(232,222,255,0.55))' }}
          />
        </svg>
      </div>

      {/* MOBILE: mergulho + túnel CSS (sem WebGL) — tudo transform/opacity */}
      <div className="pointer-events-none absolute inset-0 lg:hidden" aria-hidden>
        {/* base escura que ENTRA no mergulho (bone é o fundo da própria seção) */}
        <div className="manifesto-dark-m absolute inset-0 bg-dark opacity-0" />
        {/* anéis do túnel — profundidade por parallax de scale em velocidades diferentes */}
        <div
          className="manifesto-tunnel-1 absolute inset-0 opacity-0"
          style={{
            background:
              'repeating-radial-gradient(circle at 50% 46%, transparent 0 34px, rgba(255,102,92,0.08) 34px 36px, transparent 36px 88px)',
          }}
        />
        <div
          className="manifesto-tunnel-2 absolute inset-0 opacity-0"
          style={{
            background:
              'radial-gradient(140% 100% at 50% 46%, transparent 30%, rgba(232,222,255,0.07) 52%, transparent 74%)',
          }}
        />
        {/* vinheta — escurece as bordas junto com o mergulho */}
        <div
          className="manifesto-vignette-m absolute inset-0 opacity-0"
          style={{ background: 'radial-gradient(80% 64% at 50% 48%, transparent 42%, rgba(8,8,12,0.65))' }}
        />
        {/* finale: path ciano compacto (drawSVG na Task 9) */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 844" preserveAspectRatio="none">
          <path
            className="manifesto-finale-path-m"
            d="M-20 470 C 90 420 150 520 210 460 C 270 400 330 480 410 430"
            fill="none"
            stroke="#e8deff"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(232,222,255,0.55))' }}
          />
        </svg>
      </div>

      {/* DESKTOP: beats + finale (decorativo; frase completa no sr-only abaixo) */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden place-items-center lg:grid" aria-hidden>
        <span className="manifesto-eyebrow section-eyebrow absolute left-1/2 top-[33%] -translate-x-1/2 opacity-0">Manifesto</span>
        {BEATS.map((bt, i) => (
          <p key={bt.text} data-beat={i} className="section-title max-w-[22ch] px-[var(--gutter)] text-center [grid-area:1/1]" style={{ color: bt.c }}>
            {bt.text.split(' ').map((w, wi) => (
              <span key={wi} className="w mr-[0.26em] inline-block">
                {w}
              </span>
            ))}
          </p>
        ))}
        <span
          data-finale
          className="[grid-area:1/1]"
        style={{ filter: 'drop-shadow(0 0 22px rgba(255,102,92,0.38))' }}
        >
          <Image
            src="/eixo-wordmark.png"
            alt="Eixo de Marca"
            width={1515}
            height={573}
            className="h-auto w-[clamp(190px,26vw,420px)]"
          />
        </span>
      </div>

      {/* frase completa: visível no MOBILE (beats da travessia), sr-only no desktop */}
      <div className="manifesto-statement relative z-10 mx-auto max-w-[300px] text-center lg:sr-only">
        <p className="manifesto-p1 section-title text-ink">
          {'Somos estratégia criativa com:'.split(' ').map((w, wi) => (
            <span key={wi} className="w mr-[0.26em] inline-block">
              {w}
            </span>
          ))}
        </p>
        <p className="manifesto-p2 mt-3 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink/80">
          <span className="w mr-[0.3em] inline-block text-azure">Marketing,</span>
          <span className="w mr-[0.3em] inline-block">Branding,</span>
          <span className="w mr-[0.3em] inline-block">Performance,</span>
          <span className="w mr-[0.3em] inline-block">Audiovisual,</span>
          <span className="w mr-[0.3em] inline-block">Social</span>
          <span className="w mr-[0.3em] inline-block">Media</span>
          <span className="w mr-[0.3em] inline-block">e</span>
          <span className="w inline-block">Tecnologia.</span>
        </p>
      </div>

      {/* MOBILE: finale da marca — invisível por padrão (decorativo; revela via JS) */}
      <span
        data-finale-m
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 grid place-items-center opacity-0 lg:hidden"
        style={{ filter: 'drop-shadow(0 0 18px rgba(255,102,92,0.38))' }}
      >
        <Image
          src="/eixo-wordmark.png"
          alt=""
          width={1515}
          height={573}
          className="h-auto w-[min(62vw,260px)]"
        />
      </span>
    </section>
  )
}
