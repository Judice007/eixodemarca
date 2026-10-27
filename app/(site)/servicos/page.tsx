import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { contactInfo, whatsappUrl } from '@/lib/data'
import { artClients, identities, portfolioVideos } from '@/lib/portfolio'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = {
  ...pageMeta({
    title: 'Serviços',
    description: 'Tudo o que o Eixo de Marca faz: social media, design, identidade visual, edição e captação de vídeo, gestão de conteúdo, landing pages e tráfego pago.',
    path: '/servicos',
  }),
  // página para mandar a quem precisa de um serviço específico, não para a busca
  robots: { index: false, follow: true },
}

// ── seleção dos exemplos (tudo vem de lib/portfolio.ts, nada é copiado)
const cliente = (slug: string) => {
  const c = artClients.find((x) => x.slug === slug)
  if (!c) throw new Error(`servicos: cliente ${slug} não existe`)
  return c
}
const pecas = (slug: string, idx: number[]) => {
  const c = cliente(slug)
  return idx.map((i) => ({ src: c.items[i]!.src, alt: c.items[i]!.alt, nome: c.name, href: `/portfolio/artes/${c.slug}` }))
}

const exSocial = [
  ...pecas('di-casa-acai', [0]),
  ...pecas('reset', [0]),
  ...pecas('pousada-da-praia', [0]),
  ...pecas('itamang', [0]),
  ...pecas('laura-anjos', [0]),
  ...pecas('ecoutil', [0]),
  ...pecas('espaco-dos-anjos', [0]),
  ...pecas('atacadao-madeiras', [0]),
]
const exDesign = [
  ...pecas('uk-imports', [0, 1, 2]),
  ...pecas('eixo-de-marca', [0, 1]),
  ...pecas('lobo-tech', [3, 6, 7]),
  ...pecas('well-calcados', [7, 8, 9]),
  ...pecas('atacadao-madeiras', [5, 7]),
  ...pecas('health-coworking', [4]),
]
const exAnuncios = pecas('health-coworking', [0, 1, 2, 3])

const video = (nome: string) => {
  const v = portfolioVideos.find((x) => x.src.endsWith(`/${nome}.mp4`))
  if (!v) throw new Error(`servicos: vídeo ${nome} não existe`)
  return { poster: v.poster, titulo: v.title, tag: v.tag }
}
const exEdicao = [
  'video-well-branco-azul',
  'video-sushi-algoritmo',
  'video-eixo-concorrente',
  'video-boulevard-feliz-no-simples',
  'video-espaco-sessao-massagem',
  'video-laura-pele-nao-melhora',
  'video-lobo-vampiro',
  'video-tudo-acaba-em-pizza-720',
].map(video)
const exCaptacao = ['video-atacadao-estoque-obra', 'video-atacadao-qual-madeira', 'video-atacadao-orcamento'].map(video)

const exLanding = [
  { poster: '/portfolio-media/videos/poster-landing-manoa-rapido.webp', titulo: 'Manoa', tag: 'Manoa' },
  { poster: '/portfolio-media/videos/poster-landing-espaco-mobile.webp', titulo: 'Espaço dos Anjos', tag: 'Espaço dos Anjos' },
  { poster: '/portfolio-media/videos/poster-landing-well-mobile.webp', titulo: 'Well Calçados', tag: 'Well Calçados' },
]

type Secao = {
  id: string
  titulo: string
  texto: string
  inclui: string[]
  visual: ReactNode
}

const Thumb = ({ src, alt, ratio = 'aspect-[4/5]', sizes = '(min-width: 1024px) 18vw, 44vw' }: { src: string; alt: string; ratio?: string; sizes?: string }) => (
  <div className={`relative ${ratio} overflow-hidden rounded-lg bg-ink/5`}>
    <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
  </div>
)

const GradeArtes = ({ itens, cols = 'grid-cols-2 sm:grid-cols-4' }: { itens: { src: string; alt: string; nome: string; href: string }[]; cols?: string }) => (
  <ul className={`grid gap-3 ${cols}`}>
    {itens.map((p) => (
      <li key={p.src}>
        <Link href={p.href} className="group block">
          <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
            <Thumb src={p.src} alt={p.alt} />
          </div>
          <span className="mt-1.5 block text-[12px] text-ink/55">{p.nome}</span>
        </Link>
      </li>
    ))}
  </ul>
)

const GradeVideos = ({ itens, cols = 'grid-cols-2 sm:grid-cols-4', verTodos = true }: { itens: { poster: string; titulo: string; tag: string }[]; cols?: string; verTodos?: boolean }) => (
  <>
    <ul className={`grid gap-3 ${cols}`}>
      {itens.map((v) => (
        <li key={v.poster}>
          <Link href="/portfolio/video" className="group block">
            <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
              <Thumb src={v.poster} alt={v.titulo} ratio="aspect-[9/16]" />
            </div>
            <span className="mt-1.5 block text-[12px] leading-snug text-ink/55">{v.tag.split('· ').pop()}</span>
          </Link>
        </li>
      ))}
    </ul>
    {verTodos && (
      <Link href="/portfolio/video" className="mt-4 inline-block text-[13px] font-semibold underline underline-offset-4">
        Ver todos os vídeos →
      </Link>
    )}
  </>
)

