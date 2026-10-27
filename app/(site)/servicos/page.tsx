import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ManuaisDeMarca, { type Manual } from '@/components/servicos/ManuaisDeMarca'
import VideoTile from '@/components/servicos/VideoTile'
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

// ── seleção dos exemplos (artes e vídeos vêm de lib/portfolio.ts)
const cliente = (slug: string) => {
  const c = artClients.find((x) => x.slug === slug)
  if (!c) throw new Error(`servicos: cliente ${slug} não existe`)
  return c
}
const pecas = (slug: string, idx: number[]) => {
  const c = cliente(slug)
  return idx.map((i) => {
    const p = c.items[i]
    if (!p) throw new Error(`servicos: ${slug} não tem a peça ${i}`)
    return { src: p.src, alt: p.alt, nome: c.name, href: `/portfolio/artes/${c.slug}` }
  })
}

// Social media: clientes que a gente atende hoje, um card por perfil (logo + @ clicável).
// Quem ainda não tem logo no site ganha um card com a cor da marca.
type ClienteIG = { nome: string; handle: string; logo?: string; cor?: string }
const clientesIG: ClienteIG[] = [
  { nome: 'Well Calçados', handle: 'wellcalcados', logo: 'well' },
  { nome: 'Espaço dos Anjos', handle: 'dosanjos.espaco', logo: 'espaco' },
  { nome: 'Atacadão Madeiras', handle: 'atacadaomadeirasangra', logo: 'atacadao' },
  { nome: 'Laura Anjos', handle: 'biomedicalauraanjos', logo: 'laura' },
  { nome: 'Eixo de Marca', handle: 'eixodemarca', logo: 'eixo' },
  { nome: 'Health CoWorking', handle: 'healthco.working', logo: 'health' },
  { nome: 'ARMC', handle: 'armc.marina', logo: 'armc' },
  { nome: 'Clínica Cães e Gatos', handle: 'caesgatosveterinaria', logo: 'caes' },
  { nome: 'GST Veículos Elétricos', handle: 'gstveiculoseletricos', logo: 'gst' },
  { nome: 'Salobra', handle: 'sa.lo.bra', cor: '#12936f' },
]

// Design: a melhor arte de cada cliente (escolhidas a dedo), para mostrar a variedade
const exDesign = [
  ...pecas('uk-imports', [2]),
  ...pecas('di-casa-acai', [3]),
  ...pecas('reset', [4]),
  ...pecas('pousada-da-praia', [0]),
  ...pecas('eixo-de-marca', [3]),
  ...pecas('laura-anjos', [1]),
  ...pecas('ecoutil', [0]),
  ...pecas('well-calcados', [9]),
  ...pecas('espaco-dos-anjos', [2]),
  ...pecas('atacadao-madeiras', [8]),
  ...pecas('health-coworking', [1]),
  ...pecas('lobo-tech', [6]),
]
const exAnuncios = pecas('health-coworking', [0, 1, 2, 3])

const video = (nome: string) => {
  const v = portfolioVideos.find((x) => x.src.endsWith(`/${nome}.mp4`))
  if (!v) throw new Error(`servicos: vídeo ${nome} não existe`)
  return { src: v.src, poster: v.poster, titulo: v.title, legenda: v.tag.split('· ').pop() ?? v.tag }
}
// Edição: um vídeo de cada cliente
const exEdicao = [
  'video-well-branco-azul',
  'video-sushi-algoritmo',
  'video-eixo-concorrente',
  'video-boulevard-feliz-no-simples',
  'video-espaco-sessao-massagem',
  'video-laura-pele-nao-melhora',
  'video-tudo-acaba-em-pizza-720',
  'video-atacadao-qual-madeira',
  'video-lobo-vampiro',
  'video-pousada-01',
].map(video)
// Captação: um de cada cliente em que a gente grava (Eixo, Laura, Espaço dos Anjos, Atacadão, Chef Luciane)
const exCaptacao = [
  'video-eixo-tenho-que-aparecer',
  'video-laura-so-percebeu-depois',
  'video-espaco-recuperacao',
  'video-atacadao-estoque-obra',
  'video-chef-workshops',
].map(video)

