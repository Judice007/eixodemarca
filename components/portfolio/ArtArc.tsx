'use client'

import { useReducedMotion } from 'framer-motion'
import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery-2'
import { projects } from '@/lib/portfolio'
import ArtGrid from './ArtGrid'

// As mesmas 10 peças reais da grade, agora distribuídas ao longo de um arco.
const ITEMS: GalleryItem[] = projects.map((project) => ({
  image: project.src,
  text: project.client,
}))

/**
 * Vitrine das artes em arco: as peças ficam numa curva e você arrasta (ou usa
 * a roda) pra percorrer o acervo.
 *
 * É WebGL e não tem versão estática, então em `prefers-reduced-motion` a grade
 * original entra no lugar — sem isso, quem pede menos movimento ficaria sem
 * nenhuma forma de ver as artes.
 */
export default function ArtArc() {
  const reduce = useReducedMotion()

  if (reduce) return <ArtGrid />

  return (
    <div
      className="relative mt-12 h-[clamp(340px,46vw,620px)] w-full cursor-grab active:cursor-grabbing"
      role="group"
      aria-label="Artes e campanhas do Eixo de Marca — arraste para percorrer"
    >
      <CircularGallery
        items={ITEMS}
        bend={2.4}
        borderRadius={0.05}
        scrollSpeed={1.4}
        scrollEase={0.045}
        fontClassName="text-white font-sans text-[14px] font-bold"
      />

      {/* O arco é um canvas: nada dentro dele chega a um leitor de tela, então
          a relação das peças vive aqui fora. */}
      <ul className="sr-only">
        {projects.map((project, index) => (
          <li key={`${project.client}-${index}`}>
            {project.client} — {project.tags}
          </li>
        ))}
      </ul>
    </div>
  )
}
