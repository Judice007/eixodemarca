import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Assets estáticos versionados pelo próprio nome do arquivo: podem ser
        // cacheados pra sempre. Sem isso o vídeo do device era rebaixado a cada
        // visita (e, antes da correção no PhoneStage, a cada volta do rotador).
        source: '/:dir(assets|portfolio-media)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
