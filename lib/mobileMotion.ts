// Vocabulário compartilhado do movimento mobile (Fase 1; Fases 2/3 herdam).
// Tudo transform/opacity — nada de propriedades de layout.
import { gsap } from '@/lib/registerGsap'

// Espelha isMobileViewport() de lib/capability.ts — única MQ mobile do projeto.
export const MOBILE_MQ = '(max-width: 1023px), (pointer: coarse)'
export const MOBILE_EASE = 'power3.out'
export const MOBILE_STAGGER = 0.08

// Entrada em arco: y com power3.out e x/rotation com power2.inOut geram uma
// trajetória CURVA (eases diferentes por eixo), alternando o lado por índice.
// A rotação zera ao pousar. Dispara uma vez quando o card se aproxima do viewport.
export function arcIn(
  el: Element,
  index: number,
  opts?: { onComplete?: () => void }
): gsap.core.Timeline {
  const side = index % 2 === 0 ? -1 : 1
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    delay: (index % 2) * MOBILE_STAGGER,
    onComplete: opts?.onComplete,
  })
  tl.from(el, { y: 90, autoAlpha: 0, duration: 0.55, ease: MOBILE_EASE }, 0)
  tl.from(el, { x: side * 56, rotation: side * 6, duration: 0.6, ease: 'power2.inOut' }, 0)
  return tl
}
