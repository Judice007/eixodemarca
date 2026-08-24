'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * `true` enquanto o elemento está (perto de) visível E a aba está em primeiro
 * plano.
 *
 * Existe porque as animações pesadas da página — canvas, ticker do GSAP, WebGL,
 * 3D em CSS — rodavam o tempo todo, mesmo com a seção a três telas de
 * distância. Somadas, isso é trabalho contínuo de CPU e GPU disputando com o
 * resto da máquina (um vídeo tocando em outra janela, por exemplo).
 *
 * O `rootMargin` folgado liga a animação um pouco antes de ela entrar em cena,
 * pra nunca aparecer parada e "engatar" na frente do usuário.
 */
export function useVisible<T extends HTMLElement>(rootMargin = '250px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let onScreen = false
    const apply = () => setVisible(onScreen && !document.hidden)

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = !!entry?.isIntersecting
        apply()
      },
      { rootMargin }
    )
    observer.observe(el)
    document.addEventListener('visibilitychange', apply)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', apply)
    }
  }, [rootMargin])

  return [ref, visible] as const
}
