'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { contactInfo, mailtoUrl, methodSteps, services, whatsappUrl } from '@/lib/data'

const mediaStrip = [
  { src: '/portfolio-media/social-acai.webp', alt: 'Conteúdo para Di Casa Açaí', position: 'center 42%' },
  { src: '/portfolio-media/design-ukimports.webp', alt: 'Campanha para UK Imports', position: 'center 48%' },
  { src: '/portfolio-media/social-reset.webp', alt: 'Conteúdo para Reset Madeira Ecológica', position: 'center 52%' },
  { src: '/portfolio-media/landing-pousada.webp', alt: 'Conteúdo para Pousada da Praia', position: 'center 46%' },
  { src: '/portfolio-media/portfolio-eixo.webp', alt: 'Campanha da Eixo de Marca', position: 'center 50%' },
  { src: '/portfolio-media/portfolio-cuidados-pele.webp', alt: 'Conteúdo de beleza e estética', position: 'center 44%' },
  { src: '/portfolio-media/post-direcao.webp', alt: 'Post sobre direção de marca para a Eixo de Marca', position: 'center 40%' },
  { src: '/portfolio-media/post-ia.webp', alt: 'Post sobre marcas e inteligência artificial para a Eixo de Marca', position: 'center 40%' },
  { src: '/portfolio-media/post-laura-protetor-solar.webp', alt: 'Post sobre protetor solar para Laura Anjos', position: 'center 40%' },
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
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-acai.webp',
    alt: 'Conteúdo para Di Casa Açaí',
    client: 'Di Casa Açaí',
    tags: 'Social media · Conteúdo',
    fit: 'cover' as const,
    position: 'center 42%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/identidade-vista-bajeko.webp',
    alt: 'Identidade visual Vista Bajeko',
    client: 'Vista Bajeko',
    tags: 'Marca · Identidade visual',
    fit: 'contain' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/social-reset.webp',
    alt: 'Campanha sustentável para Reset Madeira Ecológica',
    client: 'Reset',
    tags: 'Estratégia · Social media',
    fit: 'cover' as const,
    position: 'center 50%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/portfolio-eixo.webp',
    alt: 'Peça da Eixo de Marca sobre direção de conteúdo',
    client: 'Eixo de Marca',
    tags: 'Posicionamento · Design',
    fit: 'cover' as const,
    position: 'center 50%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/landing-pousada.webp',
    alt: 'Landing page da Pousada da Praia',
    client: 'Pousada da Praia',
    tags: 'Web · Landing page',
    fit: 'cover' as const,
    position: 'center 46%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/trafego-itamang.webp',
    alt: 'Campanha de tráfego para Itamang',
    client: 'Itamang',
    tags: 'Tráfego pago',
    fit: 'cover' as const,
    position: 'center',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-lembrada.webp',
    alt: 'Post sobre clareza de marca para a Eixo de Marca',
    client: 'Eixo de Marca',
    tags: 'Posicionamento · Design',
    fit: 'cover' as const,
    position: 'center 30%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-laura-dispositivo.webp',
    alt: 'Post sobre dispositivo de estética para Laura Anjos',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center 30%',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/post-laura-pele-desidratada.webp',
    alt: 'Post sobre sinais de pele desidratada para Laura Anjos',
    client: 'Laura Anjos',
    tags: 'Social media · Estética',
    fit: 'cover' as const,
    position: 'center 55%',
  },
]

const portfolioVideos = [
  {
    src: '/portfolio-media/videos/video-pousada-01.mp4',
    poster: '/portfolio-media/videos/poster-pousada-01.webp',
    title: 'Pousada da Praia',
    tag: 'Turismo · Apresentação',
  },
  {
    src: '/portfolio-media/videos/video-trafego-pago.mp4',
    poster: '/portfolio-media/videos/poster-trafego-pago.webp',
    title: 'Beleza ou estratégia',
    tag: 'Gancho · Tráfego pago',
  },
  {
    src: '/portfolio-media/videos/video-massagem.mp4',
    poster: '/portfolio-media/videos/poster-massagem.webp',
    title: 'Bem-estar & spa',
    tag: 'Gancho · Reels',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-01.mp4',
    poster: '/portfolio-media/videos/poster-procedimento-estetico.webp',
    title: 'Procedimento estético',
    tag: 'Captação · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-02.mp4',
    poster: '/portfolio-media/videos/poster-conteudo-fitness.webp',
    title: 'Conteúdo fitness',
    tag: 'Ritmo · Edição',
  },
  {
    src: '/portfolio-media/videos/video-portfolio-03.mp4',
    poster: '/portfolio-media/videos/poster-movimenta-angra.webp',
    title: 'Movimenta Angra',
    tag: 'Apresentação · Cobertura',
  },
] as const

