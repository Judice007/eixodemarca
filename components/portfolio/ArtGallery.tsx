'use client'

import FloatingCardGallery, { type FloatingCard } from '@/components/ui/floating-card-gallery'
import { artClients } from '@/lib/portfolio'

/**
 * Um card por CLIENTE (não por peça): o clique leva a
 * /portfolio/artes/[slug], que reúne tudo o que fizemos pra aquela marca.
 * Por peça, "Eixo de Marca" e "Laura Anjos" viravam dois cards iguais.
 *
 * `author` é sempre "Eixo de Marca" com o símbolo da marca: o slot é uma
 * assinatura, e quem assina as peças é o estúdio. Pôr o cliente ali
 * duplicaria o título do card.
 */
const CARDS: FloatingCard[] = artClients.map((client) => ({
  title: client.name,
  description: client.coverAlt,
  image: client.cover,
  author: 'Eixo de Marca',
  avatar: '/eixo-symbol.png',
  category: client.tags,
  meta: client.items.length === 1 ? '1 peça' : `${client.items.length} peças`,
  href: `/portfolio/artes/${client.slug}`,
}))

export default function ArtGallery() {
  return <FloatingCardGallery cards={CARDS} maxCards={artClients.length} className="mt-14" />
}
