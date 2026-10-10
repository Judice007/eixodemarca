export const services = [
  {
    title: 'Social media',
    text: 'Planejamento e criação de posts para o seu perfil falar com quem compra de você.',
  },
  {
    title: 'Design',
    text: 'Posts, carrosséis e artes de campanha com a cara da sua marca.',
  },
  {
    title: 'Identidade visual',
    text: 'Logo, cores e fontes da sua marca, para tudo sair com a mesma cara.',
  },
  {
    title: 'Edição de vídeo',
    text: 'Reels, coberturas e vídeos curtos editados para prender a atenção.',
  },
  {
    title: 'Gestão de conteúdo',
    text: 'Calendário de posts, prazos e publicações organizados para as redes andarem em dia.',
  },
  {
    title: 'Landing pages',
    text: 'Páginas que abrem bem no celular, mostram sua oferta e levam o cliente a chamar no WhatsApp.',
  },
  {
    title: 'Tráfego pago',
    text: 'Anúncios pagos: a gente monta, acompanha e ajusta para o dinheiro render mais.',
  },
] as const

export const contactInfo = {
  // E-mail PÚBLICO: aparece no rodapé e é o destino do mailto.
  email: 'eixodemarca@gmail.com',
  // WhatsApp — formato internacional (55 + DDD + número), sem símbolos.
  phone: '552433662420',
  instagram: 'https://www.instagram.com/eixodemarca/',
  linkedin: '',
  facebook: '',
}

// Caixa que RECEBE o formulário de contato — de propósito separada do e-mail
// público acima. O remetente do envio é o de teste do Resend
// (onboarding@resend.dev, variável RESEND_FROM), que só entrega no e-mail do
// DONO DA CONTA. Apontar pro e-mail público sem antes verificar um domínio no
// Resend (ou sem esse ser o e-mail da conta) faria todo envio falhar com 403 —
// e o visitante veria erro e o lead se perderia. Trocar só depois disso.
export const leadsInbox = 'lipejudice@gmail.com'

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
    description: 'Antes de criar qualquer coisa, conversamos pra conhecer seu negócio, seu cliente e onde ele te encontra.',
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
