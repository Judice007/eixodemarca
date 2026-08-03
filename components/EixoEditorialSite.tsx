'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { contactInfo, mailtoUrl, methodSteps, services, whatsappUrl } from '@/lib/data'

const mediaStrip = [
  { src: '/portfolio-media/social-acai.webp', alt: 'Conteúdo para Di Casa Açaí', position: 'center 42%' },
  { src: '/portfolio-media/design-ukimports.webp', alt: 'Campanha para UK Imports', position: 'center 48%' },
  { src: '/portfolio-media/social-reset.webp', alt: 'Conteúdo para Reset Madeira Ecológica', position: 'center 52%' },
  { src: '/portfolio-media/landing-pousada.webp', alt: 'Conteúdo para Pousada da Praia', position: 'center 46%' },
  { src: '/portfolio-media/portfolio-eixo.png', alt: 'Campanha da Eixo de Marca', position: 'center 50%' },
  { src: '/portfolio-media/portfolio-cuidados-pele.png', alt: 'Conteúdo de beleza e estética', position: 'center 44%' },
]

const projects = [
  {
    type: 'image' as const,
    src: '/portfolio-media/design-ukimports.webp',
    alt: 'Campanha de smartphones para UK Imports',
    client: 'UK Imports',
    tags: 'Campanha · Design',
    fit: 'cover' as const,
    position: 'center 45%',
    wide: false,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-acai.webp',
    alt: 'Conteúdo para Di Casa Açaí',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center 42%',
    wide: false,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/identidade-vista-bajeko.png',
    alt: 'Identidade visual Vista Bajeko',
    client: 'Vista Bajeko',
    tags: 'Marca · Identidade visual',
    fit: 'contain' as const,
    position: 'center',
    wide: false,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-reset.webp',
    alt: 'Campanha sustentável para Reset Madeira Ecológica',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center 50%',
    wide: true,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/portfolio-eixo.png',
    alt: 'Peça da Eixo de Marca sobre direção de conteúdo',
    client: 'Eixo de Marca',
    tags: 'Posicionamento · Design',
    fit: 'cover' as const,
    position: 'center 50%',
    wide: false,
  },
]

const portfolioVideos = [
  {
    src: '/portfolio-media/videos/video-pousada-01.mp4',
    poster: '/portfolio-media/videos/poster-pousada-01.jpg',
    title: 'Pousada da Praia',
    tag: 'Turismo · Apresentação',
  },
  {
    src: '/portfolio-media/videos/video-pousada-02.mp4',
    poster: '/portfolio-media/videos/poster-pousada-02.jpg',
    title: 'Pousada da Praia',
    tag: 'Hospedagem · Lifestyle',
  },
  {
    src: '/portfolio-media/videos/video-pousada-03.mp4',
    poster: '/portfolio-media/videos/poster-pousada-03.jpg',
    title: 'Pousada da Praia',
    tag: 'Experiência · Destino',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-01.mp4',
    poster: '/portfolio-media/videos/poster-procedimento-estetico.jpg',
    title: 'Procedimento estético',
    tag: 'Captação · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-02.mp4',
    poster: '/portfolio-media/videos/poster-conteudo-fitness.jpg',
    title: 'Conteúdo fitness',
    tag: 'Ritmo · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-03.mp4',
    poster: '/portfolio-media/videos/poster-movimenta-angra.jpg',
    title: 'Movimenta Angra',
    tag: 'Apresentação · Cobertura',
  },
] as const