const D = '/portfolio-media/videos/device/'
const P = '/portfolio-media/videos/'
const exLanding = [
  { src: `${D}video-landing-manoa-rapido.mp4`, poster: `${P}poster-landing-manoa-rapido.webp`, titulo: 'Landing page da Manoa no celular', legenda: 'Manoa' },
  { src: `${D}video-landing-espaco-mobile.mp4`, poster: `${P}poster-landing-espaco-mobile.webp`, titulo: 'Landing page do Espaço dos Anjos no celular', legenda: 'Espaço dos Anjos' },
  { src: `${D}video-landing-well-mobile.mp4`, poster: `${P}poster-landing-well-mobile.webp`, titulo: 'Landing page da Well Calçados no celular', legenda: 'Well Calçados' },
]

// Manuais de marca (páginas geradas dos PDFs entregues aos clientes)
const M = '/portfolio-media/manuais/manual-'
const pg = (nome: string, n: number, w: number, h: number) => ({ src: `${M}${nome}-${n}.webp`, w, h })
const manuais: Manual[] = [
  { id: 'jo', nome: 'JO Salão de Beleza', nota: 'versões, cores, tipografia e aplicações', paginas: [1, 2, 3, 4, 5].map((n) => pg('jo', n, 1280, 720)) },
  { id: 'forno', nome: 'Forno da Vila', nota: 'base da marca, fachada, embalagens e uniforme', paginas: [1, 2, 3, 4, 5, 6, 7].map((n) => pg('forno', n, 1280, 720)) },
  { id: 'laura', nome: 'Laura Anjos', nota: 'versões da logo, paleta e aplicações', paginas: [pg('laura', 1, 832, 1491), pg('laura', 2, 832, 1044), pg('laura', 3, 832, 1451), pg('laura', 4, 832, 1084)] },
  {
    id: 'vista',
    nome: 'Vista Bajeko',
    nota: 'conceito, cores e aplicações',
    paginas: [pg('vista', 1, 832, 1491), pg('vista', 2, 832, 1534), pg('vista', 3, 832, 1065), pg('vista', 4, 832, 1534), pg('vista', 5, 832, 1492)],
  },
  { id: 'angra', nome: 'Angra GG', nota: 'sistema visual, cores, tipografia e usos', paginas: [1, 2, 3, 4, 5, 6].map((n) => pg('angra', n, 1280, 800)) },
  { id: 'espaco', nome: 'Espaço dos Anjos', nota: 'versões da logo e paleta', paginas: [pg('espaco', 1, 1600, 622), pg('espaco', 2, 1280, 720)] },
]

// Marcas que a gente criou (identidade visual). Todas em quadrados do mesmo tamanho.
const marcas = [
  ...identities.map((i) => ({ slug: i.slug, nome: i.name, href: `/identidade-visual/${i.slug}` as string | undefined })),
  { slug: 'forno-da-vila', nome: 'Forno da Vila', href: undefined },
]

const resultados = [
  {
    cliente: 'Atacadão Madeiras',
    periodo: 'Anúncio de mensagens no WhatsApp · 7 dias (19 a 25/10/2026)',
    numeros: [
      { valor: '18', rotulo: 'conversas no WhatsApp' },
      { valor: 'R$ 3,86', rotulo: 'por conversa, 40% menos que na campanha anterior' },
      { valor: '4.163', rotulo: 'pessoas alcançadas' },
      { valor: 'R$ 69,49', rotulo: 'investidos no total' },
    ],
    nota: 'Dados da conta de anúncios, relatório da segunda campanha.',
  },
  {
    cliente: 'Well Calçados',
    periodo: 'Anúncio de engajamento · 1 mês',
    numeros: [
      { valor: '4.123', rotulo: 'engajamentos' },
      { valor: 'R$ 0,03', rotulo: 'por engajamento' },
      { valor: '9.324', rotulo: 'pessoas alcançadas' },
      { valor: 'R$ 115,18', rotulo: 'investidos no total' },
    ],
    nota: 'Dados da conta de anúncios do cliente.',
  },
]

type Secao = {
  centrada?: boolean
  id: string
  titulo: string
  texto: string
  inclui: string[]
  visual: ReactNode
}

const Rotulo = ({ children }: { children: ReactNode }) => <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">{children}</span>

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

