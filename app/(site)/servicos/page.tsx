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

// Social media: só clientes que a gente atende hoje
const exSocial = [
  ...pecas('well-calcados', [0, 1]),
  ...pecas('espaco-dos-anjos', [0, 1]),
  ...pecas('atacadao-madeiras', [0, 3]),
  ...pecas('eixo-de-marca', [2, 3]),
  ...pecas('laura-anjos', [0, 1]),
]
// Design: uma arte de cada cliente, para mostrar a variedade
const exDesign = [
  ...pecas('uk-imports', [0]),
  ...pecas('di-casa-acai', [1]),
  ...pecas('reset', [1]),
  ...pecas('pousada-da-praia', [1]),
  ...pecas('itamang', [1]),
  ...pecas('ecoutil', [1]),
  ...pecas('laura-anjos', [3]),
  ...pecas('well-calcados', [8]),
  ...pecas('espaco-dos-anjos', [3]),
  ...pecas('atacadao-madeiras', [5]),
  ...pecas('health-coworking', [4]),
  ...pecas('lobo-tech', [3]),
]
const exAnuncios = pecas('health-coworking', [0, 1, 2, 3])

const video = (nome: string) => {
  const v = portfolioVideos.find((x) => x.src.endsWith(`/${nome}.mp4`))
  if (!v) throw new Error(`servicos: vídeo ${nome} não existe`)
  return { src: v.src, poster: v.poster, titulo: v.title, legenda: v.tag.split('· ').pop() ?? v.tag }
}
const exEdicao = [
  'video-well-branco-azul',
  'video-sushi-algoritmo',
  'video-eixo-concorrente',
  'video-boulevard-feliz-no-simples',
  'video-well-nike-3-cores',
  'video-lobo-vampiro',
  'video-pousada-01',
  'video-atacadao-qual-madeira',
].map(video)
// Captação: clientes com captação feita por nós (Atacadão, Chef Luciane, Espaço dos Anjos, Laura, Eixo)
const exCaptacao = [
  'video-atacadao-estoque-obra',
  'video-tudo-acaba-em-pizza-720',
  'video-chef-workshops',
  'video-espaco-sessao-massagem',
  'video-espaco-recuperacao',
  'video-laura-pele-nao-melhora',
  'video-laura-so-percebeu-depois',
  'video-eixo-tenho-que-aparecer',
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

// Todas as marcas que já criamos (as 10 do site + GST e Atacadão)
const marcas = [
  ...identities.map((i) => ({ slug: i.slug, nome: i.name, src: i.src, alt: i.alt, accent: i.accent, href: `/identidade-visual/${i.slug}` })),
  { slug: 'gst', nome: 'GST Veículos Elétricos', src: '/portfolio-media/marca-gst.webp', alt: 'Logo da GST Veículos Elétricos', accent: '#ffffff', href: undefined },
  { slug: 'atacadao-madeiras', nome: 'Atacadão Madeiras', src: '/portfolio-media/marca-atacadao-madeiras.webp', alt: 'Logo do Atacadão Madeiras', accent: '#000000', href: undefined },
]

type Secao = {
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
        <Rotulo>Clientes que atendemos hoje</Rotulo>
        <GradeArtes itens={exSocial} cols="grid-cols-2 sm:grid-cols-5" />
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
          <Rotulo>Marcas que já criamos</Rotulo>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {marcas.map((m) => {
              const card = (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-lg" style={{ backgroundColor: m.accent }}>
                    <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 12vw, 30vw" className="object-contain p-2" />
                  </div>
                  <span className="mt-1.5 block text-[12px] leading-snug text-ink/55">{m.nome}</span>
                </>
              )
              return <li key={m.slug}>{m.href ? <Link href={m.href} className="block">{card}</Link> : card}</li>
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
    visual: <GradeVideos itens={exEdicao} />,
  },
  {
    id: 'captacao-de-video',
    titulo: 'Captação de vídeo',
    texto:
      'A gente vai até o seu negócio e grava produto, ambiente, equipe e atendimento, seguindo um roteiro feito antes. Uma captação bem planejada rende material para várias semanas de conteúdo e já sai pensada para a edição. Estes vídeos saíram de captações que fizemos para restaurante, clínica, madeireira e para a própria Eixo.',
    inclui: [
      'Roteiro de captação antes de gravar',
      'Gravação no local: produto, espaço, equipe e atendimento',
      'Fotos e vídeos para o perfil e para anúncios',
      'Material organizado e entregue para a edição',
    ],
    visual: <GradeVideos itens={exCaptacao} verTodos={false} />,
  },
  {
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
      <ul className="grid max-w-[560px] grid-cols-2 gap-4">
        <li>
          <VideoTile src={`${D}video-gestao-setembro.mp4`} poster={`${P}poster-gestao-setembro.webp`} titulo="Calendário de setembro com os posts publicados" legenda="Setembro: 81 posts publicados em 8 perfis" />
        </li>
        <li>
          <VideoTile src={`${D}video-gestao-outubro-3.mp4`} poster={`${P}poster-gestao-outubro-3.webp`} titulo="Calendário de outubro com os posts publicados" legenda="Outubro: 72 posts publicados em 9 perfis" />
        </li>
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
        <div className="grid items-start gap-5 sm:grid-cols-[200px_1fr]">
          <Thumb src="/portfolio-media/videos/poster-trafego-painel-atacadao.webp" alt="Resultados dos anúncios do Atacadão Madeiras em 7 dias" ratio="aspect-[9/16]" sizes="200px" />
          <div className="text-[15px] leading-relaxed text-ink/70">
            <Rotulo>Resultado real · Atacadão Madeiras</Rotulo>
            <p>
              Em 7 dias, anúncio para quem quer madeira em Angra: <strong className="text-ink">18 conversas no WhatsApp a R$ 3,86 cada</strong>, 40% mais barato que na campanha anterior. <strong className="text-ink">4.163 pessoas alcançadas</strong> com R$ 69,49 investidos.
            </p>
            <p className="mt-2 text-[13px] text-ink/50">Dados da conta de anúncios, relatório do período de 19 a 25/10/2026.</p>
            <div className="mt-4 max-w-[170px]">
              <VideoTile src="/portfolio-media/videos/video-atacadao-orcamento.mp4" poster="/portfolio-media/videos/poster-atacadao-orcamento.webp" titulo="Vídeo do anúncio do Atacadão Madeiras" legenda="O anúncio que trouxe as conversas" />
            </div>
          </div>
        </div>

        <div className="grid items-start gap-5 sm:grid-cols-[200px_1fr]">
          <Thumb src="/portfolio-media/videos/poster-trafego-painel-well.webp" alt="Resultados dos anúncios da Well Calçados em 1 mês" ratio="aspect-[9/16]" sizes="200px" />
          <div className="text-[15px] leading-relaxed text-ink/70">
            <Rotulo>Resultado real · Well Calçados</Rotulo>
            <p>
              Em 1 mês: <strong className="text-ink">4.123 engajamentos a R$ 0,03 cada</strong>, <strong className="text-ink">9.324 pessoas alcançadas</strong> com R$ 115,18 investidos.
            </p>
            <p className="mt-2 text-[13px] text-ink/50">Dados da conta de anúncios do cliente.</p>
          </div>
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
