// Vitrine de serviços em órbita — cada card mostra uma miniatura estática e o
// celular reproduz a mídia real daquele serviço.
//
// Regras que valem pra qualquer edição futura deste arquivo:
//   • Todo caminho aqui existe em /public. Nada de placeholder ou stock.
//   • A tela do device aponta pra /videos/device/: loops de 12s e 480p de
//     altura, porque ali o vídeo roda num retângulo de ~190px. O arquivo cheio
//     continua no grid do portfólio, que é click-to-play.
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
    format: 'portrait', // poster 640x1138 (9:16)
    accent: '#ff665c',
    card: '/portfolio-media/videos/poster-movimenta-angra.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-portfolio-03.mp4',
      poster: '/portfolio-media/videos/poster-movimenta-angra.webp',
    },
  },
  {
    id: 'identidade-visual',
    label: 'Identidade visual',
    caption: 'Marcas e sistemas visuais',
    format: 'square', // marca Vista Bajeko 1080x1080 (1:1)
    accent: '#2a104a',
    // Card = a marca da Vista Bajeko; tela = a mesma marca aplicada no manual.
    card: '/portfolio-media/identidade-vista-bajeko.webp',
    screen: { type: 'image', src: '/portfolio-media/identidade-vista-bajeko-manual.webp' },
  },
  {
    id: 'design',
    label: 'Design',
    caption: 'Campanhas e lançamentos',
    // 640x800 (4:5). Em 'portrait' (9:19.5) a peça perderia quase toda a
    // diagramação no corte; 'square' corta pouco e mantém o assunto.
    format: 'square',
    accent: '#ef5a78',
    card: '/portfolio-media/design-ukimports.webp',
    screen: { type: 'image', src: '/portfolio-media/design-ukimports.webp' },
  },
  {
    id: 'edicao-de-video',
    label: 'Edição de vídeo',
    caption: 'Reels, takes e coberturas',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#b04ab0',
    card: '/portfolio-media/videos/poster-edicao-institucional.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-edicao-institucional.mp4',
      poster: '/portfolio-media/videos/poster-edicao-institucional.webp',
    },
  },
  {
    id: 'gestao-de-projetos',
    label: 'Gestão de projetos',
    caption: 'Tarefas, pessoas e processos',
    format: 'square', // 640x961 (2:3) — foto, aceita corte central sem perder o assunto
    accent: '#6a3fb0',
    card: '/portfolio-media/gestao-projetos-equipe.webp',
    screen: { type: 'image', src: '/portfolio-media/gestao-projetos-equipe.webp' },
  },
  {
    id: 'landing-pages',
    label: 'Landing pages',
    caption: 'Páginas que convertem',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#d94f96',
    card: '/portfolio-media/videos/poster-manoa-tour.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-manoa-tour.mp4',
      poster: '/portfolio-media/videos/poster-manoa-tour.webp',
    },
  },
  {
    id: 'trafego-pago',
    label: 'Tráfego pago',
    caption: 'Campanhas com público certo',
    format: 'portrait', // poster 480x854 (9:16)
    accent: '#8b4bc8',
    card: '/portfolio-media/videos/poster-trafego-pago.webp',
    screen: {
      type: 'video',
      src: '/portfolio-media/videos/device/video-trafego-pago.mp4',
      poster: '/portfolio-media/videos/poster-trafego-pago.webp',
    },
  },
]
