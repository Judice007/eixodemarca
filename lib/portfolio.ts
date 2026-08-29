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
  // ── Artes entregues pelo cliente (pasta _PARA O SITE) ─────────────────────
  // Todas 1080x1350 (4:5 de feed), então `cover` + `center` não corta nada: o
  // card da home e a grade da página do cliente usam a mesma proporção.
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-01.webp',
    alt: 'Post da UK Imports com iPhone laranja e a frase "Nada menos que o melhor"',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-02.webp',
    alt: 'Post da UK Imports com iPhone laranja e a pergunta "Orange is the new black?"',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-03.webp',
    alt: 'Carrossel da UK Imports sobre por que usuários de iPhone não devem usar o Chrome',
    client: 'UK Imports',
    tags: 'Carrossel · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-04.webp',
    alt: 'Carrossel da UK Imports sobre os sete novos produtos lançados pela Apple',
    client: 'UK Imports',
    tags: 'Carrossel · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/uk-imports-05.webp',
    alt: 'Post da UK Imports com dois iPhones lado a lado e a frase "Quem tem, não volta atrás"',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/di-casa-acai-01.webp',
    alt: 'Post da Di Casa Açaí com copo de açaí, morango e banana sobre fundo roxo',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/di-casa-acai-02.webp',
    alt: 'Meme da Di Casa Açaí sobre a reação de quem escuta o convite para pedir açaí',
    client: 'Di Casa Açaí',
    tags: 'Social media · Humor',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/di-casa-acai-03.webp',
    alt: 'Post da Di Casa Açaí com copo de açaí e frutas e a pergunta "Já tomou seu açaí hoje?"',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-01.webp',
    alt: 'Post da Reset com área gourmet em deck de madeira e a frase "O barato sai caro. Invista certo!"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-02.webp',
    alt: 'Post da Reset com pergolado de madeira no jardim e a chamada "25 anos de garantia"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-03.webp',
    alt: 'Post da Reset com passarela de madeira entre árvores e a frase "Construção e preservação"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/reset-04.webp',
    alt: 'Post da Reset com fachada revestida em madeira e a frase "Mais do que madeira: confiança e legado"',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-04.webp',
    alt: 'Post da EcoUtil com deck de madeira à beira-mar e as palavras durabilidade, elegância e sustentabilidade',
    client: 'EcoUtil',
    tags: 'Social media · Sustentabilidade',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-01.webp',
    alt: 'Post da EcoUtil com piscina cercada por deck de madeira ecológica',
    client: 'EcoUtil',
    tags: 'Social media · Sustentabilidade',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-02.webp',
    alt: 'Post "Você sabia?" da EcoUtil: uma árvore salva a cada 600 kg de madeira ecológica',
    client: 'EcoUtil',
    tags: 'Social media · Educativo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/ecoutil-03.webp',
    alt: 'Post da EcoUtil com amostras de madeira ecológica empilhadas diante do mar',
    client: 'EcoUtil',
    tags: 'Social media · Produto',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/itamang-01.webp',
    alt: 'Post da Itamang com mangueira de jardim enrolada sobre a grama',
    client: 'Itamang',
    tags: 'Tráfego pago',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/itamang-02.webp',
    alt: 'Post da Itamang com a van da empresa e a chamada "Agilidade na entrega"',
    client: 'Itamang',
    tags: 'Social media · Serviço',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/itamang-03.webp',
    alt: 'Post da Itamang com rolos de mangueira em paletes no estoque',
    client: 'Itamang',
    tags: 'Social media · Produto',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/pousada-da-praia-01.webp',
    alt: 'Post da Pousada da Praia com drink e guarda-sol na areia e a frase "Natureza, conforto e pé na areia"',
    client: 'Pousada da Praia',
    tags: 'Social media · Turismo',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/pousada-da-praia-02.webp',
    alt: 'Post da Pousada da Praia com a tabela de pacotes de Carnaval',
    client: 'Pousada da Praia',
    tags: 'Campanha · Sazonal',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/artes/pousada-da-praia-03.webp',
    alt: 'Post da Pousada da Praia com a tabela de pacotes de Natal sobre fundo vermelho',
    client: 'Pousada da Praia',
    tags: 'Campanha · Sazonal',
    fit: 'cover' as const,
    position: 'center',
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
  // Manual fechado em 29/08/2026. Card montado em 1080x1440 — o 3:4 exato do
  // carrossel — com a logo aparada até o lettering: o PNG de origem tinha
  // margem demais e a marca saía boiando no cartão.
  {
    slug: 'jo-salao-de-beleza',
    name: 'JO Salão de Beleza',
    src: '/portfolio-media/marca-jo-salao-de-beleza.webp',
    alt: 'JO Salão de Beleza',
    accent: '#922b1a',
  },
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
export function slugify(value: string) {
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
