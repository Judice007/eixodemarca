import type { MetadataRoute } from 'next'
import { artClients, identities } from '@/lib/portfolio'
import { SITE_URL } from '@/lib/site'

// Sai dos dados: cliente ou marca nova em lib/portfolio.ts entra sozinha.
export default function sitemap(): MetadataRoute.Sitemap {
  const caminhos = [
    '',
    '/portfolio/artes',
    '/portfolio/video',
    '/identidade-visual',
    ...artClients.map((cliente) => `/portfolio/artes/${cliente.slug}`),
    ...identities.map((marca) => `/identidade-visual/${marca.slug}`),
  ]
  return caminhos.map((caminho) => ({
    url: `${SITE_URL}${caminho}`,
    changeFrequency: 'monthly',
    priority: caminho === '' ? 1 : 0.7,
  }))
}