const secoes: Secao[] = [
  {
    id: 'social-media',
    titulo: 'Social media',
    texto:
      'Cuidamos do seu Instagram do planejamento ao post publicado. A gente entende o seu negócio, define o que vale a pena falar e transforma isso em posts, carrosséis e stories que mostram o que você vende e levam o cliente a te chamar.',
    inclui: [
      'Planejamento mensal: o que postar e por quê',
      'Criação dos posts, carrosséis, capas e stories',
      'Legendas escritas para o seu público',
      'Calendário aprovado com você antes de publicar',
      'Ajustes de acordo com o que o perfil responde',
    ],
    visual: (
      <>
        <GradeArtes itens={exSocial} />
        <Link href="/portfolio/artes" className="mt-4 inline-block text-[13px] font-semibold underline underline-offset-4">
          Ver todos os clientes →
        </Link>
      </>
    ),
  },
  {
    id: 'design',
    titulo: 'Design',
    texto:
      'Artes para o perfil, para anúncios e para os materiais da marca. Cada peça segue a identidade do cliente, para o perfil ficar com cara de marca e não de colagem. Aqui vai uma amostra do que já fizemos para clientes de vários ramos.',
    inclui: [
      'Posts de feed e carrosséis',
      'Artes de campanha, promoção e lançamento',
      'Artes para anúncios pagos',
      'Capas de destaque e stories',
      'Tudo seguindo as cores e fontes da marca',
    ],
    visual: <GradeArtes itens={exDesign} />,
  },
  {
    id: 'identidade-visual',
    titulo: 'Identidade visual',
    texto:
      'Criamos a marca do zero ou organizamos a que você já tem: logo, cores, fontes e o jeito de aplicar tudo isso, para a sua empresa ter sempre a mesma cara, no perfil, no material impresso e na loja.',
    inclui: ['Logo e variações de uso', 'Paleta de cores', 'Fontes', 'Manual da marca', 'Aplicações da marca nas redes'],
    visual: (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {identities.map((i) => (
          <li key={i.slug}>
            <Link href={`/identidade-visual/${i.slug}`} className="group block">
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-lg transition-transform duration-300 group-hover:-translate-y-0.5"
                style={{ backgroundColor: i.accent }}
              >
                <Image src={i.src} alt={i.alt} fill sizes="(min-width: 1024px) 14vw, 44vw" className="object-contain p-3" />
              </div>
              <span className="mt-1.5 block text-[12px] text-ink/55">{i.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'edicao-de-video',
    titulo: 'Edição de vídeo',
    texto:
      'Você grava (ou a gente grava) e a gente edita: cortes no ritmo certo, texto na tela, transições e ajuste de cor e áudio, prontos para Reels, Stories e anúncios. O vídeo fica mais fácil de assistir até o fim e de entender o que você oferece.',
    inclui: [
      'Cortes e ritmo para prender a atenção',
      'Legendas e textos na tela',
      'Transições, efeitos e ajuste de cor e áudio',
      'Capa do vídeo',
      'Formato certo para Reels, Stories e anúncios',
    ],
    visual: <GradeVideos itens={exEdicao} />,
  },
  {
    id: 'captacao-de-video',
    titulo: 'Captação de vídeo',
    texto:
      'A gente vai até o seu negócio e grava produto, ambiente, equipe e atendimento, seguindo um roteiro feito antes. Uma captação bem planejada rende material para várias semanas de conteúdo e já sai pensada para a edição.',
    inclui: [
      'Roteiro de captação antes de gravar',
      'Gravação no local: produto, espaço, equipe e atendimento',
      'Fotos e vídeos para o perfil e para anúncios',
      'Material organizado e entregue para a edição',
    ],
    visual: <GradeVideos itens={exCaptacao} cols="grid-cols-3" verTodos={false} />,
  },
  {
    id: 'gestao-de-conteudo',
    titulo: 'Gestão de conteúdo',
    texto:
      'Cuidamos do calendário do perfil: o que será postado, em que dia, a aprovação com você e a publicação. O perfil anda em dia sem você precisar lembrar de nada, e você sempre sabe o que vem pela frente.',
    inclui: [
      'Calendário mensal de posts',
      'Aprovação das artes e legendas com o cliente',
      'Publicação nos dias combinados',
      'Organização de prazos e materiais',
    ],
    visual: (
      <div className="grid items-center gap-5 sm:grid-cols-[220px_1fr]">
        <Thumb src="/portfolio-media/videos/poster-gestao-outubro-3.webp" alt="Calendário de outubro com os posts publicados de vários clientes" ratio="aspect-[9/16]" sizes="220px" />
        <p className="text-[15px] leading-relaxed text-ink/70">
          <strong className="font-display text-[clamp(28px,4vw,44px)] font-black leading-none text-ink">72 posts</strong>
          <span className="mt-2 block">publicados em outubro, em 9 perfis de clientes, cada um no seu dia combinado.</span>
        </p>
      </div>
    ),
  },
  {
    id: 'landing-pages',
    titulo: 'Landing pages',
    texto:
      'Uma página só, feita para uma oferta: abre rápido no celular, explica o que você faz, mostra provas e leva a pessoa a chamar no WhatsApp ou preencher um formulário. É o destino certo para o seu anúncio.',
    inclui: [
      'Texto e estrutura pensados para converter',
      'Layout pensado primeiro para o celular',
      'Botão de WhatsApp e formulário de contato',
      'Fotos, vídeos e depoimentos do cliente',
      'Carregamento rápido',
    ],
    visual: <GradeVideos itens={exLanding} cols="grid-cols-3" verTodos={false} />,
  },
  {
    id: 'trafego-pago',
    titulo: 'Tráfego pago',
    texto:
      'Anúncios no Instagram e no Facebook: a gente monta a campanha, escolhe o público, cria as artes, acompanha os números e ajusta para o dinheiro render mais. No final você recebe um relatório com o que aconteceu.',
    inclui: [
      'Campanhas de engajamento, mensagens e visitas',
      'Públicos por região e interesse',
      'Artes e vídeos dos anúncios',
      'Acompanhamento e ajustes durante a campanha',
      'Relatório com os resultados',
    ],
    visual: (
      <div className="flex flex-col gap-6">
        <div className="grid items-center gap-5 sm:grid-cols-[220px_1fr]">
          <Thumb src="/portfolio-media/videos/poster-trafego-painel-well.webp" alt="Resultados dos anúncios da Well Calçados em 1 mês" ratio="aspect-[9/16]" sizes="220px" />
          <div className="text-[15px] leading-relaxed text-ink/70">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Resultado real · Well Calçados</span>
            <p className="mt-2">
              Em 1 mês: <strong className="text-ink">4.123 engajamentos a R$ 0,03 cada</strong>, <strong className="text-ink">9.324 pessoas alcançadas</strong> com R$ 115,18 investidos.
            </p>
            <p className="mt-2 text-[13px] text-ink/50">Dados da conta de anúncios do cliente.</p>
          </div>
        </div>
        <div>
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Anúncios que criamos · Health CoWorking</span>
          <GradeArtes itens={exAnuncios} />
        </div>
      </div>
    ),
  },
]

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-[#fffdfa] text-ink">
      <SiteHeader />

      <section className="bg-ink px-[var(--gutter)] pb-[clamp(50px,7vw,100px)] pt-[clamp(130px,18vh,190px)] text-white">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
            <span className="h-px w-10 bg-white/20" />
            Serviços
          </div>
          <h1 className="mt-6 max-w-[900px] [text-wrap:balance] font-display text-[clamp(24px,3.8vw,55px)] font-black uppercase leading-[1.08] [word-spacing:0.1em]">
            Precisou de um serviço? <span className="text-azure">A gente faz.</span>
          </h1>
          <p className="mt-6 max-w-[600px] text-[15px] leading-relaxed text-white/60">
            Veja o que cada serviço inclui e exemplos reais de trabalhos que já entregamos. Cada especialista cuida da sua área.
          </p>
          <nav aria-label="Serviços" className="mt-8 flex flex-wrap gap-2">
            {secoes.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-[13px] font-semibold text-white/85 transition-colors hover:bg-white/10">
                {s.titulo}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="px-[var(--gutter)]">
        <div className="mx-auto max-w-[1100px]">
          {secoes.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 border-b border-ink/10 py-[clamp(40px,6vw,80px)] last:border-b-0">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-14">
                <div>
                  <h2 className="font-display text-[clamp(22px,2.6vw,34px)] font-black uppercase leading-tight">{s.titulo}</h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{s.texto}</p>
                  <ul className="mt-5 flex flex-col gap-2 text-[14px] leading-snug text-ink/80">
                    {s.inclui.map((t) => (
                      <li key={t} className="flex gap-2.5">
                        <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-w-0">{s.visual}</div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="bg-ink px-[var(--gutter)] py-[clamp(50px,7vw,90px)] text-white">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-[clamp(20px,2.6vw,32px)] font-black uppercase leading-tight">Quer conversar sobre algum serviço?</h2>
            <p className="mt-2 text-[14px] text-white/60">Conte o que você precisa e a gente indica o especialista.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-white px-6 text-[14px] font-semibold text-ink">
              WhatsApp
            </a>
            <a href={`mailto:${contactInfo.email}`} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-6 text-[14px] font-semibold text-white">
              E-mail
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
