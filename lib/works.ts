// Vitrine de serviços em órbita — cada card mostra uma miniatura estática e o
// celular reproduz a mídia real daquele serviço.
//
// Regras que valem pra qualquer edição futura deste arquivo:
//   • Todo caminho aqui existe em /public. Nada de placeholder ou stock.
//   • A tela do device aponta pra /videos/device/: loops de 12s, 720p de
//     altura (mesma resolução do arquivo cheio — é o teto disponível, o
//     mockup cresceu e 480p ficava visivelmente borrado nele). O arquivo
//     cheio continua no grid do portfólio, que é click-to-play.
//   • `card` é SEMPRE .webp (o card orbita e não pode carregar vídeo). Quando a
//     tela é vídeo, o card usa o poster já gerado pra esse vídeo.
//   • `format` descreve a proporção REAL do arquivo de `card` — a proporção
//     medida está anotada em cada item. Não existe nenhum asset em paisagem na
//     biblioteca (o mais largo é 1:1), por isso 'landscape' não é usado.
//   • `label` e `caption` derivam de `services` em lib/data.ts.

export type Work = {
  id: string
  label: string
  caption: string
  format: 'portrait' | 'square' | 'landscape'
  accent: string
  card: string
  screen:
    | { type: 'image'; src: string }
    | { type: 'video'; src: string; poster: string }
}

export const works: Work[] = [
  {
    id: 'social-media',
    label: 'Social media',
    caption: 'Rotina editorial e conteúdo',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#da2d3a',
    card: '/portfolio-media/videos/poster-social-feed.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-social-feed.mp4',
      poster: '/portfolio-media/videos/poster-social-feed.webp',
    },
  },
  {
    id: 'identidade-visual',
    label: 'Identidade visual',
    caption: 'Marcas e sistemas visuais',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#28112e',
    card: '/portfolio-media/videos/poster-identidade-kit-2.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-identidade-kit-2.mp4',
      poster: '/portfolio-media/videos/poster-identidade-kit-2.webp',
    },
  },
  {
    id: 'design',
    label: 'Design',
    caption: 'Campanhas e lançamentos',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#ef5a78',
    card: '/portfolio-media/videos/poster-design-carrosseis-2.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-design-carrosseis-2.mp4',
      poster: '/portfolio-media/videos/poster-design-carrosseis-2.webp',
    },
  },
  {
    id: 'edicao-de-video',
    label: 'Edição de vídeo',
    caption: 'Antes e depois de edição',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#b04ab0',
    card: '/portfolio-media/videos/poster-eixo-antes-depois.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-eixo-antes-depois.mp4',
      poster: '/portfolio-media/videos/poster-eixo-antes-depois.webp',
    },
  },
  {
    id: 'gestao-de-conteudo',
    label: 'Gestão de conteúdo',
    caption: 'Posts no dia, sem atraso',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#6a3fb0',
    card: '/portfolio-media/videos/poster-gestao-trello.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-gestao-trello.mp4',
      poster: '/portfolio-media/videos/poster-gestao-trello.webp',
    },
  },
  {
    id: 'landing-pages',
    label: 'Landing pages',
    caption: 'Páginas que convertem',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#d94f96',
    card: '/portfolio-media/videos/poster-landing-manoa-rapido.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-landing-manoa-rapido.mp4',
      poster: '/portfolio-media/videos/poster-landing-manoa-rapido.webp',
    },
  },
  {
    id: 'trafego-pago',
    label: 'Tráfego pago',
    caption: 'Resultados reais, mês a mês',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#8b4bc8',
    card: '/portfolio-media/videos/poster-trafego-painel-well.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-trafego-painel-well.mp4',
      poster: '/portfolio-media/videos/poster-trafego-painel-well.webp',
    },
  },
]