const GradeVideos = ({ itens, cols = 'grid-cols-2 sm:grid-cols-4', verTodos = true }: { itens: { src: string; poster: string; titulo: string; legenda: string }[]; cols?: string; verTodos?: boolean }) => (
  <>
    <ul className={`grid gap-3 ${cols}`}>
      {itens.map((v) => (
        <li key={v.src}>
          <VideoTile {...v} />
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
        <Rotulo>Clientes que atendemos hoje · toque para ver o perfil</Rotulo>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {clientesIG.map((c) => (
            <li key={c.handle}>
              <a href={`https://www.instagram.com/${c.handle}/`} target="_blank" rel="noopener noreferrer" className="group block">
                <div
                  className="relative aspect-square overflow-hidden rounded-lg border border-ink/10 transition-transform duration-300 group-hover:-translate-y-0.5"
                  style={{ backgroundColor: c.cor ?? '#fff' }}
                >
                  {c.logo ? (
                    <Image src={`/portfolio-media/cliente-${c.logo}.webp`} alt={`Logo da ${c.nome}`} fill sizes="(min-width: 1024px) 18vw, 44vw" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center px-3 text-center font-display text-[clamp(18px,2vw,26px)] font-black uppercase leading-tight text-white">{c.nome}</span>
                  )}
                </div>
                <span className="mt-1.5 block text-[13px] font-semibold leading-tight text-ink">{c.nome}</span>
                <span className="flex gap-1 text-[12px] text-ink/55"><span className="min-w-0 truncate">@{c.handle}</span><span aria-hidden className="shrink-0">→</span></span>
              </a>
            </li>
          ))}
        </ul>
        <Link href="/portfolio/artes" className="mt-4 inline-block text-[13px] font-semibold underline underline-offset-4">
          Ver as artes de todos os clientes →
        </Link>
      </>
    ),
  },
  {
    id: 'design',
    titulo: 'Design',
    texto:
      'Artes para o perfil, para anúncios e para os materiais da marca. Cada peça segue a identidade do cliente, para o perfil ficar com cara de marca e não de colagem. Aqui vai uma arte de 12 clientes diferentes, de vários ramos.',
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
      'Criamos a marca do zero ou organizamos a que você já tem: logo, cores, fontes e o jeito de aplicar tudo isso, para a sua empresa ter sempre a mesma cara, no perfil, no material impresso e na loja. No final entregamos um manual de marca, como estes.',
    inclui: ['Logo e variações de uso', 'Paleta de cores', 'Fontes', 'Manual da marca', 'Aplicações da marca: fachada, embalagem, uniforme e redes'],
    visual: (
      <div className="flex flex-col gap-8">
        <ManuaisDeMarca manuais={manuais} />
        <div>
          <Rotulo>Marcas que criamos</Rotulo>
          <ul className="flex flex-wrap justify-center gap-3">
            {marcas.map((m) => {
              const card = (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image src={`/portfolio-media/ident-${m.slug}.webp`} alt={`Identidade visual ${m.nome}`} fill sizes="(min-width: 1024px) 14vw, 30vw" className="object-cover" />
                  </div>
                  <span className="mt-1.5 block text-center text-[12px] leading-snug text-ink/60">{m.nome}</span>
                </>
              )
              return (
                <li key={m.slug} className="w-[calc((100%-24px)/3)] sm:w-[calc((100%-36px)/4)] lg:w-[calc((100%-60px)/6)]">
                  {m.href ? <Link href={m.href} className="block">{card}</Link> : card}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
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
    visual: <GradeVideos itens={exEdicao} cols="grid-cols-2 sm:grid-cols-5" />,
  },
  {
    id: 'captacao-de-video',
    titulo: 'Captação de vídeo',
    texto:
      'A gente vai até o seu negócio e grava produto, ambiente, equipe e atendimento, seguindo um roteiro feito antes. Uma captação bem planejada rende material para várias semanas de conteúdo e já sai pensada para a edição. Estes vídeos saíram de captações que fizemos para a Eixo, Laura Anjos, Espaço dos Anjos, Atacadão Madeiras e Chef Luciane Júdice.',
    inclui: [
      'Roteiro de captação antes de gravar',
      'Gravação no local: produto, espaço, equipe e atendimento',
      'Fotos e vídeos para o perfil e para anúncios',
      'Material organizado e entregue para a edição',
    ],
    visual: <GradeVideos itens={exCaptacao} cols="grid-cols-2 sm:grid-cols-5" verTodos={false} />,
  },
  {
    centrada: true,
    id: 'gestao-de-conteudo',
    titulo: 'Gestão de conteúdo',
    texto:
      'Cuidamos do calendário do perfil: o que será postado, em que dia, a aprovação com você e a publicação. O perfil anda em dia sem você precisar lembrar de nada, e você sempre sabe o que vem pela frente. Cada marca no calendário é um cliente, cada bolinha é um post publicado.',
    inclui: [
      'Calendário mensal de posts',
      'Aprovação das artes e legendas com o cliente',
      'Publicação nos dias combinados',
      'Organização de prazos e materiais',
    ],
    visual: (
      <ul className="mx-auto grid max-w-[760px] gap-6 sm:grid-cols-2 sm:gap-8">
        {[
          { mes: 'Setembro', posts: 81, perfis: 8, src: `${D}video-gestao-setembro.mp4`, poster: `${P}poster-gestao-setembro.webp` },
          { mes: 'Outubro', posts: 72, perfis: 9, src: `${D}video-gestao-outubro-3.mp4`, poster: `${P}poster-gestao-outubro-3.webp` },
        ].map((m) => (
          <li key={m.mes} className="rounded-2xl border border-ink/10 bg-white p-4 text-center sm:p-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">{m.mes}</span>
            <p className="mt-1 font-display text-[clamp(30px,4vw,44px)] font-black leading-none">{m.posts} posts</p>
            <p className="mb-4 mt-1 text-[13px] text-ink/60">publicados em {m.perfis} perfis de clientes</p>
            <div className="mx-auto max-w-[260px]">
              <VideoTile src={m.src} poster={m.poster} titulo={`Calendário de ${m.mes.toLowerCase()} com os posts publicados`} />
            </div>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'landing-pages',
    titulo: 'Landing pages',
    texto:
      'Uma página só, feita para uma oferta: abre rápido no celular e no computador, explica o que você faz, mostra provas e leva a pessoa a chamar no WhatsApp ou preencher um formulário. É o destino certo para o seu anúncio.',
    inclui: [
      'Texto e estrutura pensados para converter',
      'Layout para celular e para computador',
      'Botão de WhatsApp e formulário de contato',
      'Fotos, vídeos e depoimentos do cliente',
      'Carregamento rápido',
    ],
    visual: (
      <div className="flex flex-col gap-6">
        <figure>
          <Rotulo>No computador</Rotulo>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-ink/10 bg-ink/5">
            <Image src="/portfolio-media/landing-espaco-desktop.webp" alt="Landing page do Espaço dos Anjos aberta no computador" fill sizes="(min-width: 1024px) 640px, 92vw" className="object-cover object-top" />
          </div>
          <figcaption className="mt-1.5 text-[12px] text-ink/55">Espaço dos Anjos</figcaption>
        </figure>
        <div>
          <Rotulo>No celular</Rotulo>
          <GradeVideos itens={exLanding} cols="grid-cols-3" verTodos={false} />
        </div>
      </div>
    ),
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
      <div className="flex flex-col gap-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {resultados.map((r) => (
            <div key={r.cliente} className="rounded-2xl border border-ink/10 bg-white p-5">
              <Rotulo>Resultado real</Rotulo>
              <h3 className="font-display text-[20px] font-black uppercase leading-tight">{r.cliente}</h3>
              <p className="mt-1 text-[13px] text-ink/55">{r.periodo}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {r.numeros.map((n, i) => (
                  <div key={n.rotulo} className={`rounded-xl p-3 ${i === 0 ? 'bg-ink text-white' : 'bg-ink/[0.05]'}`}>
                    <dd className={`font-display font-black leading-none text-[clamp(22px,2.4vw,30px)]`}>{n.valor}</dd>
                    <dt className={`mt-1 text-[12px] leading-snug ${i === 0 ? 'text-white/70' : 'text-ink/60'}`}>{n.rotulo}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[12px] leading-snug text-ink/50">{r.nota}</p>
            </div>
          ))}
        </div>

        <div>
          <Rotulo>Anúncios que criamos · Health CoWorking</Rotulo>
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
              {s.centrada ? (
                <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
                  <h2 className="font-display text-[clamp(22px,2.6vw,34px)] font-black uppercase leading-tight">{s.titulo}</h2>
                  <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-ink/70">{s.texto}</p>
                  <ul className="mt-6 flex flex-wrap justify-center gap-2">
                    {s.inclui.map((t) => (
                      <li key={t} className="rounded-full border border-ink/15 px-4 py-2 text-[13px] leading-snug text-ink/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 w-full">{s.visual}</div>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
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
              )}
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
