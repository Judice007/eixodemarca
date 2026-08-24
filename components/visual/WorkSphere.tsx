'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useVisible } from '@/components/hooks/useVisible'

export type SphereImage = { src: string; alt: string }

/**
 * Esfera de trabalhos girando ao fundo: cada peça vira uma bolha circular
 * distribuída na superfície de uma esfera, que gira devagar no próprio eixo.
 *
 * As bolhas da frente ficam maiores e nítidas, as de trás menores e apagadas —
 * é isso que dá a sensação de profundidade sem nenhum 3D de verdade. Só
 * transform e opacity são animados (ambos na GPU), então a rolagem não trava
 * mesmo com ~24 bolhas atualizando a 60fps.
 *
 * O posicionamento é escrito direto no DOM dentro do rAF, e não via estado do
 * React: 24 elementos × 60 vezes por segundo seria um re-render por frame para
 * números que o React nunca precisa ver.
 */

/** Distribuição de Fibonacci: pontos espalhados por igual numa esfera, sem aglomerar nos polos. */
function fibonacciSphere(count: number) {
  const points: { x: number; y: number; z: number }[] = []
  const golden = Math.PI * (1 + Math.sqrt(5))

  for (let i = 0; i < count; i += 1) {
    const offset = i + 0.5
    const phi = Math.acos(1 - (2 * offset) / count)
    const theta = golden * offset
    points.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
    })
  }

  return points
}

/** Variação de tamanho por índice — determinística, pra não "pular" entre server e client. */
function sizeJitter(index: number) {
  return 0.78 + ((Math.sin(index * 12.9898) * 43758.5453) % 1 + 1) / 2 * 0.44
}

export default function WorkSphere({
  images,
  className = '',
}: {
  images: SphereImage[]
  className?: string
}) {
  const [rootRef, visible] = useVisible<HTMLDivElement>()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const radiusRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  /** tempo acumulado de giro, pra esfera retomar de onde parou */
  const elapsed = useRef(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const points = fibonacciSphere(images.length)
    // Inclinação fixa: sem ela a esfera gira "de lado" e as bolhas descrevem
    // uma faixa reta em vez de um volume.
    const tilt = -0.32
    const cosT = Math.cos(tilt)
    const sinT = Math.sin(tilt)

    const measure = () => {
      const box = root.getBoundingClientRect()
      // Cada eixo tem o seu próprio limite. O raio é contido de propósito: com
      // poucas peças, um raio grande espalha as bolhas e a esfera some — vira
      // um punhado de círculos soltos em vez de um volume.
      //
      // Em tela estreita a fração da largura sobe: com 0.25 o raio caía pra
      // ~94px e as bolhas (46px cada) viravam um amontoado ilegível.
      const widthFactor = box.width < 768 ? 0.42 : 0.25
      radiusRef.current = Math.min(box.width * widthFactor, box.height * 0.55)
    }

    const draw = (angle: number) => {
      const radius = radiusRef.current
      if (!radius) return
      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)

      points.forEach((point, index) => {
        const node = itemRefs.current[index]
        if (!node) return

        // gira em torno de Y...
        const x = point.x * cosA + point.z * sinA
        const zRotated = point.z * cosA - point.x * sinA
        // ...e depois inclina em torno de X, pra esfera não ficar "deitada"
        const y = point.y * cosT - zRotated * sinT
        const depth = point.y * sinT + zRotated * cosT

        // depth vai de -1 (fundo) a 1 (frente)
        const near = (depth + 1) / 2
        const scale = (0.42 + near * 0.58) * sizeJitter(index)

        node.style.transform = `translate3d(${x * radius}px, ${y * radius}px, 0) scale(${scale})`
        node.style.opacity = String(0.18 + near * 0.82)
        node.style.zIndex = String(Math.round(near * 100))
      })
    }

    measure()

    if (reduce) {
      // Sem movimento: uma pose fixa, ainda com profundidade.
      draw(0.6)
      const observer = new ResizeObserver(() => {
        measure()
        draw(0.6)
      })
      observer.observe(root)
      return () => observer.disconnect()
    }

    const observer = new ResizeObserver(measure)
    observer.observe(root)

    // Fora da tela (ou aba em segundo plano) não roda nada: antes o rAF
    // desenhava as 18 bolhas pra sempre, mesmo com a seção longe.
    if (!visible) {
      // deixa uma pose desenhada, senão a seção reaparece vazia ao voltar
      draw(elapsed.current * 0.114)
      return () => observer.disconnect()
    }

    let last: number | null = null
    const step = (now: number) => {
      if (last === null) last = now
      // acumula o tempo em vez de medir desde o início: sem isso a esfera
      // saltava pra frente ao voltar pra tela, como se tivesse girado sozinha
      elapsed.current += (now - last) / 1000
      last = now
      // volta completa em ~55s — devagar o bastante pra não competir com o texto
      draw(elapsed.current * 0.114)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)

    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [images.length, reduce, visible])

  return (
    <div
      ref={rootRef}
      aria-hidden
      // `isolate` é obrigatório: sem contexto de empilhamento próprio, o
      // z-index que cada bolha recebe no rAF (até 100) escapa pro nível da
      // seção e as bolhas passam por cima do texto e do scrim.
      className={`pointer-events-none absolute inset-0 isolate z-0 overflow-hidden ${className}`}
    >
      {/* Centro da esfera. Fica deslocado pra direita no desktop (--sphere-x)
          pra que o miolo — onde ficam as bolhas maiores e mais nítidas — não
          caia embaixo do texto, que é alinhado à esquerda. */}
      <div className="absolute left-[var(--sphere-x,50%)] top-[var(--sphere-y,50%)] h-0 w-0">
        {images.map((image, index) => (
          <div
            key={image.src}
            ref={(node) => {
              itemRefs.current[index] = node
            }}
            // Sem translate do Tailwind: o rAF sobrescreve `transform` inteiro,
            // então a centralização vem pelas margens negativas abaixo.
            className="absolute will-change-transform"
            style={{
              width: 'clamp(46px, 6.4vw, 104px)',
              height: 'clamp(46px, 6.4vw, 104px)',
              marginLeft: 'calc(clamp(46px, 6.4vw, 104px) / -2)',
              marginTop: 'calc(clamp(46px, 6.4vw, 104px) / -2)',
              opacity: 0,
            }}
          >
            <Image
              src={image.src}
              alt=""
              width={140}
              height={140}
              sizes="104px"
              className="h-full w-full rounded-full object-cover ring-1 ring-white/15"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
