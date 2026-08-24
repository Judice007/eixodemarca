import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { artClientBySlug, artClients } from '@/lib/portfolio'

export function generateStaticParams() {
  return artClients.map((client) => ({ slug: client.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const client = artClientBySlug(slug)
  if (!client) return {}

  return {
    title: `${client.name} — Artes | Eixo de Marca`,
    description: `Peças de ${client.tags.toLowerCase()} produzidas pelo Eixo de Marca para ${client.name}.`,
    alternates: { canonical: `/portfolio/artes/${client.slug}` },
  }
}

export default async function ArtClientPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const client = artClientBySlug(slug)
  if (!client) notFound()

  const total = client.items.length

  return (
    <main className="min-h-screen bg-[#fffdfa] text-ink">
      <SiteHeader />

      <section className="bg-ink px-[var(--gutter)] pb-[clamp(82px,10vw,140px)] pt-[clamp(130px,18vh,190px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <Link
            href="/portfolio/artes"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> Todas as artes
          </Link>

          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h1 className="max-w-[980px] [text-wrap:balance] font-display text-[clamp(28px,4.6vw,66px)] font-black uppercase leading-[0.96] tracking-[-0.04em]">
              {client.name}
            </h1>
            <div className="max-w-[290px]">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-azure">{client.tags}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                {total === 1 ? '1 peça produzida' : `${total} peças produzidas`} pelo Eixo de Marca.
              </p>
            </div>
          </div>

          {/* Uma coluna quando é peça única: numa grade de 3, uma arte sozinha
              fica encolhida num canto com dois buracos ao lado. */}
          <div
            className={`mt-14 grid gap-5 ${
              total === 1 ? 'max-w-[620px] grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {client.items.map((item, index) => (
              <figure key={`${item.src}-${index}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-white/5">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={total === 1 ? '(min-width: 640px) 620px, 92vw' : '(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 92vw'}
                    className={`${item.fit === 'contain' ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                    style={{ objectPosition: item.position }}
                    priority={index === 0}
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="font-display text-[15px] font-bold uppercase leading-tight tracking-[-0.02em] text-white">
                    {item.client}
                  </span>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
                    {item.tags}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Caminho de volta pro resto do portfólio, senão a página é um beco. */}
          <div className="mt-[clamp(64px,8vw,110px)] border-t border-white/15 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Outras marcas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {artClients
                .filter((other) => other.slug !== client.slug)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/portfolio/artes/${other.slug}`}
                    className="border border-white/15 px-4 py-2 font-sans text-[12px] font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {other.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
