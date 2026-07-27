export const services = [
  {
    num: '01',
    title: 'ESTRATÉGIA DE MARCA',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=600&q=80',
    alt: 'Planejamento estratégico',
  },
  {
    num: '02',
    title: 'IDENTIDADE VISUAL',
    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=600&q=80',
    alt: 'Sistema de identidade visual',
  },
  {
    num: '03',
    title: 'CONTEÚDO & MOTION',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    alt: 'Conteúdo em movimento',
  },
  {
    num: '04',
    title: 'PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    alt: 'Estratégia de performance',
  },
  {
    num: '05',
    title: 'TECNOLOGIA',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    alt: 'Experiências digitais',
  },
]

// TODO: caseImage está repetido nos 4 só para teste de layout — trocar Conteúdo/
// Motion/Performance por exemplos reais de cada frente antes de publicar de vez.
export const heroServices = [
  {
    title: 'Branding',
    category: 'Identidade & Posicionamento',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
  {
    title: 'Conteúdo',
    category: 'Social & Narrativa',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
  {
    title: 'Motion',
    category: 'Vídeo & Movimento',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
  {
    title: 'Performance',
    category: 'Mídia & Crescimento',
    caseImage: '/work/vista-bajeko-branding.jpg',
    caseLabel: 'Vista Bajeko',
  },
]

export const portfolio = [
  {
    title: 'Marcas que orientam',
    category: 'Estratégia de marca',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Sistemas que identificam',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Histórias que movimentam',
    category: 'Conteúdo & Motion',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Campanhas que conectam',
    category: 'Criação',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Decisões que evoluem',
    category: 'Estratégia digital',
    image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Presença que cresce',
    category: 'Performance',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=900&q=80',
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

export type TeamMember = {
  name: string
  role: string
  photo: string
  oneLiner: string
  bio: string
  links?: { linkedin?: string; instagram?: string; behance?: string }
  skills?: string[]
  projects?: string[]
  quote?: string
}

export type Team = {
  key: string
  label: string
  cover: string
  members: TeamMember[]
}

const capability = (
  name: string,
  role: string,
  photo: string,
  oneLiner: string,
  skills: string[]
): TeamMember => ({
  name,
  role,
  photo,
  oneLiner,
  bio: oneLiner,
  skills,
})

// A seção apresenta competências e etapas, sem simular nomes ou pessoas reais.
export const teams: Team[] = [
  {
    key: 'direcao',
    label: 'Direção',
    cover: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1000&q=80',
    members: [
      capability('Diagnóstico', 'Escuta', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80', 'Entender antes de criar.', ['Pesquisa', 'Imersão']),
      capability('Posicionamento', 'Estratégia', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80', 'Definir o lugar da marca.', ['Território', 'Mensagem']),
      capability('Arquitetura', 'Sistema', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=400&q=80', 'Organizar para crescer.', ['Portfólio', 'Jornada']),
    ],
  },
  {
    key: 'marca',
    label: 'Marca',
    cover: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1000&q=80',
    members: [
      capability('Conceito', 'Essência', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80', 'Dar forma a uma ideia central.', ['Conceito', 'Narrativa']),
      capability('Identidade', 'Expressão', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80', 'Criar reconhecimento.', ['Visual', 'Verbal']),
      capability('Sistema', 'Consistência', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80', 'Fazer a marca funcionar.', ['Guidelines', 'Aplicações']),
    ],
  },
  {
    key: 'conteudo',
    label: 'Conteúdo',
    cover: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80',
    members: [
      capability('Narrativa', 'Voz', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80', 'Transformar estratégia em conversa.', ['Copy', 'Storytelling']),
      capability('Social', 'Presença', 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=400&q=80', 'Construir relevância no ritmo certo.', ['Calendário', 'Comunidade']),
      capability('Motion', 'Movimento', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80', 'Fazer a identidade respirar.', ['Vídeo', 'Animação']),
    ],
  },
  {
    key: 'performance',
    label: 'Performance',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    members: [
      capability('Mídia', 'Distribuição', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80', 'Levar a mensagem até as pessoas certas.', ['Ads', 'Segmentação']),
      capability('Métricas', 'Leitura', 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=400&q=80', 'Aprender com cada resposta.', ['Analytics', 'Insights']),
      capability('Otimização', 'Evolução', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80', 'Melhorar de ciclo em ciclo.', ['Testes', 'Ajustes']),
    ],
  },
  {
    key: 'tecnologia',
    label: 'Tecnologia',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    members: [
      capability('Experiência', 'UX', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=400&q=80', 'Criar jornadas claras.', ['UX', 'Interface']),
      capability('Produto', 'Digital', 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=400&q=80', 'Transformar estratégia em ferramenta.', ['Web', 'Produto']),
      capability('Integração', 'Escala', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', 'Conectar pontos para crescer.', ['Automação', 'Dados']),
    ],
  },
]
