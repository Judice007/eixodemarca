'use client'

import InteractiveBentoGallery from '@/components/ui/interactive-bento-gallery'
import { portfolioVideos } from '@/lib/portfolio'

// Mosaico de verdade: as células têm tamanhos diferentes, mas TODAS ficam mais
// altas que largas — a proporção varia de ~0.67 a ~0.50, ou seja, sempre no
// formato reels dos vídeos, nunca deitada como no bento original.
//
// No mobile o `aspect-[9/16]` manda; de `sm` pra cima o row-span assume (por
// isso o `sm:aspect-auto`), com auto-rows curtas fazendo o escalonamento.
const SPANS = [
  'aspect-[9/16] sm:aspect-auto sm:row-span-13',
  'aspect-[9/16] sm:aspect-auto sm:row-span-16',
  'aspect-[9/16] sm:aspect-auto sm:row-span-14',
  'aspect-[9/16] sm:aspect-auto sm:row-span-15',
  'aspect-[9/16] sm:aspect-auto sm:row-span-12',
  'aspect-[9/16] sm:aspect-auto sm:row-span-16',
]

const ITEMS = portfolioVideos.map((video, index) => ({
  id: index + 1,
  type: 'video',
  title: video.title,
  desc: video.tag,
  url: video.src,
  span: SPANS[index % SPANS.length]!,
}))

export default function VideoMosaic() {
  return (
    <InteractiveBentoGallery
      mediaItems={ITEMS}
      title=""
      description=""
      containerClassName="mt-10"
      // grid-flow-row-dense: sem isso os spans diferentes deixam buracos no
      // meio do mosaico em vez de encaixarem uns nos outros.
      gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 sm:auto-rows-[40px] sm:grid-flow-row-dense"
    />
  )
}
