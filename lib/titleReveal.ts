'use client'

import { gsap, SplitText } from '@/lib/registerGsap'

// Reveal padrão dos títulos de seção: cada LETRA sobe (mascarada por linha) quando o
// título entra na viewport. Token de animação único, chamado por todas as seções dentro
// do seu próprio useGSAP (já guardado por prefers-reduced-motion). `target` deve ser uma
// classe ÚNICA da seção (ex.: '.work-title') pra não casar com títulos de outras seções.
export function revealSectionTitle(target: string | Element, trigger: string | Element) {
  return SplitText.create(target, {
    type: 'lines,chars',
    mask: 'lines',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.chars, {
        yPercent: 100,
        duration: 0.7,
        stagger: 0.012,
        ease: 'power3.out',
        scrollTrigger: { trigger, start: 'top 80%' },
      })
    },
  })
}
