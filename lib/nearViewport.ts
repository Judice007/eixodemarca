// Roda `cb` UMA vez quando `el` chega perto da viewport — init preguiçoso de WebGL,
// fora da janela de load (tira o custo de criar renderer + compilar shaders do
// caminho crítico). Sem IntersectionObserver (ambiente antigo), roda na hora.
export function onceNearViewport(el: Element, cb: () => void, rootMargin = '400px'): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    cb()
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        cb()
      }
    },
    { rootMargin }
  )
  io.observe(el)
  return () => io.disconnect()
}
