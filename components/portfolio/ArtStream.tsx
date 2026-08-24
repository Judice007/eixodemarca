'use client'

import { ImageStreamHero, type StreamImage } from '@/components/ui/image-stream-hero'
import { projects } from '@/lib/portfolio'

// As mesmas peças reais da grade logo abaixo: o corredor traz as artes voando
// e, mais adiante na seção, elas se assentam na grade.
const IMAGES: StreamImage[] = projects.map((project) => ({
  src: project.src,
  alt: '',
}))

/**
 * Abertura da seção de artes: as peças vêm de longe pelos dois trilhos,
 * crescendo em direção a quem olha, e saem pelas bordas.
 *
 * É animação de CSS puro (keyframes + perspective), sem JS por frame — então
 * não concorre com o resto da página e para sozinha em
 * `prefers-reduced-motion` (o componente congela o corredor cheio em vez de
 * desmontá-lo).
 *
 * `aria-hidden` no corredor inteiro é do próprio componente: é decorativo, e a
 * relação nomeada das peças já existe na grade abaixo.
 */
export default function ArtStream() {
  return (
    <ImageStreamHero
      images={IMAGES}
      cards={9}
      speed={20}
      axis={52}
      className="h-[clamp(240px,34vw,440px)] w-full rounded-[20px] bg-ink"
      path={{ cardRadius: 0.5 }}
    >
      {/* Bordas dissolvidas: sem isso as cartas somem num corte reto na quina
          do bloco, e a leitura de "vindo de longe" quebra na saída. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(23,10,42,.95) 0%, transparent 18%, transparent 82%, rgba(23,10,42,.95) 100%)',
        }}
      />
    </ImageStreamHero>
  )
}