const serviceShowcaseMedia = [
  {
    type: 'video' as const,
    src: '/portfolio-media/videos/video-portfolio-03.mp4',
    poster: '/portfolio-media/videos/poster-movimenta-angra.webp',
    alt: 'Conteúdo social em vídeo para Movimenta Angra',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/design-ukimports.webp',
    alt: 'Design de campanha para UK Imports',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/identidade-vista-bajeko-manual.webp',
    alt: 'Aplicação da identidade visual da Vista Bajeko em camisetas',
  },
  {
    type: 'video' as const,
    src: '/portfolio-media/videos/video-edicao-institucional.mp4',
    poster: '/portfolio-media/videos/poster-edicao-institucional.webp',
    alt: 'Vídeo institucional editado para reunião de equipe',
  },
  {
    type: 'image' as const,
    src: '/portfolio-media/gestao-projetos-equipe.webp',
    alt: 'Equipe da Eixo de Marca organizando um projeto',
  },
  {
    type: 'video' as const,
    src: '/portfolio-media/videos/video-manoa-tour.mp4',
    poster: '/portfolio-media/videos/poster-manoa-tour.webp',
    alt: 'Navegação pela landing page da Manoa Tour',
  },
  {
    type: 'video' as const,
    src: '/portfolio-media/videos/video-trafego-pago.mp4',
    poster: '/portfolio-media/videos/poster-trafego-pago.webp',
    alt: 'Vídeo sobre estratégia de tráfego pago',
  },
] as const

const marks = [
  { src: '/portfolio-media/marca-eixo.webp', alt: 'Eixo de Marca' },
  { src: '/portfolio-media/identidade-vista-bajeko.webp', alt: 'Vista Bajeko' },
  { src: '/portfolio-media/marca-espaco-dos-anjos.webp', alt: 'Espaço dos Anjos' },
  { src: '/portfolio-media/marca-laura-anjos.webp', alt: 'Laura Anjos' },
  { src: '/portfolio-media/marca-viva-angra.webp', alt: 'Viva Angra' },
  { src: '/portfolio-media/marca-luciane-judice.webp', alt: 'Luciane Júdice' },
  { src: '/portfolio-media/marca-itamang.webp', alt: 'Itamang' },
  { src: '/portfolio-media/marca-bm.webp', alt: 'BIG' },
]

// Posições dos 7 cartões ao redor do celular (offset % do centro do container
// quadrado), num arco de 320° que pula o vão de baixo onde ficam as "mãos".
// x/y = R·cos/sin do ângulo -- calculado uma vez, não em runtime. R=34 no
// mobile (celular menor, precisa de menos raio) e R=42 a partir do sm:.
const ORBIT_POSITIONS = [
  { x: 13.0, y: 35.7, xSm: 14.4, ySm: 39.5 },
  { x: 36.4, y: 10.9, xSm: 40.2, ySm: 12.0 },
  { x: 30.5, y: -22.7, xSm: 33.7, ySm: -25.1 },
  { x: 0, y: -34, xSm: 0, ySm: -42 },
  { x: -30.5, y: -22.7, xSm: -33.7, ySm: -25.1 },
  { x: -36.4, y: 10.9, xSm: -40.2, ySm: 12.0 },
  { x: -13.0, y: 35.7, xSm: -14.4, ySm: 39.5 },
]

const SERVICE_ICON_PATHS = [
  // Social media -- balão de conversa
  <path key="p" d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />,
  // Design -- caneta
  <g key="g">
    <path d="M3 21l3.2-.9L18.4 7.9a1.5 1.5 0 0 0 0-2.1l-1.2-1.2a1.5 1.5 0 0 0-2.1 0L2.9 16.8 2 20l1 1Z" />
    <path d="M13.5 6.5l3 3" />
  </g>,
  // Identidade visual -- selo hexagonal
  <path key="p" d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" />,
  // Edição de vídeo -- play em quadro
  <g key="g">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M10 9l6 3-6 3V9Z" fill="currentColor" stroke="none" />
  </g>,
  // Gestão de projetos -- checklist
  <g key="g">
    <rect x="4" y="5" width="4" height="4" rx="1" />
    <rect x="4" y="10.5" width="4" height="4" rx="1" />
    <rect x="4" y="16" width="4" height="4" rx="1" />
    <path d="M11 7h9M11 12.5h9M11 18h9" />
  </g>,
  // Landing pages -- janela de navegador
  <g key="g">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 9h18" />
    <circle cx="6" cy="7" r="0.6" fill="currentColor" stroke="none" />
  </g>,
  // Tráfego pago -- gráfico em alta
  <g key="g">
    <path d="M4 16l5-5 4 4 7-8" />
    <path d="M15 6h5v5" />
  </g>,
]

