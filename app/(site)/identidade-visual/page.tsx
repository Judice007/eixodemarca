import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import IdentityCarousel from '@/components/identity/IdentityCarousel'

export const metadata: Metadata = {
  title: 'Identidade Visual — Eixo de Marca',
  description: 'Marcas e sistemas de identidade visual criados pelo Eixo de Marca.',
  alternates: { canonical: '/identidade-visual' },
}

export default function IdentityIndexPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <IdentityCarousel />
      <SiteFooter />
    </main>
  )
}
