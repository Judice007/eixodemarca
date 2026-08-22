import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // @splinetool/runtime referencia via new URL(...) alguns arquivos wasm/draco
  // que o pacote publicado no npm não inclui (são carregados via CDN deles em
  // runtime, só quando a cena realmente usa malha comprimida com Draco). O
  // bundler tenta resolver essas referências em build e quebra — ignora esses
  // módulos específicos, já que o carregamento real deles é opcional/lazy.
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /draco_wasm_wrapper|draco_decoder|boolean_wasm_bg\.wasm/,
      })
    )
    return config
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