function ServiceIcon({ index, className }: { index: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {SERVICE_ICON_PATHS[index % SERVICE_ICON_PATHS.length]}
    </svg>
  )
}

function SectionNumber({ number }: { number: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/65">
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

const revealGroupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } },
}

// Mesmo efeito visual do Reveal (fade + sobe ao entrar na tela), mas pra
// GRADES de cards: um único whileInView no container dispara o stagger de
// todos os filhos via variants, em vez de cada card montar seu próprio
// observer/animação — bem mais leve no carregamento em seções com vários
// itens (projetos, vídeos do portfólio, método).
function RevealGroup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={reduce ? undefined : revealGroupVariants}
    >
      {children}
    </motion.div>
  )
}

function RevealItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={revealItemVariants}>
      {children}
    </motion.div>
  )
}

function PortfolioVideoCard({ video, index }: { video: (typeof portfolioVideos)[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  // Play só quando a pessoa toca no card — sem autoplay no scroll, os 6 vídeos
  // não competem por banda/decodificação ao mesmo tempo enquanto o usuário rola a página.
  useEffect(() => {
    const element = videoRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) element.pause()
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const handlePlay = () => {
    void videoRef.current?.play().catch(() => undefined)
  }

  return (
    <RevealItem>
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
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label={`${video.title}: ${video.tag}`}
          >
            <source src={video.src} type="video/mp4" />
          </video>
          {!playing && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label={`Reproduzir vídeo: ${video.title}`}
              className="absolute inset-0 flex items-center justify-center bg-ink/15 transition-colors group-hover:bg-ink/25"
            >
              <span className="grid size-12 place-items-center rounded-full bg-white/95 text-ink shadow-lg transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
          <span className="pointer-events-none absolute left-4 top-4 border border-white/30 bg-ink/70 px-3 py-1.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            0{index + 1}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4 border-t border-white/15 py-4">
          <div>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">{video.tag}</p>
            <h3 className="mt-1.5 font-display text-[20px] font-bold leading-[1.15]">{video.title}</h3>
          </div>
          <Image aria-hidden src="/eixo-symbol.png" alt="" width={16} height={16} className="mt-1 shrink-0" />
        </div>
      </article>
    </RevealItem>
  )
}

function VideoPortfolioGrid() {
  return (
    <RevealGroup className="mx-auto mt-10 grid max-w-[720px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {portfolioVideos.map((video, index) => (
        <PortfolioVideoCard key={video.src} video={video} index={index} />
      ))}
    </RevealGroup>
  )
}

// Toca só quando o celular está realmente visível — sem isso, o vídeo do
// serviço ativo (alguns têm mais de 10MB) baixava e tocava assim que a página
// carregava, mesmo essa seção estando abaixo da dobra. Mesmo padrão já usado
// em PortfolioVideoCard, só que aqui o elemento remonta a cada troca de
// serviço (key muda no AnimatePresence), então o efeito roda de novo sozinho.
function ServicePhoneVideo({ src, poster, alt, reduce }: { src: string; poster: string; alt: string; reduce: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

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
      { threshold: 0.3 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reduce])

  return (
    <video ref={videoRef} className="h-full w-full object-cover" muted loop playsInline preload="metadata" poster={poster} aria-label={alt}>
      <source src={src} type="video/mp4" />
    </video>
  )
}

function ServicePhone({ active, reduce }: { active: number; reduce: boolean }) {
  const media = serviceShowcaseMedia[active]!

  return (
    <motion.div
      className="relative h-[300px] w-[151px] sm:h-[500px] sm:w-[250px]"
      animate={reduce ? undefined : { rotate: active % 2 === 0 ? -1.5 : 1.5, y: active % 2 === 0 ? -5 : 5 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[230px] -translate-x-1/2 -translate-y-1/2 sm:size-[410px]">
        <span className="absolute left-1/2 top-1/2 h-3 w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-azure/16" />
        <span className="absolute left-1/2 top-1/2 h-3 w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-azure/16" />
        <span className="absolute inset-8 border border-dashed border-azure/30" />
      </div>

      <span className="absolute -right-1 top-16 h-12 w-1 bg-azure sm:top-24 sm:h-16" />
      <div className="relative h-full overflow-hidden rounded-[28px] border-[6px] border-ink bg-ink shadow-[0_44px_90px_-34px_rgba(42,16,74,.72)] sm:rounded-[38px] sm:border-[8px]">
        <div className="absolute left-1/2 top-1.5 z-30 h-4 w-14 -translate-x-1/2 rounded-full bg-ink sm:top-2 sm:h-5 sm:w-20" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${active}-${media.src}`}
            className="absolute inset-0 overflow-hidden bg-lavanda"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.03, y: -14 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {media.type === 'video' ? (
              <ServicePhoneVideo src={media.src} poster={media.poster} alt={media.alt} reduce={!!reduce} />
            ) : (
              <Image src={media.src} alt={media.alt} fill sizes="250px" className="object-cover" />
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
  const [isDesktopOrbit, setIsDesktopOrbit] = useState(false)
  const duplicatedMedia = [...mediaStrip, ...mediaStrip]
  const duplicatedServices = [...services, ...services]

  // Raio da órbita de serviços muda no breakpoint sm (640px) -- via matchMedia
  // porque classes Tailwind com valor dinâmico (className={`sm:[--x:${x}]`})
  // não são geradas pelo JIT, só literais presentes no código-fonte.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => setIsDesktopOrbit(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 72)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Troca de serviço em loop -- não depende mais de scroll. Pausado com
  // prefers-reduced-motion (evita conteúdo trocando sozinho na tela pra quem
  // pediu menos animação).
  const serviceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (reduce) return undefined
    serviceIntervalRef.current = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
    }, 2600)
    return () => {
      if (serviceIntervalRef.current) clearInterval(serviceIntervalRef.current)
    }
  }, [reduce])

  const selectService = (index: number) => {
    setActiveService(index)
    if (serviceIntervalRef.current) clearInterval(serviceIntervalRef.current)
    if (!reduce) {
      serviceIntervalRef.current = setInterval(() => {
        setActiveService((prev) => (prev + 1) % services.length)
      }, 2600)
    }
  }

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
              sizes="64px"
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
                className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-azure after:transition-transform hover:text-azure-label hover:after:scale-x-100"
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
            className="mx-auto mb-7 w-fit border border-ink/12 px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/65"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Estratégia · criação · gestão
          </motion.p>
          <motion.h1
            className="mx-auto max-w-[1250px] [text-wrap:balance] font-display text-[clamp(28px,5vw,78px)] font-black uppercase leading-[0.9] tracking-[-0.05em] max-sm:text-[24px] max-sm:leading-[0.96] max-sm:tracking-[-0.035em]"
            initial={reduce ? false : { opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block whitespace-nowrap">Conteúdo que</span>
            <span className="block whitespace-nowrap text-azure-heading">chama atenção.</span>
          </motion.h1>
          <motion.div
            className="mx-auto mt-9 flex max-w-[900px] flex-col items-center justify-between gap-6 md:flex-row"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
          >
            <p className="max-w-[590px] text-[15px] leading-relaxed text-ink/60 md:text-left md:text-[17px]">
              Unimos social media, design, vídeo e organização para transformar ideias em presença digital — e tirar cada projeto do papel.
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
                  // As 6 primeiras imagens do primeiro loop precisam de priority=true -- testei
                  // limitar a 2 (achando que o preload das 6 competia com as fontes) e o
                  // atraso de renderização do LCP voltou a ~2.2s. Com as 6 fica em ~470ms,
                  // então o preload "competindo" era menor problema que ficar sem ele.
                  // Fixo em 6 (não mediaStrip.length): o array cresceu para 9 itens e todas
                  // passaram a levar priority=true, o que trouxe o mesmo regressão de LCP de volta.
                  priority={index < 6}
                  sizes="(min-width: 1024px) 285px, (min-width: 640px) 235px, 170px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  style={{ objectPosition: item.position }}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 px-[var(--gutter)] py-[clamp(82px,11vw,146px)]">
        <div className="mx-auto grid max-w-[1420px] gap-14 lg:grid-cols-[160px_1fr]">
          <SectionNumber number="01" />
          <div>
            <Reveal>
              <h2 className="max-w-[1180px] text-right [text-wrap:balance] font-display text-[clamp(23px,3.7vw,57px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                Aqui tudo começa com <span className="text-azure-heading">direção.</span> Entregamos comunicação pensada, não apenas automática.
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

      <section id="servicos" className="scroll-mt-24 border-t border-ink/10 bg-lavanda/35 px-[var(--gutter)] py-[clamp(78px,10vw,132px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <SectionNumber number="02" />
            <Reveal>
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="max-w-[900px] [text-wrap:balance] font-display text-[clamp(24px,3.8vw,55px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Seu projeto, sempre no <span className="text-azure-heading">eixo.</span>
                </h2>
                <p className="max-w-[330px] text-[15px] leading-relaxed text-ink/65">
                  Um serviço por vez, em loop automático. Toque em qualquer ícone pra pular direto pra ele.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto mt-6 aspect-square w-full max-w-[600px] sm:mt-10">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
              <span className="absolute bottom-[4%] left-[19%] h-[36%] w-[15%] -rotate-[16deg] rounded-full bg-ink/[0.07]" />
              <span className="absolute bottom-[4%] right-[19%] h-[36%] w-[15%] rotate-[16deg] rounded-full bg-ink/[0.07]" />
            </div>

            {services.map((service, index) => {
              const pos = ORBIT_POSITIONS[index % ORBIT_POSITIONS.length]!
              const isActive = activeService === index
              return (
                <motion.button
                  key={service.title}
                  type="button"
                  onClick={() => selectService(index)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={service.title}
                  className={`absolute z-10 grid size-[48px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border bg-white transition-colors duration-500 sm:size-[76px] ${
                    isActive ? 'border-azure shadow-[0_20px_50px_-24px_rgba(42,16,74,.5)]' : 'border-ink/10 shadow-[0_10px_30px_-20px_rgba(42,16,74,.3)]'
                  }`}
                  style={
                    isDesktopOrbit
                      ? { left: `${50 + pos.xSm}%`, top: `${50 + pos.ySm}%` }
                      : { left: `${50 + pos.x}%`, top: `${50 + pos.y}%` }
                  }
                  animate={
                    reduce
                      ? undefined
                      : { scale: isActive ? 1.14 : 1, y: [0, index % 2 === 0 ? -6 : 6, 0] }
                  }
                  transition={{
                    scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: 4.4 + index * 0.3, repeat: Infinity, ease: 'easeInOut' },
                  }}
                >
                  <ServiceIcon index={index} className={`size-6 transition-colors duration-500 sm:size-8 ${isActive ? 'text-azure' : 'text-ink/40'}`} />
                </motion.button>
              )
            })}

            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <ServicePhone active={activeService} reduce={!!reduce} />
            </div>
          </div>

          <div className="relative mt-10 flex flex-col items-center text-center sm:mt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-azure-label">
                  0{activeService + 1} / 0{services.length}
                </p>
                <h3 className="mt-2 font-display text-[clamp(20px,3.2vw,34px)] font-black uppercase tracking-[-0.02em] text-ink">
                  {services[activeService]!.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-ink/60 sm:text-[15px]">
                  {services[activeService]!.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="portfolio" className="scroll-mt-24 bg-ink px-[var(--gutter)] py-[clamp(82px,10vw,140px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <div className="flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              <span className="h-px w-10 bg-white/20" />
              03
            </div>
            <Reveal>
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="max-w-[980px] [text-wrap:balance] font-display text-[clamp(24px,3.8vw,55px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Marcas e histórias que ganharam <span className="text-azure">forma.</span>
                </h2>
                <p className="max-w-[290px] text-[14px] leading-relaxed text-white/55">Projetos reais de comunicação, identidade e conteúdo.</p>
              </div>
            </Reveal>
          </div>

          <RevealGroup className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
            {projects.map((project, index) => (
              <RevealItem key={`${project.client}-${index}`}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                    <Image
                      src={project.src}
                      alt={project.alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className={`${project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                      style={{ objectPosition: project.position }}
                    />
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 z-10 grid size-10 -translate-x-1/2 -translate-y-1/2 rotate-[-24deg] place-items-center bg-azure opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-100"
                    >
                      <Image src="/eixo-symbol.png" alt="" width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 to-transparent p-3 pt-16">
                      <div>
                        <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/60">{project.tags}</p>
                        <h3 className="mt-1.5 font-display text-[15px] font-bold leading-[1.15] tracking-[-0.01em]">{project.client}</h3>
                      </div>
                      <span className="grid size-7 shrink-0 place-items-center border border-white/35 text-xs transition-colors group-hover:border-azure group-hover:bg-azure">↗</span>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-[clamp(76px,9vw,126px)] border-t border-white/15 pt-10">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-azure">Portfólio em movimento</p>
                  <h3 className="mt-4 max-w-[820px] [text-wrap:balance] font-display text-[clamp(21px,3.1vw,43px)] font-black uppercase leading-[1] tracking-[-0.035em]">
                    Histórias que também ganham <span className="text-azure">ritmo.</span>
                  </h3>
                </div>
                <p className="max-w-[300px] text-[14px] leading-relaxed text-white/55">
                  Os seis vídeos do portfólio reunidos em uma seleção de conteúdo vertical, turismo, apresentação e cobertura.
                </p>
              </div>
            </Reveal>

            <VideoPortfolioGrid />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-ink/10 bg-azure py-7 text-ink">
        <div className={`eixo-service-marquee flex w-max items-center ${reduce ? '' : 'will-change-transform'}`}>
          {duplicatedServices.map((service, index) => (
            <div key={`${service.title}-${index}`} className="flex items-center">
              <span className="px-5 font-display text-[clamp(19px,2.8vw,40px)] font-black uppercase leading-none tracking-[-0.025em]">{service.title}</span>
              <span className="text-[clamp(14px,2.2vw,31px)] text-ink">✦</span>
            </div>
          ))}
        </div>
      </section>

      <section id="metodo" className="scroll-mt-24 px-[var(--gutter)] py-[clamp(82px,11vw,148px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <SectionNumber number="04" />
            <Reveal>
              <h2 className="max-w-[1050px] [text-wrap:balance] font-display text-[clamp(24px,3.8vw,55px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                Criatividade precisa de <span className="text-azure-heading">processo.</span>
              </h2>
            </Reveal>
          </div>
          <RevealGroup className="mt-12 grid gap-px bg-ink/15 md:grid-cols-2 xl:grid-cols-4">
            {methodSteps.map((step, index) => (
              <RevealItem key={step.key} className="h-full">
                <article className="flex h-full min-h-[330px] flex-col bg-[#fffdfa] p-7 transition-colors duration-300 hover:bg-lavanda">
                  <span className="font-mono text-[10px] text-azure-label">0{index + 1}</span>
                  <h3 className="mt-6 font-display text-[30px] font-black leading-[1.08] tracking-[-0.02em]">{step.label}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-ink/65">{step.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="border border-ink/12 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-ink/65">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-ink/10 px-[var(--gutter)] py-[clamp(80px,10vw,132px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionNumber number="05" />
              <Reveal>
                <h2 className="mt-8 max-w-[820px] [text-wrap:balance] font-display text-[clamp(22px,3.3vw,47px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Identidades que já passaram pelo nosso <span className="text-azure-heading">eixo.</span>
                </h2>
              </Reveal>
            </div>
            <p className="max-w-[320px] text-[14px] leading-relaxed text-ink/65">Seleção de marcas e sistemas visuais presentes no portfólio.</p>
          </div>
          <div className="mt-11 grid grid-cols-2 border-l border-t border-ink/10 sm:grid-cols-4">
            {marks.map((mark) => (
              <div key={mark.src} className="relative aspect-square border-b border-r border-ink/10 bg-white p-2">
                <Image src={mark.src} alt={mark.alt} fill sizes="25vw" className="object-contain grayscale transition-all duration-500 hover:grayscale-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contato" className="scroll-mt-24 bg-ink px-[var(--gutter)] pb-8 pt-[clamp(88px,11vw,150px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-azure">Próximo projeto</p>
          <h2 className="mt-6 max-w-[1250px] [text-wrap:balance] font-display text-[clamp(29px,5.2vw,80px)] font-black uppercase leading-[0.9] tracking-[-0.05em] max-sm:leading-[0.96] max-sm:tracking-[-0.035em]">
            Vamos fazer sua marca <span className="text-azure">aparecer.</span>
          </h2>
          <div className="mt-14 flex flex-col justify-between gap-8 border-t border-white/15 pt-8 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-azure px-6 py-3.5 text-[13px] font-bold text-ink transition-colors hover:bg-white">
                Falar no WhatsApp ↗
              </a>
              <a href={mailtoUrl} className="border border-white/25 px-6 py-3.5 text-[13px] font-bold transition-colors hover:border-white">
                {contactInfo.email}
              </a>
            </div>
            <a href="#top" className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white">Voltar ao topo ↑</a>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/60 sm:flex-row">
            <span>© 2026 Eixo de Marca — Brasil</span>
            <span>Estratégia · criação · gestão</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
