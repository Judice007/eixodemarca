'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '@/lib/portfolio'

/**
 * Grade das artes que desce ao lado da coluna de texto fixa — o texto fica
 * parado à esquerda enquanto os cards passam à direita (padrão da referência,
 * digithree).
 *
 * Cada card entra com um deslocamento vertical próprio conforme aparece, então
 * a coluna da esquerda e a da direita não sobem no mesmo compasso e a leitura
 * fica de "cards descendo" em vez de uma grade que só aparece de uma vez.
 */
export default function ArtShowcase() {
  const reduce = useReducedMotion()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      {projects.map((project, index) => (
        <motion.article
          key={`${project.client}-${index}`}
          className="group"
          initial={reduce ? false : { opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
      ))}
    </div>
  )
}
