'use client'

import { useId, useRef, useState } from 'react'
import { services } from '@/lib/data'

type Estado = 'parado' | 'enviando' | 'enviado' | 'erro'

/**
 * Formulário de contato do rodapé.
 *
 * Qualifica o lead em vez de só receber um texto solto: com serviço, cidade,
 * telefone e expectativa, dá pra triar e responder já sabendo do que se trata.
 *
 * Obrigatórios só os quatro que decidem o atendimento (nome, telefone, serviço,
 * expectativa). Cidade, Instagram e e-mail ficam opcionais — cada campo
 * obrigatório a mais derruba a taxa de envio, e esses três dá pra perguntar
 * depois na conversa.
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
          telefone: dados.get('telefone'),
          cidade: dados.get('cidade'),
          instagram: dados.get('instagram'),
          servico: dados.get('servico'),
          expectativa: dados.get('expectativa'),
          email: dados.get('email'),
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

  const rotulo = 'mb-1.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-white/50'

  // Layout deitado: 12 colunas no desktop. Linha 1 = quem é você (4 x 3
  // colunas); linha 2 = o que você quer (serviço 3 + expectativa 6 + e-mail 3);
  // linha 3 = enviar. Antes era uma coluna alta de 7 campos ao lado de um texto
  // curto, que deixava metade da largura vazia. Em sm são 2 colunas; no
  // celular, uma só.
  return (
    <form ref={formRef} onSubmit={enviar} className="grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <label htmlFor={`${id}-nome`} className={rotulo}>
          Nome <span className="text-azure-on-dark">*</span>
        </label>
        <input id={`${id}-nome`} name="nome" required autoComplete="name" placeholder="Como te chamo?" className={campo} />
      </div>
      <div className="lg:col-span-3">
        <label htmlFor={`${id}-telefone`} className={rotulo}>
          WhatsApp <span className="text-azure-on-dark">*</span>
        </label>
        <input
          id={`${id}-telefone`}
          name="telefone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(24) 99999-0000"
          className={campo}
        />
      </div>

      <div className="lg:col-span-3">
        <label htmlFor={`${id}-cidade`} className={rotulo}>
          Cidade
        </label>
        <input id={`${id}-cidade`} name="cidade" autoComplete="address-level2" placeholder="Angra dos Reis" className={campo} />
      </div>
      <div className="lg:col-span-3">
        <label htmlFor={`${id}-instagram`} className={rotulo}>
          Instagram
        </label>
        <input id={`${id}-instagram`} name="instagram" placeholder="@suamarca" className={campo} />
      </div>

      <div className="sm:col-span-2 lg:col-span-3">
        <label htmlFor={`${id}-servico`} className={rotulo}>
          O que você procura <span className="text-azure-on-dark">*</span>
        </label>
        {/* A lista sai de lib/data.ts, a mesma que monta a seção de serviços —
            assim serviço novo aparece aqui sozinho, sem duplicar a lista. */}
        <select id={`${id}-servico`} name="servico" required defaultValue="" className={`${campo} appearance-none`}>
          <option value="" disabled>
            Escolha um serviço
          </option>
          {services.map((servico) => (
            <option key={servico.title} value={servico.title} className="bg-ink">
              {servico.title}
            </option>
          ))}
          <option value="Ainda não sei" className="bg-ink">
            Ainda não sei
          </option>
        </select>
      </div>

      <div className="sm:col-span-2 lg:col-span-6">
        <label htmlFor={`${id}-expectativa`} className={rotulo}>
          O que você espera <span className="text-azure-on-dark">*</span>
        </label>
        <textarea
          id={`${id}-expectativa`}
          name="expectativa"
          required
          rows={2}
          placeholder="Conta rapidinho o momento da sua marca e onde quer chegar."
          className={`${campo} resize-y`}
        />
      </div>

      <div className="sm:col-span-2 lg:col-span-3">
        <label htmlFor={`${id}-email`} className={rotulo}>
          E-mail <span className="normal-case tracking-normal text-white/35">(opcional)</span>
        </label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="seu@email.com" className={campo} />
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

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-12">
        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="bg-azure px-6 py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
        </button>

        {/* aria-live: quem usa leitor de tela precisa ouvir o resultado, que
            de outro modo só existe visualmente. */}
        <p aria-live="polite" className="text-[13px]">
          {estado === 'enviado' && <span className="text-azure-on-dark">Recebido. Respondo em breve.</span>}
          {estado === 'erro' && <span className="text-white/70">{erro}</span>}
        </p>
      </div>
    </form>
  )
}
