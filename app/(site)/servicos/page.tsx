import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { contactInfo, services } from '@/lib/data'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = {
  ...pageMeta({
    title: 'Serviços',
    description: 'Tudo o que o Eixo de Marca faz: social media, design, identidade visual, edição de vídeo, gestão de conteúdo, landing pages e tráfego pago.',
    path: '/servicos',
  }),
  // página para mandar a quem precisa de um serviço específico, não para a busca
  robots: { index: false, follow: true },
}

// Um exemplo real por serviço, com link para ver mais.
const exemplos: Record<string, { src: string; alt: string; legenda: string; href: string }> = {
  'Social media': {
    src: '/portfolio-media/artes/atacadao-madeiras-02.webp',
    alt: 'Post do Atacadão Madeiras sobre decks, assoalhos, forros e vigas',
    legenda: 'Atacadão Madeiras',
    href: '/portfolio/artes/atacadao-madeiras',
  },
  Design: {
    src: '/portfolio-media/artes/lobo-tech-07.webp',
    alt: 'Slide de carrossel da Lobo Tech com fone feito de nuvem',
    legenda: 'Lobo Tech',
    href: '/portfolio/artes/lobo-tech',
  },
  'Identidade visual': {
    src: '/portfolio-media/marca-laura-anjos.webp',
    alt: 'Identidade visual da Laura Anjos',
    legenda: 'Laura Anjos',
    href: '/identidade-visual/laura-anjos',
  },
  'Edição de vídeo': {
    src: '/portfolio-media/videos/poster-atacadao-qual-madeira.webp',
    alt: 'Vídeo "Qual madeira escolher?" do Atacadão Madeiras',
    legenda: 'Atacadão Madeiras',
    href: '/portfolio/video',
  },
  'Gestão de conteúdo': {
    src: '/portfolio-media/videos/poster-gestao-outubro-2.webp',
    alt: 'Calendário de outubro com os posts publicados de vários clientes',
    legenda: 'Calendário de outubro',
    href: '/',
  },
  'Landing pages': {
    src: '/portfolio-media/videos/poster-landing-manoa-rapido.webp',
    alt: 'Landing page da Manoa aberta no celular',
    legenda: 'Manoa',
    href: '/',
  },
  'Tráfego pago': {
    src: '/portfolio-media/artes/health-coworking-01.webp',
    alt: 'Anúncio do Health CoWorking: seu consultório pronto para atender em Angra',
    legenda: 'Health CoWorking',
    href: '/portfolio/artes/health-coworking',
  },
}

const zap = (servico: string) =>
  `https://wa.me/${contactInfo.phone}?text=${encodeURIComponent(`Olá, Eixo de Marca. Preciso de ${servico.toLowerCase()}.`)}`

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-[#fffdfa] text-ink">
      <SiteHeader />

      <section className="bg-ink px-[var(--gutter)] pb-[clamp(60px,8vw,110px)] pt-[clamp(130px,18vh,190px)] text-white">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
            <span className="h-px w-10 bg-white/20" />
            Serviços
          </div>
          <h1 className="mt-6 max-w-[900px] [text-wrap:balance] font-display text-[clamp(24px,3.8vw,55px)] font-black uppercase leading-[1.08] [word-spacing:0.1em]">
            Precisou de um serviço? <span className="text-azure">A gente faz.</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-white/60">
            Escolha o que você precisa, veja um trabalho nosso e chame no WhatsApp. O especialista da área cuida do seu pedido.
          </p>
        </div>
      </section>

      <section className="px-[var(--gutter)] py-[clamp(40px,6vw,90px)]">
        <ul className="mx-auto flex max-w-[1100px] flex-col gap-6">
          {services.map((s) => {
            const ex = exemplos[s.title]
            return (
              <li key={s.title} className="grid items-center gap-6 rounded-2xl border border-ink/10 bg-white p-4 sm:grid-cols-[200px_1fr] sm:gap-8 sm:p-6">
                {ex && (
                  <Link href={ex.href} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink/5">
                      <Image src={ex.src} alt={ex.alt} fill sizes="(min-width: 640px) 200px, 90vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    </div>
                    <span className="mt-2 block text-[12px] text-ink/55">Exemplo: {ex.legenda} →</span>
                  </Link>
                )}
                <div>
                  <h2 className="font-display text-[clamp(20px,2.4vw,30px)] font-black uppercase leading-tight">{s.title}</h2>
                  <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-ink/70">{s.text}</p>
                  <a
                    href={zap(s.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Pedir pelo WhatsApp
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <SiteFooter />
    </main>
  )
}
