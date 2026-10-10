import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import IdentityCarousel from '@/components/identity/IdentityCarousel'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Identidade visual',
  description: 'Logos e identidades visuais criadas pelo Eixo de Marca para marcas de Angra dos Reis e região.',
  path: '/identidade-visual',
})

export default function IdentityIndexPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <IdentityCarousel />
      <SiteFooter />
    </main>
  )
}
