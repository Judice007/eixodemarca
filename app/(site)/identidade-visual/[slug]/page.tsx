import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import IdentityCarousel from '@/components/identity/IdentityCarousel'
import { identities } from '@/lib/portfolio'

export function generateStaticParams() {
  return identities.map((identity) => ({ slug: identity.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const identity = identities.find((item) => item.slug === slug)
  if (!identity) return {}

  return {
    title: `${identity.name} — Identidade Visual — Eixo de Marca`,
    description: `Identidade visual de ${identity.name}, criada pelo Eixo de Marca.`,
    alternates: { canonical: `/identidade-visual/${identity.slug}` },
    // Sem isto a página herda o openGraph global e TODAS as marcas são
    // compartilhadas com o mesmo título e a mesma imagem.
    openGraph: {
      title: `${identity.name} — Identidade Visual`,
      description: `Identidade visual de ${identity.name}, criada pelo Eixo de Marca.`,
      images: [{ url: identity.src, alt: identity.name }],
    },
  }
}

export default async function IdentityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!identities.some((identity) => identity.slug === slug)) notFound()

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <IdentityCarousel slug={slug} />
      <SiteFooter />
    </main>
  )
}
