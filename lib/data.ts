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
  instagram: 'https://www.instagram.com/eixodemarca/',
  linkedin: '',
  facebook: '',
}

const WHATSAPP_MESSAGE = 'Olá, Eixo de Marca. Quero conversar sobre um projeto para a minha marca.'

// Mensagem própria pro CTA da análise gratuita, pra identificar esse lead
// (o time responde com o link do formulário assim que vê essa frase).
const PONTO_CEGO_MESSAGE = 'Oi! Quero descobrir meu Ponto Cego 👀'

export const whatsappUrl = `https://wa.me/${contactInfo.phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
export const pontoCegoWhatsappUrl = `https://wa.me/${contactInfo.phone}?text=${encodeURIComponent(PONTO_CEGO_MESSAGE)}`
export const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent('Projeto com o Eixo de Marca')}`

export type MethodStep = {
  key: string
  label: string
  description: string
  bullets: string[]
}

// As 4 etapas do método, escritas do lado de quem contrata: verbo simples no
// lugar de jargão de agência (Diagnóstico, Otimização, "rota editorial",
// "leitura de dados"). Só diz o que já era verdade no texto anterior — nenhuma
// promessa nova. As `key` ficam como estavam: são só chave do React.
export const methodSteps: MethodStep[] = [
  {
    key: 'diagnostico',
    label: 'Entender',
    description: 'Conversamos pra conhecer seu negócio, seu cliente e onde ele te encontra — antes de criar qualquer coisa.',
    bullets: ['Seu negócio', 'Seu cliente', 'Seus objetivos'],
  },
  {
    key: 'planejamento',
    label: 'Planejar',
    description: 'Montamos o calendário: o que postar, quando e por quê, com cada tarefa e cada responsável definidos.',
    bullets: ['Calendário de posts', 'Prazos', 'Quem faz o quê'],
  },
  {
    key: 'producao',
    label: 'Criar',
    description: 'Criamos tudo o que vai ao ar: artes, vídeos, textos, identidade visual e páginas.',
    bullets: ['Artes e identidade visual', 'Vídeos', 'Páginas'],
  },
  {
    key: 'otimizacao',
    label: 'Acompanhar',
    description: 'Olhamos os resultados e ajustamos o caminho: o que deu certo continua, o que não deu muda.',
    bullets: ['Resultados', 'Anúncios', 'Ajustes no caminho'],
  },
]
