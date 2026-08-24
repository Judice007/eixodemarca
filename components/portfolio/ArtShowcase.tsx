'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '@/lib/portfolio'

type Project = (typeof projects)[number]

/**
 * Grade das artes que desce ao lado da coluna de texto fixa.
 *
 * A carta não aparece pronta no lugar: entra torta, deslocada pro lado e
 * menor, e se acomoda na posição da grade quando entra na tela — as da coluna
 * esquerda vêm da esquerda, as da direita vêm da direita, então as duas
 * convergem como cartas sendo assentadas.
 *
 * Usa o mesmo mecanismo do <Reveal> que o resto do site já usa (initial +
 * whileInView), pra não ter um caminho de animação próprio nesta única tela.
 */
function ArtCard({ project, index, reduce }: { project: Project; index: number; reduce: boolean }) {
  // coluna par vem da esquerda, ímpar da direita
  const side = index % 2 === 0 ? -1 : 1

  return (
    <motion.article
      className="group"
      initial={reduce ? false : { opacity: 0, x: side * 170, y: 120, rotate: side * 10, scale: 0.88 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduce ? 0 : 0.9,
        ease: [0.16, 1, 0.3, 1],
        // a carta da direita assenta um tico depois da esquerda, então o par
        // não cai no mesmo instante
        delay: reduce ? 0 : (index % 2) * 0.09,
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-white/5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
        <Image
          src={project.src}
          alt={project.alt}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 44vw, 92vw"
          className={`${project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
          style={{ objectPosition: project.position }}
        />
      </div>
      {/* Mesma legenda da referência: nome à esquerda, serviço à direita. */}
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[16px] font-bold uppercase leading-[1.15] tracking-[-0.02em] text-white">
          {project.client}
        </h3>
        <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55">
          {project.tags}
        </p>
      </div>
    </motion.article>
  )
}

export default function ArtShowcase() {
  const reduce = useReducedMotion()

  return (
    // overflow-x-clip: as cartas ainda não reveladas ficam paradas em x ±170,
    // fora do container, e isso criava 145px de rolagem horizontal na página.
    //
    // `clip` e não `hidden` de propósito: hidden forçaria o eixo Y a virar
    // scroll container, o que cortaria as sombras dos cards e quebraria o
    // sticky da coluna de texto. `overflow-x: clip` corta sem criar container.
    <div className="grid grid-cols-1 gap-4 overflow-x-clip sm:grid-cols-2 sm:gap-5">
      {projects.map((project, index) => (
        <ArtCard
          key={`${project.client}-${index}`}
          project={project}
          index={index}
          reduce={!!reduce}
        />
      ))}
    </div>
  )
}
