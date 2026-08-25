import { NextResponse } from 'next/server'
import { contactInfo } from '@/lib/data'

/**
 * Recebe o formulário do rodapé e manda por e-mail.
 *
 * Usa a API REST do Resend por `fetch`, sem instalar pacote: é uma chamada só,
 * e o projeto já carrega bastante JS.
 *
 * Precisa de duas variáveis de ambiente no Vercel:
 *   RESEND_API_KEY   chave da conta (resend.com/api-keys)
 *   RESEND_FROM      remetente verificado, ex.: "Site <contato@seudominio.com>"
 *                    Sem domínio próprio verificado, use "onboarding@resend.dev",
 *                    que só entrega pro e-mail dono da conta.
 *
 * Sem a chave a rota responde 503 com uma mensagem clara, em vez de fingir que
 * enviou — pior que não ter formulário é ter um que engole a mensagem.
 */

export const runtime = 'nodejs'

type Corpo = {
  nome?: string
  email?: string
  mensagem?: string
  /** campo isca: humano não preenche, robô preenche */
  site?: string
}

const limpa = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

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
  const email = limpa(corpo.email)
  const mensagem = limpa(corpo.mensagem)

  const faltando: string[] = []
  if (!nome) faltando.push('nome')
  if (!email) faltando.push('email')
  if (!mensagem) faltando.push('mensagem')
  if (faltando.length) {
    return NextResponse.json({ erro: `Preencha: ${faltando.join(', ')}.` }, { status: 400 })
  }

  // Validação proposital de e-mail bem frouxa: regex apertada rejeita endereço
  // válido de verdade (TLD novo, subdomínio, +tag) e perde contato real.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ erro: 'E-mail parece inválido.' }, { status: 400 })
  }

  if (mensagem.length > 5000) {
    return NextResponse.json({ erro: 'Mensagem muito longa.' }, { status: 400 })
  }

  const chave = process.env.RESEND_API_KEY
  const remetente = process.env.RESEND_FROM
  if (!chave || !remetente) {
    // Diagnóstico: diz QUAL variável falta, pra distinguir "salvou no projeto
    // errado" (faltam as duas) de "errou o nome de uma" (falta só uma).
    // Só booleano — nenhum valor de chave sai daqui.
    return NextResponse.json(
      {
        erro: 'Envio por e-mail não configurado. Fale com a gente pelo WhatsApp.',
        faltando: [!chave && 'RESEND_API_KEY', !remetente && 'RESEND_FROM'].filter(Boolean),
      },
      { status: 503 }
    )
  }

  const resposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${chave}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: remetente,
      to: [contactInfo.email],
      // reply_to: responder no cliente de e-mail vai direto pra pessoa, em vez
      // de pro remetente técnico.
      reply_to: email,
      subject: `Site — ${nome}`,
      text: [`Nome: ${nome}`, `E-mail: ${email}`, '', mensagem].join('\n'),
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
