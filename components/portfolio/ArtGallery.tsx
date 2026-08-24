'use client'

import FloatingCardGallery, { type FloatingCard } from '@/components/ui/floating-card-gallery'
import { projects } from '@/lib/portfolio'

/**
 * As 10 peças reais do portfólio na galeria de cards flutuantes.
 *
 * `author` é sempre "Eixo de Marca" com o símbolo da marca: o slot de autor do
 * componente é uma assinatura, e quem assina as peças é o estúdio. Pôr o nome
 * do cliente ali duplicaria o título do card.
 */
const CARDS: FloatingCard[] = projects.map((project) => ({
  title: project.client,
  description: project.alt,
  image: project.src,
  author: 'Eixo de Marca',
  avatar: '/eixo-symbol.png',
  category: project.tags,
  // "Campanha · Design" vira duas pílulas no card aberto
  tags: project.tags.split('·').map((tag) => tag.trim()).filter(Boolean),
  href: '/portfolio/artes',
  hrefLabel: 'Ver todas as artes',
}))

export default function ArtGallery() {
  return <FloatingCardGallery cards={CARDS} maxCards={projects.length} className="mt-14" />
}
