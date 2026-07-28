export const services = [
  {
    title: 'Social media',
    text: 'Planejamento, rotina editorial e conteúdo pensado para aproximar marcas e pessoas.',
  },
  {
    title: 'Design',
    text: 'Peças para campanhas, lançamentos e presença digital com linguagem própria.',
  },
  {
    title: 'Identidade visual',
    text: 'Marcas e sistemas visuais que organizam a comunicação desde o primeiro contato.',
  },
  {
    title: 'Edição de vídeo',
    text: 'Reels, coberturas, takes e conteúdos verticais com ritmo para prender a atenção.',
  },
  {
    title: 'Gestão de projetos',
    text: 'Organização de tarefas, profissionais e processos para o trabalho fluir melhor.',
  },
  {
    title: 'Landing pages',
    text: 'Páginas estratégicas e responsivas para apresentar ofertas, captar contatos e conduzir à conversão.',
  },
  {
    title: 'Tráfego pago',
    text: 'Planejamento, gestão e otimização de campanhas para alcançar o público certo e gerar resultados.',
  },
] as const

export type AxisService = {
  key: string
  title: string
  subtitle: string
  description: string
  bullets: string[]
}

// Os 7 serviços foram agrupados em 4 eixos visuais para preservar a interação
// do X e a sequência alternada do scroll. A ordem define o percurso (Social →
// Design → Vídeo → Projetos & Crescimento) e o lado alterna por índice (par = texto à
// esquerda, ímpar = texto à direita).
export const axisServices: AxisService[] = [
  {
    key: 'social',
    title: 'Social media',
    subtitle: 'Planejamento & Rotina editorial',
    description: 'Planejamento, rotina editorial e conteúdo pensado para aproximar marcas e pessoas.',
    bullets: ['Planejamento de conteúdo', 'Rotina editorial', 'Campanhas'],
  },
  {
    key: 'design',
    title: 'Design & Identidade',
    subtitle: 'Campanhas & Sistemas visuais',
    description: 'Peças para campanhas, lançamentos e presença digital com linguagem própria. Marcas e sistemas visuais que organizam a comunicação desde o primeiro contato.',
    bullets: ['Design', 'Identidade visual', 'Linguagem de marca'],
  },
  {
    key: 'video',
    title: 'Edição de vídeo',
    subtitle: 'Reels & Conteúdo vertical',
    description: 'Reels, coberturas, takes e conteúdos verticais com ritmo para prender a atenção.',
    bullets: ['Reels e vídeos', 'Coberturas e takes', 'Conteúdo vertical'],
  },
  {
    key: 'growth',
    title: 'Projetos & Crescimento',
    subtitle: 'Organização, páginas & mídia',
    description: 'Organização de tarefas, profissionais e processos para o trabalho fluir melhor. Páginas estratégicas e responsivas para apresentar ofertas e conduzir à conversão. Campanhas para alcançar o público certo e gerar resultados.',
    bullets: ['Gestão de projetos', 'Landing pages', 'Tráfego pago'],
  },
]

// TODO: caseImage está repetido nos 4 só para teste de layout — trocar pelas
// imagens aprovadas de cada eixo antes de publicar de vez.
export const heroServices = [
  {
    title: 'Social Media',
    category: 'Planejamento & Conteúdo',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
  {
    title: 'Design',
    category: 'Campanhas & Identidade',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
  {
    title: 'Vídeo',
    category: 'Reels & Audiovisual',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
  {
    title: 'Gestão',
    category: 'Projetos, Páginas & Tráfego',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
]

export type Testimonial = {
  project: string
  image: string
  name: string
  text: string
}

// Mantido vazio até existirem depoimentos aprovados do Eixo de Marca.
export const testimonials: Testimonial[] = []

export const contactInfo = {
  email: 'lipejudice@gmail.com',
  // WhatsApp — formato internacional (55 + DDD + número), sem símbolos.
  phone: '552433662420',
  instagram: '',
  linkedin: '',
  facebook: '',
}

const WHATSAPP_MESSAGE = 'Olá, Eixo de Marca. Quero conversar sobre um projeto para a minha marca.'

export const whatsappUrl = `https://wa.me/${contactInfo.phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
export const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent('Projeto com o Eixo de Marca')}`

export type MethodStep = {
  key: string
  label: string
  description: string
  bullets: string[]
}

// As 4 etapas do método do Eixo (mesmos rótulos usados na coluna "Processo" do
// rodapé) — processo, não pessoas ou serviços, para não repetir axisServices.
export const methodSteps: MethodStep[] = [
  {
    key: 'diagnostico',
    label: 'Diagnóstico',
    description: 'Entender a marca, a oferta, o público e os canais antes de definir qualquer entrega.',
    bullets: ['Briefing', 'Contexto da marca', 'Objetivos'],
  },
  {
    key: 'planejamento',
    label: 'Planejamento',
    description: 'Organizar calendário, campanha, prioridades e responsáveis para o projeto ganhar ritmo.',
    bullets: ['Rota editorial', 'Cronograma', 'Prioridades'],
  },
  {
    key: 'producao',
    label: 'Produção',
    description: 'Transformar a estratégia em design, identidade, vídeo, conteúdo e páginas prontas para o público.',
    bullets: ['Design e identidade', 'Edição de vídeo', 'Landing pages'],
  },
  {
    key: 'otimizacao',
    label: 'Gestão & Otimização',
    description: 'Acompanhar tarefas, mídia e resultados para ajustar a rota sem perder prazos ou consistência.',
    bullets: ['Gestão do fluxo', 'Leitura de dados', 'Ajustes contínuos'],
  },
]
