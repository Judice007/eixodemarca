'use client'

import { HeroCarousel, type HeroCarouselItem } from '@/components/ui/hero-carousel'
import { identities } from '@/lib/portfolio'

// Quebra no primeiro espaço só pra dar duas linhas no efeito de wipe do
// título — funciona bem o suficiente pros 8 nomes reais que temos hoje
// ("Eixo de Marca" -> "Eixo" / "de Marca"); nomes de uma palavra só (Itamang,
// BIG) ficam numa linha só, sem quebra.
const ITEMS: HeroCarouselItem[] = identities.map((identity) => ({
  id: identity.slug,
  title: identity.name.replace(' ', '\n'),
  image: identity.src,
  credit: 'IDENTIDADE VISUAL · EIXO DE MARCA',
  accent: identity.accent,
}))

export default function IdentityCarousel({ slug }: { slug?: string }) {
  const found = slug ? identities.findIndex((identity) => identity.slug === slug) : 0
  const defaultIndex = Math.max(0, found)

  // Sem onBack/brand/onMenu: o SiteHeader acima já cobre navegação (logo
  // volta pra home, nav tem Portfólio etc.) — a barra interna do carrossel
  // ficava embaixo do header fixo, escondida, então era só ruído redundante.
  // headingLevel h1: o carrossel É o conteúdo da página da identidade, e o
  // nome da marca é o título dela. Sem isso a página não tinha h1 nenhum.
  return (
    <HeroCarousel
      items={ITEMS}
      defaultIndex={defaultIndex}
      headingLevel="h1"
      className="min-h-[80vh]"
    />
  )
}