const serviceShowcaseMedia = [
  {
    type: 'video' as const,
    src: '/portfolio-media/videos/video-portfolio-03.mp4',
    poster: '/portfolio-media/videos/poster-movimenta-angra.jpg',
    alt: 'Conteúdo social em vídeo para Movimenta Angra',
    fit: 'cover' as const,
    position: 'center 45%',
    padded: false,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/design-ukimports.webp',
    alt: 'Design de campanha para UK Imports',
    fit: 'cover' as const,
    position: 'center 46%',
    padded: false,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/identidade-vista-bajeko.png',
    alt: 'Identidade visual Vista Bajeko',
    fit: 'contain' as const,
    position: 'center',
    padded: true,
  },
  {
    type: 'video' as const,
    src: '/portfolio-media/videos/video-portfolio-01.mp4',
    poster: '/portfolio-media/videos/poster-procedimento-estetico.jpg',
    alt: 'Edição de vídeo vertical de procedimento estético',
    fit: 'cover' as const,
    position: 'center',
    padded: false,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/gestao-producao.webp',
    alt: 'Organização e gestão de produção',
    fit: 'cover' as const,
    position: '58% center',
    padded: false,
  },
  {
    type: 'video' as const,
    src: '/portfolio-media/videos/video-pousada-02.mp4',
    poster: '/portfolio-media/videos/poster-pousada-02.jpg',
    alt: 'Experiência digital da Pousada da Praia',
    fit: 'cover' as const,
    position: 'center',
    padded: false,
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/trafego-itamang.webp',
    alt: 'Campanha de tráfego para Itamang',
    fit: 'contain' as const,
    position: 'center',
    padded: false,
  },
] as const

const marks = [
  { src: '/portfolio-media/marca-eixo.png', alt: 'Eixo de Marca', scale: 0.92 },
  { src: '/portfolio-media/identidade-vista-bajeko.png', alt: 'Vista Bajeko', scale: 0.92 },
  { src: '/portfolio-media/marca-espaco-dos-anjos.png', alt: 'Espaço dos Anjos', scale: 1.08 },
  { src: '/portfolio-media/marca-laura-anjos.png', alt: 'Laura Anjos', scale: 1.28 },
  { src: '/portfolio-media/marca-viva-angra.png', alt: 'Viva Angra', scale: 1.05 },
  { src: '/portfolio-media/marca-luciane-judice.png', alt: 'Luciane Júdice', scale: 1.08 },
  { src: '/portfolio-media/marca-itamang.png', alt: 'Itamang', scale: 1.02 },
  { src: '/portfolio-media/marca-bm.png', alt: 'Big Mateus', scale: 1.02 },
]

function SectionNumber({ number }: { number: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/35">
      <span className="h-px w-10 bg-ink/20" />
      {number}
    </div>
  )
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduce ? 0 : 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function PortfolioVideoCard({ video, index }: { video: (typeof portfolioVideos)[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const element = videoRef.current
    if (!element || reduce) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void element.play().catch(() => undefined)
        } else {
          element.pause()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reduce])

  return (
    <Reveal className="w-[72vw] max-w-[310px] shrink-0 snap-start sm:w-[290px] lg:w-[320px]" delay={(index % 3) * 0.05}>
      <article className="group">
        <div className="relative aspect-[9/16] overflow-hidden bg-white/5">
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            muted
            loop
            playsInline
            preload="metadata"
            poster={video.poster}
            controls
            aria-label={`${video.title}: ${video.tag}`}
          >
            <source src={video.src} type="video/mp4" />
          </video>
          <span className="pointer-events-none absolute left-4 top-4 border border-white/30 bg-ink/70 px-3 py-1.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            0{index + 1}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4 border-t border-white/15 py-4">
          <div>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">{video.tag}</p>
            <h3 className="mt-1.5 font-display text-[20px] font-bold leading-[1.15]">{video.title}</h3>
          </div>
          <span aria-hidden className="text-azure">×</span>
        </div>
      </article>
    </Reveal>
  )
}

function VideoPortfolioRail() {
  const railRef = useRef<HTMLDivElement>(null)

  const move = (direction: -1 | 1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * Math.min(360, rail.clientWidth * 0.78), behavior: 'smooth' })
  }

  return (
    <div className="mt-10">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
          Arraste ou use as setas
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Ver vídeos anteriores"
            className="grid size-11 place-items-center border border-white/20 text-lg text-white transition-colors hover:border-azure hover:bg-azure"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Ver próximos vídeos"
            className="grid size-11 place-items-center border border-white/20 text-lg text-white transition-colors hover:border-azure hover:bg-azure"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-5 sm:gap-5"
      >
        {portfolioVideos.map((video, index) => (
          <PortfolioVideoCard key={video.src} video={video} index={index} />
        ))}
      </div>
    </div>
  )
}

