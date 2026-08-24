// Dados do portfólio, separados de lib/data.ts porque são usados pela home
// (seção "Marcas e histórias") E pelas páginas dedicadas /portfolio/artes e
// /portfolio/video — mantê-los aqui evita duplicar os arrays em cada lugar.

export const projects = [
  {
    type: 'image' as const,
    src: '/portfolio-media/design-ukimports.webp',
    alt: 'Campanha de smartphones para UK Imports',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center 45%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-acai.webp',
    alt: 'Conteúdo para Di Casa Açaí',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center 42%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/identidade-vista-bajeko.webp',
    alt: 'Identidade visual Vista Bajeko',
    client: 'Vista Bajeko',
    tags: 'Marca · Identidade visual',
    fit: 'contain' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-reset.webp',
    alt: 'Campanha sustentável para Reset Madeira Ecológica',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center 50%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/portfolio-eixo.webp',
    alt: 'Peça da Eixo de Marca sobre direção de conteúdo',
    client: 'Eixo de Marca',
    tags: 'Posicionamento · Design',
    fit: 'cover' as const,
    position: 'center 50%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/landing-pousada.webp',
    alt: 'Landing page da Pousada da Praia',
    client: 'Pousada da Praia',
    tags: 'Web · Landing page',
    fit: 'cover' as const,
    position: 'center 46%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/trafego-itamang.webp',
    alt: 'Campanha de tráfego para Itamang',
    client: 'Itamang',
    tags: 'Tráfego pago',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-lembrada.webp',
    alt: 'Post sobre clareza de marca para a Eixo de Marca',
    client: 'Eixo de Marca',
    tags: 'Posicionamento · Design',
    fit: 'cover' as const,
    position: 'center 30%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-laura-dispositivo.webp',
    alt: 'Post sobre dispositivo de estética para Laura Anjos',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center 30%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-laura-pele-desidratada.webp',
    alt: 'Post sobre sinais de pele desidratada para Laura Anjos',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center 55%',
  },
]

export const portfolioVideos = [
  {
    src: '/portfolio-media/videos/video-pousada-01.mp4',
    poster: '/portfolio-media/videos/poster-pousada-01.webp',
    title: 'Pousada da Praia',
    tag: 'Turismo · Apresentação',
  },
  {
    src: '/portfolio-media/videos/video-trafego-pago.mp4',
    poster: '/portfolio-media/videos/poster-trafego-pago.webp',
    title: 'Beleza ou estratégia',
    tag: 'Gancho · Tráfego pago',
  },
  {
    src: '/portfolio-media/videos/video-massagem.mp4',
    poster: '/portfolio-media/videos/poster-massagem.webp',
    title: 'Bem-estar & spa',
    tag: 'Gancho · Reels',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-01.mp4',
    poster: '/portfolio-media/videos/poster-procedimento-estetico.webp',
    title: 'Procedimento estético',
    tag: 'Captação · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-02.mp4',
    poster: '/portfolio-media/videos/poster-conteudo-fitness.webp',
    title: 'Conteúdo fitness',
    tag: 'Ritmo · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-03.mp4',
    poster: '/portfolio-media/videos/poster-movimenta-angra.webp',
    title: 'Movimenta Angra',
    tag: 'Apresentação · Cobertura',
  },
] as const

// Uma marca por item hoje (a maioria só tem a logo no projeto ainda — só a
// Vista Bajeko tem uma segunda peça, o mockup de camiseta, usado aqui em vez
// da logo plana por mostrar a marca aplicada). `accent` é só a cor de fundo
// do card na página /identidade-visual/[slug] — não é conteúdo, é estilo.
export const identities = [
  { slug: 'eixo-de-marca', name: 'Eixo de Marca', src: '/portfolio-media/marca-eixo.webp', alt: 'Eixo de Marca', accent: '#2a104a' },
  { slug: 'vista-bajeko', name: 'Vista Bajeko', src: '/portfolio-media/identidade-vista-bajeko-manual.webp', alt: 'Vista Bajeko', accent: '#0b4a5c' },
  { slug: 'espaco-dos-anjos', name: 'Espaço dos Anjos', src: '/portfolio-media/marca-espaco-dos-anjos.webp', alt: 'Espaço dos Anjos', accent: '#b8879a' },
  { slug: 'laura-anjos', name: 'Laura Anjos', src: '/portfolio-media/marca-laura-anjos.webp', alt: 'Laura Anjos', accent: '#caa153' },
  { slug: 'viva-angra', name: 'Viva Angra', src: '/portfolio-media/marca-viva-angra.webp', alt: 'Viva Angra', accent: '#2f7d6b' },
  { slug: 'luciane-judice', name: 'Luciane Júdice', src: '/portfolio-media/marca-luciane-judice.webp', alt: 'Luciane Júdice', accent: '#8b4bc8' },
  { slug: 'itamang', name: 'Itamang', src: '/portfolio-media/marca-itamang.webp', alt: 'Itamang', accent: '#3a5a8c' },
  { slug: 'bm', name: 'BIG', src: '/portfolio-media/marca-bm.webp', alt: 'BIG', accent: '#ff665c' },
] as const

export const marks = identities.map(({ src, alt }) => ({ src, alt }))

// ─────────────────────────────────────────────────────────────────────────────
// Artes agrupadas por cliente.
//
// A home mostra um card por CLIENTE (não por peça) e o clique leva a
// /portfolio/artes/[slug], que reúne tudo o que fizemos pra aquela marca.
// Agrupar aqui é o que funde as duplicatas: "Eixo de Marca" e "Laura Anjos"
// aparecem duas vezes em `projects` e viravam dois cards iguais na home.
//
// Pra adicionar arte nova: basta acrescentar em `projects` com o mesmo
// `client` — ela entra na página daquele cliente sozinha, sem mexer aqui.

export type Project = (typeof projects)[number]

export type ArtClient = {
  slug: string
  name: string
  /** tags da primeira peça, usada como categoria do card */
  tags: string
  cover: string
  coverAlt: string
  items: Project[]
}

/** "Di Casa Açaí" -> "di-casa-acai" */
function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const artClients: ArtClient[] = (() => {
  const porSlug = new Map<string, ArtClient>()

  for (const project of projects) {
    const slug = slugify(project.client)
    const existente = porSlug.get(slug)
    if (existente) {
      existente.items.push(project)
      continue
    }
    porSlug.set(slug, {
      slug,
      name: project.client,
      tags: project.tags,
      cover: project.src,
      coverAlt: project.alt,
      items: [project],
    })
  }

  return [...porSlug.values()]
})()

export function artClientBySlug(slug: string) {
  return artClients.find((client) => client.slug === slug)
}
