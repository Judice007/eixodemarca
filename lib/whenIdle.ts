// Agenda `cb` pra rodar quando a thread principal estiver ociosa — tira trabalho
// pesado (ex.: parse do Three.js, 706KB) do caminho crítico de load, sem perder a
// feature. Retorna função de cancelamento. Fallback p/ setTimeout onde não há rIC.
export function whenIdle(cb: () => void, timeout = 800): () => void {
  if (typeof window === 'undefined') return () => {}
  if (typeof requestIdleCallback !== 'undefined') {
    const id = requestIdleCallback(cb, { timeout })
    return () => cancelIdleCallback(id)
  }
  const id = window.setTimeout(cb, 200)
  return () => window.clearTimeout(id)
}

// Como whenIdle, mas só DEPOIS do evento `load` (hero/LCP já pintados). Garante que
// o parse pesado não dispute com o first paint — o rIC sozinho pode disparar cedo
// demais, num gap de idle ANTES da primeira pintura.
export function whenIdleAfterLoad(cb: () => void, timeout = 1500): () => void {
  if (typeof window === 'undefined') return () => {}
  let cancelIdle = () => {}
  const schedule = () => {
    cancelIdle = whenIdle(cb, timeout)
  }
  if (document.readyState === 'complete') {
    schedule()
  } else {
    window.addEventListener('load', schedule, { once: true })
  }
  return () => {
    window.removeEventListener('load', schedule)
    cancelIdle()
  }
}
