import { NextResponse } from 'next/server'
import { contactInfo, services } from '@/lib/data'

/**
 * Recebe o formulário do rodapé e manda por e-mail.
 *
 * Usa a API REST do Resend por `fetch`, sem instalar pacote: é uma chamada só,
 * e o projeto já carrega bastante JS.
 *
 * Precisa de duas variáveis de ambiente no Vercel, ambas do tipo Config
 * (as do tipo Secret não chegam no runtime):
 *   RESEND_API_KEY   chave da conta (resend.com/api-keys)
 *   RESEND_FROM      remetente verificado, ex.: "contato@seudominio.com".
 *                    Sem domínio próprio verificado, "onboarding@resend.dev"
 *                    só entrega pro e-mail dono da conta.
 */

export const runtime = 'nodejs'

type Corpo = {
  nome?: string
  telefone?: string
  cidade?: string
  instagram?: string
  servico?: string
  expectativa?: string
  email?: string
  /** campo isca: humano não preenche, robô preenche */
  site?: string
}

const limpa = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** Aceita "@fulano", "instagram.com/fulano" ou "fulano" e guarda sempre "@fulano". */
function arroba(valor: string) {
  if (!valor) return ''
  const semUrl = valor.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
  const limpo = semUrl.replace(/^@/, '').replace(/\/+$/, '').trim()
  return limpo ? `@${limpo}` : ''
}

const SERVICOS = services.map((s) => s.title as string)

export async function POST(request: Request) {
  let corpo: Corpo
  try {
    corpo = await request.json()
  } catch {
    return NextResponse.json({ erro: 'Requisição inválida.' }, { status: 400 })
  }

  // Isca de spam: se veio preenchido, foi robô. Responde 200 pra ele não
  // tentar de novo, mas não envia nada.
  if (limpa(corpo.site)) {
    return NextResponse.json({ ok: true })
  }

  const nome = limpa(corpo.nome)
  const telefone = limpa(corpo.telefone)
  const cidade = limpa(corpo.cidade)
  const instagram = arroba(limpa(corpo.instagram))
  const servico = limpa(corpo.servico)
  const expectativa = limpa(corpo.expectativa)
  const email = limpa(corpo.email)

  const faltando: string[] = []
  if (!nome) faltando.push('nome')
  if (!telefone) faltando.push('telefone')
  if (!servico) faltando.push('serviço')
  if (!expectativa) faltando.push('o que você espera')
  if (faltando.length) {
    return NextResponse.json({ erro: `Preencha: ${faltando.join(', ')}.` }, { status: 400 })
  }

  // Só aceita serviço da lista real (ou o "ainda não sei"): impede que alguém
  // mande texto arbitrário no assunto do e-mail.
  if (servico !== 'Ainda não sei' && !SERVICOS.includes(servico)) {
    return NextResponse.json({ erro: 'Serviço inválido.' }, { status: 400 })
  }

  // Telefone: só conto os dígitos. Máscara, DDI e pontuação variam demais pra
  // valer uma regex, e rejeitar número válido custa um contato real.
  const digitos = telefone.replace(/\D/g, '')
  if (digitos.length < 10 || digitos.length > 13) {
    return NextResponse.json({ erro: 'Telefone parece incompleto.' }, { status: 400 })
  }

  // E-mail é opcional; só valida se veio preenchido.
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ erro: 'E-mail parece inválido.' }, { status: 400 })
  }

  if (expectativa.length > 5000) {
    return NextResponse.json({ erro: 'Mensagem muito longa.' }, { status: 400 })
  }

  const chave = process.env.RESEND_API_KEY
  const remetente = process.env.RESEND_FROM
  if (!chave || !remetente) {
    // O nome da variável ausente vai só pro log do servidor: numa API pública
    // isso entregaria detalhe da infraestrutura sem necessidade.
    console.error(
      'Contato sem configuração:',
      [!chave && 'RESEND_API_KEY', !remetente && 'RESEND_FROM'].filter(Boolean).join(', ')
    )
    return NextResponse.json(
      { erro: 'Envio por e-mail não configurado. Fale com a gente pelo WhatsApp.' },
      { status: 503 }
    )
  }

  const linhas = [
    `Nome:      ${nome}`,
    `Telefone:  ${telefone}`,
    cidade && `Cidade:    ${cidade}`,
    instagram && `Instagram: ${instagram}`,
    email && `E-mail:    ${email}`,
    `Serviço:   ${servico}`,
    '',
    'O que espera:',
    expectativa,
  ].filter(Boolean)

  const resposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${chave}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: remetente,
      to: [contactInfo.email],
      // Responder no cliente de e-mail vai direto pra pessoa. Só dá pra fazer
      // isso quando ela informou e-mail — se não, o contato é pelo telefone.
      ...(email ? { reply_to: email } : {}),
      // Serviço no assunto: dá pra triar a caixa de entrada sem abrir.
      subject: `Site — ${nome} · ${servico}`,
      text: linhas.join('\n'),
    }),
  })

  if (!resposta.ok) {
    // Loga o motivo real no servidor, mas não devolve pro navegador: a
    // resposta do provedor pode conter detalhe de configuração.
    console.error('Resend falhou:', resposta.status, await resposta.text())
    return NextResponse.json(
      { erro: 'Não consegui enviar agora. Tente pelo WhatsApp.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
