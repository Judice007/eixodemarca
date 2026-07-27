// Capability gating for the rich WebGL experience (ported from zarpei landing-1).
// Resultado memoizado: cada chamada antes criava um contexto WebGL de teste; com
// vários componentes WebGL isso somava contextos extras no load. Disponibilidade
// não muda na sessão, então testamos uma vez só.
let _webgl: boolean | null = null
export function hasWebGL(): boolean {
  if (typeof document === 'undefined') return false
  if (_webgl !== null) return _webgl
  try {
    const c = document.createElement('canvas')
    _webgl = !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    _webgl = false
  }
  return _webgl
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

type DeviceNavigator = Navigator & { deviceMemory?: number }

// Mobile = viewport estreita ou ponteiro grosso. Interruptor único do "sem WebGL /
// sem choreography pesada no mobile". Espelha hooks/useIsMobile.
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches
}

// Desktop + WebGL + enough RAM + not reduced-motion → full experience.
export function prefersRichExperience(): boolean {
  if (typeof window === 'undefined') return false
  if (isMobileViewport()) return false
  if (prefersReducedMotion()) return false
  if (!hasWebGL()) return false
  const mem = (navigator as DeviceNavigator).deviceMemory
  if (mem != null && mem <= 2) return false
  return true
}
