import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import IdentityCarousel from '@/components/identity/IdentityCarousel'
import { identities } from '@/lib/portfolio'
import { pageMeta } from '@/lib/seo'

export function generateStaticParams() {
  return identities.map((identity) => ({ slug: identity.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const identity = identities.find((item) => item.slug === slug)
  if (!identity) return {}

  return pageMeta({
    title: `${identity.name}: identidade visual`,
    description: `Logo e identidade visual criadas pelo Eixo de Marca para ${identity.name}.`,
    path: `/identidade-visual/${identity.slug}`,
    image: identity.src,
    imageAlt: identity.name,
  })
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
