'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { gsap, useGSAP, ScrollSmoother } from '@/lib/registerGsap'
import { prefersReducedMotion, isMobileViewport } from '@/lib/capability'
import { revealSectionTitle } from '@/lib/titleReveal'
import FooterGL from '@/components/visual/FooterGL'
import { contactInfo, whatsappUrl, mailtoUrl, services } from '@/lib/data'

// Dark closing footer — the bookend to the dark-glass nav: ink surface, azure as the
// single accent, a SplitText CTA, a magnetic primary button, link columns, an
// oversized ghost wordmark, and scroll-in reveals (same GSAP idiom as the other
// sections). Navigation routes through ScrollSmoother so it doesn't fight the
// smoothed scroll. Lives inside #smooth-content (scrolls normally).

const NAV = [
  { id: 'hero', label: 'Início' },
  { id: 'reel', label: 'Reel' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'work', label: 'Serviços' },
]
const AREAS = services.map((service) => service.title)
const ETAPAS = ['Diagnóstico', 'Planejamento', 'Produção', 'Gestão & Otimização']

function Col({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="foot-rise">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone/65">{title}</h3>
      <ul className="flex flex-col gap-2.5 text-sm font-medium text-bone/70 max-lg:items-center">{children}</ul>
    </div>
  )
}

export default function FooterLusion() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // título de seção: reveal letra-a-letra (token unificado)
      document.fonts.ready.then(() => root.current && revealSectionTitle('.foot-cta', root.current))

      // Nav, contato e as colunas (.foot-rise) usados a ficar escondidos até um
      // scroll-trigger disparar — se o trigger nunca cruzasse (posição
      // desatualizada por imagens carregando tarde, por ex.), esse conteúdo
      // essencial sumia de vez. Sem fade-in agora: aparece junto com o resto do
      // rodapé, sem depender de nenhuma animação rodar.

      // wordmark gigante sobe ao entrar
      gsap.from('.foot-word', {
        yPercent: 24,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.foot-word', start: 'top 95%' },
      })

      // botão magnético (atrai o ponteiro) — toque editorial estilo award. Só desktop:
      // no mobile não há ponteiro fino, então o CTA fica estático.
      const btn = root.current?.querySelector('.foot-magnetic') as HTMLElement | null
      if (!btn || isMobileViewport()) return
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' })
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' })
      const onMove = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }
      btn.addEventListener('pointermove', onMove)
      btn.addEventListener('pointerleave', onLeave)
      return () => {
        btn.removeEventListener('pointermove', onMove)
        btn.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: root }
  )

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const s = ScrollSmoother.get()
    if (s) s.scrollTo(el, true, 'top top')
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const toTop = () => {
    const s = ScrollSmoother.get()
    if (s) s.scrollTo(0, true)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <footer id="contato" ref={root} className="relative z-10 overflow-hidden bg-dark text-bone">
      {/* filete azure no topo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-azure/70 to-transparent" />
      {/* esfera de partículas que se monta no scroll (ScrollTrigger + three.js) */}
      <FooterGL />

      {/* pt floor era 52px — o header fixo (~90px) cobria o logo/título em
          qualquer viewport com menos de ~1000px de altura, bem comum em
          notebooks. Levantado pra sempre limpar o header. */}
      <div className="relative mx-auto max-w-[var(--maxw)] px-[var(--gutter)] pt-[clamp(112px,12vh,150px)] pb-8 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:text-center max-lg:pb-[128px]">
        {/* CTA */}
        <p className="foot-rise section-eyebrow max-lg:hidden">Próximo passo</p>
        <h2 className="foot-cta section-title mt-5 max-w-[15ch] text-bone max-lg:mx-auto">
          Vamos criar algo <span className="text-azure">memorável</span>.
        </h2>

        <div className="foot-rise mt-9 flex flex-wrap items-center gap-4 max-lg:flex-col max-lg:items-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="foot-magnetic group inline-flex items-center gap-2 rounded-full bg-azure px-6 py-3.5 text-sm font-semibold text-white transition-[background-color] duration-200 hover:bg-[#ff837b]"
          >
            Falar no WhatsApp
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={mailtoUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-bone/85 transition-colors hover:border-white/35 hover:text-bone"
          >
            {contactInfo.email}
          </a>
        </div>

        {/* colunas */}
        <div className="mt-[clamp(40px,6vh,68px)] grid grid-cols-1 gap-x-8 gap-y-10 border-t border-white/10 pt-10 max-lg:place-items-center max-lg:gap-y-8 max-lg:text-center lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* marca */}
          <div className="foot-rise max-w-[280px] lg:col-span-1 max-lg:mx-auto">
            <div className="flex items-center gap-[11px] max-lg:justify-center">
              <Image src="/eixo-symbol.png" alt="" width={34} height={34} className="size-[34px] rounded-[10px]" />
              <Image src="/eixo-wordmark.png" alt="Eixo de Marca" width={1515} height={573} className="h-[18px] w-auto" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-bone/55">
              Social media, design, vídeo e gestão para marcas que querem aparecer e crescer.
            </p>
          </div>

          <Col title="Navegação">
            {NAV.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(s.id)}
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-bone"
                >
                  <span aria-hidden className="inline-block w-0 overflow-hidden text-azure transition-all duration-200 group-hover:w-3.5">→</span>
                  {s.label}
                </button>
              </li>
            ))}
          </Col>

          <Col title="Atuação">
            {AREAS.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </Col>

          <Col title="Processo">
            {ETAPAS.map((etapa) => (
              <li key={etapa}>{etapa}</li>
            ))}
          </Col>
        </div>
      </div>

      {/* wordmark gigante fantasma */}
      <div aria-hidden className="select-none overflow-hidden px-[var(--gutter)]">
        <div className="foot-word -mb-[0.04em]">
          <Image
            src="/eixo-wordmark.png"
            alt=""
            width={1515}
            height={573}
            className="mx-auto h-auto w-[70%] max-w-[820px] opacity-[0.07]"
          />
        </div>
      </div>

      {/* barra inferior */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--maxw)] flex-col items-center justify-between gap-3 px-[var(--gutter)] py-6 text-xs text-bone/65 sm:flex-row">
          <span>© 2026 Eixo de Marca — Brasil</span>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-bone"
          >
            Voltar ao topo
            <span aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
