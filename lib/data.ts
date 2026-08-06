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
    label: 'Gestão & Otimização',
    description: 'Acompanhar tarefas, mídia e resultados para ajustar a rota sem perder prazos ou consistência.',
    bullets: ['Gestão do fluxo', 'Leitura de dados', 'Ajustes contínuos'],
  },
]
