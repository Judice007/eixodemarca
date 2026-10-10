import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

/**
 * Metadados completos de uma página interna: título (o sufixo vem do template
 * do layout), canonical, og:url, imagem e twitter próprios. Sem isso cada
 * página herdava o openGraph da home e era compartilhada com o mesmo card.
 */
export function pageMeta({
  title,
  description,
  path,
  image = '/og.jpg',
  imageAlt = SITE_NAME,
}: {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
}): Metadata {
  const full = `${title} | ${SITE_NAME}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      url: path,
      title: full,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: full, description, images: [image] },
  }
}
