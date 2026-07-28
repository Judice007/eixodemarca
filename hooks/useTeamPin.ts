'use client'

import type { RefObject } from 'react'
import { useGSAP, gsap } from '@/lib/registerGsap'

// Faixa de times PINADA + bloom dirigido por scroll (iPad + desktop, >=768).
// A seção trava no topo; uma timeline scrubada traduz a faixa na horizontal E faz
// cada card "florescer" (cresce + revela os membros) em sequência, fechando o anterior.
// O crescer faz parte da timeline (não do hover), então não há reflow brigando com o pin.
const C = 300 // largura colapsada (px)
const E = 560 // largura aberta (px)
const G = 16 // gap-4

export function useTeamPin({
  rootRef,
  trackRef,
}: {
  rootRef: RefObject<HTMLElement | null>
  trackRef: RefObject<HTMLDivElement | null>
}) {
  useGSAP(
    () => {
      const track = trackRef.current
      const root = rootRef.current
      if (!track || !root || typeof window === 'undefined') return

      const mm = gsap.matchMedia()
      // só >=768 e sem reduced-motion; abaixo é o carrossel mobile (Task 9)
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll('.team-card'))
        if (cards.length === 0) return
        const reveals = cards.map((c) => c.querySelector('.team-reveal'))
        const vnames = cards.map((c) => c.querySelector('.team-vname'))
        const step = C + G

        // x da faixa que CENTRALIZA o card i aberto, com clamp pras bordas alinharem ao
        // viewport (card 0 ancora à esquerda, último ancora à direita → sem espaço vazio).
        const V = window.innerWidth
        const gutter = V <= 820 ? 20 : 40
        const edge = Math.max(gutter, (V - 1280) / 2 + gutter)
        const rowW = (cards.length - 1) * C + E + (cards.length - 1) * G
        const xMin = Math.min(0, -(edge + rowW + edge - V))
        const targetX = (i: number) => gsap.utils.clamp(xMin, 0, V / 2 - edge - i * step - E / 2)

        // estado inicial: card 0 aberto, resto colapsado
        gsap.set(cards, { width: C })
        gsap.set(cards[0], { width: E })
        reveals.forEach((r, i) => gsap.set(r, { autoAlpha: i === 0 ? 1 : 0 }))
        vnames.forEach((v, i) => gsap.set(v, { autoAlpha: i === 0 ? 0 : 1 }))
        gsap.set(track, { x: targetX(0), skewX: 0 })

        // skew sutil pela velocidade do scroll (peso premium)
        const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 1 },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => '+=' + (cards.length - 1) * Math.round(window.innerHeight * 0.55),
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            // Vem depois da seção de Serviços, que também é pinada. Atualizar
            // este cálculo por último evita que o Método fixe antes de chegar
            // ao topo e deixe uma tela vazia entre as duas seções.
            refreshPriority: -20,
            invalidateOnRefresh: true,
            // BATCH: assenta exatamente no estado "card aberto" de cada time. Um movimento
            // de scroll abre o próximo card inteiro (snap pros pontos i/(n-1)).
            snap: {
              snapTo: 1 / (cards.length - 1),
              duration: { min: 0.25, max: 0.5 },
              ease: 'power2.inOut',
              delay: 0.02,
              directional: true,
            },
            onUpdate: (self) => {
              skewTo(gsap.utils.clamp(-6, 6, self.getVelocity() / -260))
            },
          },
        })

        for (let i = 0; i < cards.length - 1; i++) {
          tl.to(track, { x: targetX(i + 1) }, i)
          tl.to(cards[i], { width: C }, i)
          tl.to(cards[i + 1], { width: E }, i)
          tl.to(reveals[i], { autoAlpha: 0, duration: 0.35 }, i)
          tl.to(vnames[i], { autoAlpha: 1, duration: 0.35 }, i + 0.5)
          tl.to(vnames[i + 1], { autoAlpha: 0, duration: 0.3 }, i)
          tl.to(reveals[i + 1], { autoAlpha: 1, duration: 0.5 }, i + 0.5)
        }

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )
}
