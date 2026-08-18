import Image from 'next/image'
import { projects } from '@/lib/portfolio'
import { TiltGrid } from '@/components/reveal'

export default function ArtGrid({ className = 'mt-12 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5' }: { className?: string }) {
  return (
    <TiltGrid className={className}>
      {projects.map((project, index) => (
        <div key={`${project.client}-${index}`}>
          <article className="group">
            <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
              <Image
                src={project.src}
                alt={project.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className={`${project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                style={{ objectPosition: project.position }}
              />
              {/* Scrim reforçado: a arte por baixo é cheia (selos, telefones,
                  números de WhatsApp) e o gradiente curto anterior não dava
                  contraste suficiente pro nome do cliente. */}
              <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/90 via-black/55 to-transparent p-3 pt-20">
                <div>
                  <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/70">{project.tags}</p>
                  <h3 className="mt-1.5 font-display text-[15px] font-bold leading-[1.15] tracking-[-0.01em]">{project.client}</h3>
                </div>
              </div>
            </div>
          </article>
        </div>
      ))}
    </TiltGrid>
  )
}
