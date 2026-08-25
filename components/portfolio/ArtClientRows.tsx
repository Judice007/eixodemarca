import Image from 'next/image'
import Link from 'next/link'
import { artClients } from '@/lib/portfolio'

/**
 * Acervo em uma linha por cliente.
 *
 * A grade anterior misturava as 32 peças de nove marcas: dava pra ver que o
 * estúdio produz bastante, mas não que produz uma LINHA pra cada cliente —
 * que é o argumento. Agrupado, cada faixa mostra a coerência de um feed.
 *
 * Componente de servidor: não tem estado nem animação, então não paga JS no
 * cliente. A abertura animada acima já é o suficiente de movimento na página.
 */
export default function ArtClientRows() {
  return (
    <div className="mt-[clamp(60px,8vw,110px)] flex flex-col">
      {artClients.map((client) => (
        <section key={client.slug} className="border-t border-white/12 py-[clamp(26px,3.5vw,44px)]">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-[clamp(20px,2.4vw,32px)] font-black leading-none tracking-[-0.03em]">
                {client.name}
              </h3>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">{client.tags}</p>
            </div>

            <Link
              href={`/portfolio/artes/${client.slug}`}
              className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-azure transition-colors hover:text-white"
            >
              {client.items.length === 1 ? 'Ver a peça' : `Ver as ${client.items.length} peças`}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Uma linha só. Cabe inteira no desktop (6 peças é o máximo hoje) e
              rola na horizontal no celular. O overflow é DESTE elemento, então
              ele mantém a barra própria e não mexe na rolagem da página. */}
          <ul className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:gap-4">
            {client.items.map((project) => (
              <li key={project.src} className="w-[clamp(132px,17vw,206px)] shrink-0 snap-start">
                <Link
                  href={`/portfolio/artes/${client.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-white/5"
                >
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes="(min-width: 1240px) 206px, (min-width: 768px) 17vw, 132px"
                    className={`${project.fit === 'contain' ? 'object-contain p-6' : 'object-cover'} transition-transform duration-500 group-hover:scale-[1.04]`}
                    style={{ objectPosition: project.position }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