function ServicePhone({ active, reduce }: { active: number; reduce: boolean }) {
  const media = serviceShowcaseMedia[active]!

  return (
    <motion.div
      className="relative h-[430px] w-[216px] sm:h-[500px] sm:w-[250px]"
      animate={reduce ? undefined : { rotate: active % 2 === 0 ? -1.5 : 1.5, y: active % 2 === 0 ? -5 : 5 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[330px] -translate-x-1/2 -translate-y-1/2 sm:size-[410px]">
        <span className="absolute left-1/2 top-1/2 h-3 w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-azure/16" />
        <span className="absolute left-1/2 top-1/2 h-3 w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-azure/16" />
        <span className="absolute inset-8 border border-dashed border-azure/30" />
      </div>

      <span className="absolute -right-1 top-24 h-16 w-1 bg-azure" />
      <div className="relative h-full overflow-hidden rounded-[38px] border-[8px] border-ink bg-ink shadow-[0_44px_90px_-34px_rgba(42,16,74,.72)]">
        <div className="absolute left-1/2 top-2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${active}-${media.src}`}
            className={`absolute inset-0 overflow-hidden ${media.fit === 'contain' ? 'bg-ink' : 'bg-lavanda'}`}
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.03, y: -14 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {media.type === 'video' ? (
              <video
                className="h-full w-full object-cover"
                style={{ objectPosition: media.position }}
                autoPlay={!reduce}
                muted
                loop
                playsInline
                preload="metadata"
                poster={media.poster}
                aria-label={media.alt}
              >
                <source src={media.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes="250px"
                className={`${media.fit === 'contain' ? 'object-contain' : 'object-cover'} ${media.padded ? 'p-5' : ''}`}
                style={{ objectPosition: media.position }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function EixoEditorialSite() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [activeService, setActiveService] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const serviceRefs = useRef<Array<HTMLElement | null>>([])
  const duplicatedMedia = [...mediaStrip, ...mediaStrip]
  const duplicatedServices = [...services, ...services]

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 72)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    let frame = 0

    const updateActiveService = () => {
      frame = 0
      const focusLine = window.innerHeight * 0.48
      let nextActive = 0
      let closestDistance = Number.POSITIVE_INFINITY

      serviceRefs.current.forEach((element, index) => {
        if (!element) return
        const rect = element.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - focusLine)

        if (distance < closestDistance) {
          closestDistance = distance
          nextActive = index
        }
      })

      setActiveService((current) => (current === nextActive ? current : nextActive))
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveService)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main id="top" className="min-h-screen bg-[#fffdfa] text-ink">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'px-4 pt-2 sm:px-7' : 'px-3 pt-3 sm:px-5 sm:pt-4'}`}>
        <div
          className={`mx-auto flex items-center justify-between border border-ink/10 bg-white/92 shadow-[0_16px_45px_-30px_rgba(42,16,74,.35)] backdrop-blur-xl transition-all duration-500 ${
            scrolled ? 'max-w-[1160px] px-4 py-2 sm:px-5' : 'max-w-[1420px] px-4 py-3 sm:px-7'
          }`}
        >
          <a href="#top" aria-label="Eixo de Marca — início" className="shrink-0">
            <Image
              src="/eixo-wordmark.png"
              alt="Eixo de Marca"
              width={1515}
              height={573}
              priority
              className={`w-auto transition-all duration-500 ${scrolled ? 'h-[18px]' : 'h-[21px] sm:h-6'}`}
              style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(37%) saturate(3825%) hue-rotate(258deg) brightness(76%) contrast(104%)' }}
            />
          </a>

          <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-[14px] font-medium lg:flex">
            {[
              ['Serviços', '#servicos'],
              ['Portfólio', '#portfolio'],
              ['Método', '#metodo'],
              ['Contato', '#contato'],
            ].map(([label, href]) => (
              <a
                key={href}
                className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-azure after:transition-transform hover:text-azure hover:after:scale-x-100"
                href={href}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid size-10 place-items-center border border-ink/15 lg:hidden"
            >
              <span className="relative h-3.5 w-4">
                <span className={`absolute left-0 top-0.5 h-px w-4 bg-ink transition-transform ${mobileMenuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`absolute bottom-0.5 left-0 h-px w-4 bg-ink transition-transform ${mobileMenuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden bg-azure text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 min-[430px]:inline-flex sm:text-[13px] ${
                scrolled ? 'px-4 py-2' : 'px-4 py-2.5 sm:px-5'
              }`}
              style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }}
            >
              Vamos conversar ↗
            </a>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              aria-label="Navegação mobile"
              className="mx-auto mt-2 grid max-w-[1420px] border border-white/10 bg-ink px-5 py-3 text-white shadow-2xl lg:hidden"
              initial={reduce ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {[
                ['Serviços', '#servicos'],
                ['Portfólio', '#portfolio'],
                ['Método', '#metodo'],
                ['Contato', '#contato'],
              ].map(([label, href], index) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-white/10 py-3.5 font-sans text-[13px] font-semibold last:border-b-0"
                >
                  <span>{label}</span>
                  <span className="font-sans text-[9px] text-azure">0{index + 1}</span>
                </a>
              ))}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 bg-azure px-4 py-3 text-center font-sans text-[12px] font-bold min-[430px]:hidden"
              >
                Vamos conversar ↗
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="relative flex min-h-[100svh] flex-col justify-between px-[var(--gutter)] pb-0 pt-[clamp(130px,18vh,190px)]">
        <div className="mx-auto w-full max-w-[1420px] text-center">
          <motion.p
            className="mx-auto mb-7 w-fit border border-ink/12 px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/55"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Estratégia · criação · gestão
          </motion.p>
          <motion.h1
            className="mx-auto max-w-[1250px] font-display text-[clamp(52px,9.2vw,142px)] font-black uppercase leading-[0.9] tracking-[-0.05em] max-sm:text-[39px] max-sm:leading-[0.96] max-sm:tracking-[-0.03em] max-[360px]:text-[36px]"
            initial={reduce ? false : { opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block whitespace-nowrap">Conteúdo que</span>
            <span className="block whitespace-nowrap text-azure">chama atenção.</span>
          </motion.h1>
          <motion.div
            className="mx-auto mt-9 flex max-w-[900px] flex-col items-center justify-between gap-6 md:flex-row"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
          >
            <p className="max-w-[590px] text-[15px] leading-relaxed text-ink/60 md:text-left md:text-[17px]">
              Unimos social media, design, vídeo e organização para transformar ideias em presença digital e fazer cada projeto sair do papel.
            </p>
            <a
              href="#portfolio"
              className="inline-flex shrink-0 items-center gap-3 bg-ink px-6 py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-azure"
            >
              Ver projetos <span aria-hidden>↓</span>
            </a>
          </motion.div>
        </div>

        <div className="relative mt-[clamp(54px,9vh,96px)] -mx-[var(--gutter)] overflow-hidden pb-4">
          <div className={`eixo-media-marquee flex w-max gap-4 px-2 ${reduce ? '' : 'will-change-transform'}`}>
            {duplicatedMedia.map((item, index) => (
              <figure
                key={`${item.src}-${index}`}
                className="relative h-[220px] w-[170px] shrink-0 overflow-hidden bg-lavanda sm:h-[300px] sm:w-[235px] lg:h-[360px] lg:w-[285px]"
              >
                <Image
                  src={item.src}
                  alt={index < mediaStrip.length ? item.alt : ''}
                  fill
                  priority={index < 3}
                  sizes="285px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  style={{ objectPosition: item.position }}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 px-[var(--gutter)] py-[clamp(72px,10vw,136px)]">
        <div className="mx-auto grid max-w-[1420px] gap-14 lg:grid-cols-[160px_1fr]">
          <SectionNumber number="01" />
          <div>
            <Reveal>
              <h2 className="max-w-[1180px] text-right font-display text-[clamp(42px,6.8vw,104px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                Aqui tudo começa com <span className="text-azure">direção.</span> Entregamos comunicação além do automático.
              </h2>
            </Reveal>
            <Reveal className="ml-auto mt-12 max-w-[720px]" delay={0.08}>
              <p className="text-right text-[16px] leading-[1.7] text-ink/60 sm:text-[19px]">
                Estratégia, criatividade e processo trabalhando juntos. Cada escolha precisa reforçar a marca, aproximar pessoas e conduzir o projeto para uma entrega clara.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="servicos" className="scroll-mt-[108px] border-t border-ink/10 bg-lavanda/35 px-[var(--gutter)] py-[clamp(70px,9vw,124px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <SectionNumber number="02" />
            <Reveal>
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="max-w-[900px] font-display text-[clamp(44px,7vw,102px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Seu projeto, sempre no <span className="text-azure">eixo.</span>
                </h2>
                <p className="max-w-[330px] text-[15px] leading-relaxed text-ink/55">
                  Role para explorar. Os serviços avançam pela esquerda enquanto o celular, à direita, troca de cena em cada etapa.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="relative mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.72fr)] lg:gap-16">
            <div className="order-2 lg:order-1">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  ref={(element) => {
                    serviceRefs.current[index] = element
                  }}
                  tabIndex={0}
                  aria-current={activeService === index ? 'step' : undefined}
                  onFocus={() => setActiveService(index)}
                  className="flex items-center border-t border-ink/12 py-8 first:border-t-0 lg:min-h-[58vh] lg:py-12"
                >
                  <motion.div
                    className={`relative w-full max-w-[590px] border-l-[3px] p-6 transition-[background-color,border-color,box-shadow] duration-500 sm:p-8 lg:p-10 ${
                      activeService === index
                        ? 'border-azure bg-white/90 shadow-[0_30px_80px_-42px_rgba(42,16,74,.42)]'
                        : 'border-transparent bg-transparent'
                    }`}
                    style={
                      activeService === index
                        ? { clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))' }
                        : undefined
                    }
                    initial={reduce ? false : { opacity: 0, x: -50, y: 18 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.38 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                      <span className="font-sans text-[10px] font-bold tracking-[0.18em] text-azure">0{index + 1}</span>
                      <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.15em] text-ink/35">
                        Eixo em movimento
                      </span>
                    </div>
                    <h3 className={`mt-6 font-display text-[clamp(31px,4vw,58px)] font-black leading-[1.02] tracking-[-0.025em] transition-colors duration-500 ${
                      activeService === index ? 'text-ink' : 'text-ink/35'
                    }`}>
                      {service.title}
                    </h3>
                    <p className={`mt-5 max-w-[42ch] text-[13px] leading-[1.7] transition-colors duration-500 sm:text-[14px] ${
                      activeService === index ? 'text-ink/60' : 'text-ink/30'
                    }`}>{service.text}</p>
                    <div className="mt-6 flex items-center gap-3 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-azure">
                      <span className="grid size-7 place-items-center border border-azure/45">×</span>
                      Dentro da tela
                    </div>
                    <span aria-hidden className="absolute left-full top-1/2 hidden h-px w-[clamp(38px,5vw,72px)] bg-azure/50 lg:block" />
                  </motion.div>
                </motion.article>
              ))}
              <div aria-hidden className="hidden h-[18vh] lg:block" />
            </div>

            <aside className="order-1 self-stretch lg:order-2">
              <div className="relative flex h-[440px] items-center justify-center sm:h-[500px] lg:sticky lg:top-[92px] lg:h-[calc(100svh-110px)]">
                <ServicePhone active={activeService} reduce={!!reduce} />
                <div aria-hidden className="absolute left-0 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
                  {services.map((service, index) => (
                    <span key={service.title} className="flex items-center gap-2">
                      <span className={`font-display text-[12px] font-black transition-colors ${index === activeService ? 'text-azure' : 'text-ink/20'}`}>
                        {index === activeService ? '×' : '·'}
                      </span>
                      <span className={`h-px transition-all duration-500 ${index === activeService ? 'w-10 bg-azure' : 'w-5 bg-ink/15'}`} />
                    </span>
                  ))}
                </div>
                <div className="pointer-events-none absolute right-0 top-8 hidden items-center gap-3 font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-ink/40 lg:flex">
                  Celular fixo
                  <span className="h-px w-10 bg-azure" />
                </div>
                <div className="pointer-events-none absolute bottom-8 right-0 hidden text-right lg:block">
                  <p className="font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-ink/35">Serviço ativo</p>
                  <p className="mt-2 font-display text-[18px] font-bold text-ink/60">
                    0{activeService + 1} / 0{services.length}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="portfolio" className="scroll-mt-[108px] bg-ink px-[var(--gutter)] py-[clamp(72px,9vw,132px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <div className="flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
              <span className="h-px w-10 bg-white/20" />
              03
            </div>
            <Reveal>
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="max-w-[980px] font-display text-[clamp(44px,7vw,102px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Marcas e histórias que ganharam <span className="text-azure">forma.</span>
                </h2>
                <p className="max-w-[290px] text-[14px] leading-relaxed text-white/55">Projetos reais de comunicação, identidade e conteúdo.</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal
                key={`${project.client}-${index}`}
                className={`h-full ${project.wide ? 'xl:col-span-2' : ''}`}
                delay={(index % 3) * 0.06}
              >
                <article className="group h-full">
                  <div className={`relative overflow-hidden bg-white/5 ${project.wide ? 'aspect-[4/5] xl:aspect-[8/5]' : 'aspect-[4/5]'}`}>
                    <Image
                      src={project.src}
                      alt={project.alt}
                      fill
                      sizes="(min-width: 1280px) 32vw, (min-width: 768px) 50vw, 100vw"
                      className={`${project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.035]`}
                      style={{ objectPosition: project.position }}
                    />
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 z-10 grid size-14 -translate-x-1/2 -translate-y-1/2 rotate-[-24deg] place-items-center bg-azure font-display text-xl font-black text-white opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-100"
                    >
                      X
                    </span>
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 to-transparent p-5 pt-24">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/60">{project.tags}</p>
                        <h3 className="mt-2 font-display text-[24px] font-bold leading-[1.12] tracking-[-0.015em]">{project.client}</h3>
                      </div>
                      <span className="grid size-10 place-items-center border border-white/35 text-sm transition-colors group-hover:border-azure group-hover:bg-azure">↗</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-[clamp(76px,9vw,126px)] border-t border-white/15 pt-10">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-azure">Portfólio em movimento</p>
                  <h3 className="mt-4 max-w-[820px] font-display text-[clamp(38px,5.8vw,78px)] font-black uppercase leading-[1] tracking-[-0.035em]">
                    Histórias que também ganham <span className="text-azure">ritmo.</span>
                  </h3>
                </div>
                <p className="max-w-[300px] text-[14px] leading-relaxed text-white/55">
                  Os seis vídeos do portfólio reunidos em uma seleção de conteúdo vertical, turismo, apresentação e cobertura.
                </p>
              </div>
            </Reveal>

            <VideoPortfolioRail />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-ink/10 bg-azure py-7 text-white">
        <div className={`eixo-service-marquee flex w-max items-center ${reduce ? '' : 'will-change-transform'}`}>
          {duplicatedServices.map((service, index) => (
            <div key={`${service.title}-${index}`} className="flex items-center">
              <span className="px-5 font-display text-[clamp(34px,5vw,72px)] font-black uppercase leading-none tracking-[-0.025em]">{service.title}</span>
              <span className="text-[clamp(26px,4vw,56px)] text-ink">✦</span>
            </div>
          ))}
        </div>
      </section>

      <section id="metodo" className="scroll-mt-[108px] px-[var(--gutter)] py-[clamp(70px,9vw,136px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <SectionNumber number="04" />
            <Reveal>
              <h2 className="max-w-[1050px] font-display text-[clamp(44px,7vw,102px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                Criatividade precisa de <span className="text-azure">processo.</span>
              </h2>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-px bg-ink/15 md:grid-cols-2 xl:grid-cols-4">
            {methodSteps.map((step, index) => (
              <Reveal key={step.key} className="h-full" delay={index * 0.05}>
                <article className="group relative flex h-full min-h-[250px] flex-col overflow-hidden bg-[#fffdfa] p-6 transition-colors duration-500 hover:bg-lavanda sm:min-h-[290px] sm:p-7 xl:min-h-[330px]">
                  <span aria-hidden className="absolute -right-12 -top-12 size-24 rotate-45 border border-azure/0 transition-all duration-500 group-hover:border-azure/40 group-hover:bg-azure/5" />
                  <span className="font-mono text-[10px] text-azure">0{index + 1}</span>
                  <h3 className="mt-auto font-display text-[30px] font-black leading-[1.08] tracking-[-0.02em]">{step.label}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-ink/55">{step.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="border border-ink/12 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-ink/55">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <span aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-azure transition-all duration-500 group-hover:w-full" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 px-[var(--gutter)] py-[clamp(70px,9vw,124px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionNumber number="05" />
              <Reveal>
                <h2 className="mt-8 max-w-[820px] font-display text-[clamp(40px,6vw,86px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Identidades que já passaram pelo nosso <span className="text-azure">eixo.</span>
                </h2>
              </Reveal>
            </div>
            <p className="max-w-[320px] text-[14px] leading-relaxed text-ink/50">Seleção de marcas e sistemas visuais presentes no portfólio.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 border-l border-t border-ink/10 sm:mt-11 sm:grid-cols-4">
            {marks.map((mark) => (
              <div
                key={mark.src}
                className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-r border-ink/10 bg-white transition-colors duration-500 hover:bg-lavanda/55"
              >
                <div className="relative h-[58%] w-[70%] transition-transform duration-500 group-hover:-translate-y-1">
                  <Image
                    src={mark.src}
                    alt={mark.alt}
                    fill
                    sizes="25vw"
                    className="object-contain"
                    style={{ transform: `scale(${mark.scale})` }}
                  />
                </div>
                <span className="absolute bottom-3 left-4 font-mono text-[8px] uppercase tracking-[0.15em] text-ink/35 transition-colors group-hover:text-azure sm:bottom-4 sm:left-5">
                  {mark.alt}
                </span>
                <span aria-hidden className="absolute -right-7 -top-7 size-14 rotate-45 border border-azure/0 transition-all duration-500 group-hover:border-azure/45 group-hover:bg-azure/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contato" className="scroll-mt-[108px] bg-ink px-[var(--gutter)] pb-8 pt-[clamp(82px,10vw,142px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-azure">Próximo projeto</p>
          <h2 className="mt-6 max-w-[1250px] font-display text-[clamp(54px,9.5vw,146px)] font-black uppercase leading-[0.9] tracking-[-0.05em] max-sm:leading-[0.96] max-sm:tracking-[-0.035em]">
            Vamos fazer sua marca <span className="text-azure">aparecer.</span>
          </h2>
          <div className="mt-14 flex flex-col justify-between gap-8 border-t border-white/15 pt-8 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-azure px-6 py-3.5 text-[13px] font-bold transition-colors hover:bg-white hover:text-ink">
                Falar no WhatsApp ↗
              </a>
              <a href={mailtoUrl} className="border border-white/25 px-6 py-3.5 text-[13px] font-bold transition-colors hover:border-white">
                {contactInfo.email}
              </a>
            </div>
            <a href="#top" className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white">Voltar ao topo ↑</a>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/35 sm:flex-row">
            <span>© 2026 Eixo de Marca — Brasil</span>
            <span>Estratégia · criação · gestão</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
