'use client'

import { useId, useRef, useState } from 'react'

type Estado = 'parado' | 'enviando' | 'enviado' | 'erro'

/**
 * Formulário de contato do rodapé.
 *
 * Existe porque todo caminho de conversão do site levava ao WhatsApp, e isso
 * filtra quem está pesquisando frio, quem é de empresa ou quem está fora do
 * horário. O WhatsApp continua ali ao lado, pra quem prefere.
 */
export default function ContactForm() {
  const id = useId()
  const [estado, setEstado] = useState<Estado>('parado')
  const [erro, setErro] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (estado === 'enviando') return

    const dados = new FormData(evento.currentTarget)
    setEstado('enviando')
    setErro('')

    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: dados.get('nome'),
          email: dados.get('email'),
          mensagem: dados.get('mensagem'),
          site: dados.get('site'),
        }),
      })
      const json = await resposta.json().catch(() => ({}))

      if (!resposta.ok) {
        setErro(json.erro || 'Não consegui enviar agora.')
        setEstado('erro')
        return
      }

      formRef.current?.reset()
      setEstado('enviado')
    } catch {
      setErro('Sem conexão com o servidor.')
      setEstado('erro')
    }
  }

  const campo =
    'w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder:text-white/40 transition-colors focus:border-azure focus:outline-none'

  return (
    <form ref={formRef} onSubmit={enviar} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nome`} className="sr-only">
            Seu nome
          </label>
          <input id={`${id}-nome`} name="nome" required autoComplete="name" placeholder="Seu nome" className={campo} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="sr-only">
            Seu e-mail
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Seu e-mail"
            className={campo}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-mensagem`} className="sr-only">
          O que você precisa
        </label>
        <textarea
          id={`${id}-mensagem`}
          name="mensagem"
          required
          rows={3}
          placeholder="O que você precisa?"
          className={`${campo} resize-y`}
        />
      </div>

      {/* Isca de spam: fora da tela e escondida de leitores de tela, então só
          robô que preenche tudo cai nela. */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="bg-azure px-6 py-3.5 text-[13px] font-bold text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviar mensagem'}
        </button>

        {/* aria-live: quem usa leitor de tela precisa ouvir o resultado, que
            de outro modo só existe visualmente. */}
        <p aria-live="polite" className="text-[13px]">
          {estado === 'enviado' && <span className="text-azure">Recebido. Respondo em breve.</span>}
          {estado === 'erro' && <span className="text-white/70">{erro}</span>}
        </p>
      </div>
    </form>
  )
}
