'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
    src: '/portfolio-media/identidade-vista-bajeko.png',
    alt: 'Identidade visual Vista Bajeko',
    client: 'Vista Bajeko',
    tags: 'Marca · Identidade visual',
    fit: 'contain' as const,
    position: 'center',
  },
  {
    type: 'video' as const,
    src: '/portfolio-media/video-estetica.mp4',
    poster: '/portfolio-media/video-estetica-poster.jpg',
    alt: 'Vídeo vertical de procedimento estético',
    client: 'Conteúdo vertical',
    tags: 'Captação · Edição de vídeo',
    fit: 'cover' as const,
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
    src: '/portfolio-media/portfolio-eixo.png',
    alt: 'Peça da Eixo de Marca sobre direção de conteúdo',
    client: 'Eixo de Marca',
    tags: 'Posicionamento · Design',
    fit: 'cover' as const,
    position: 'center 50%',
  },
]

const marks = [
  { src: '/portfolio-media/marca-eixo.png', alt: 'Eixo de Marca' },
  { src: '/portfolio-media/identidade-vista-bajeko.png', alt: 'Vista Bajeko' },
  { src: '/portfolio-media/marca-espaco-dos-anjos.png', alt: 'Espaço dos Anjos' },
  { src: '/portfolio-media/marca-laura-anjos.png', alt: 'Laura Anjos' },
  { src: '/portfolio-media/marca-viva-angra.png', alt: 'Viva Angra' },
  { src: '/portfolio-media/marca-luciane-judice.png', alt: 'Luciane Júdice' },
  { src: '/portfolio-media/marca-itamang.png', alt: 'Itamang' },
  { src: '/portfolio-media/marca-bm.png', alt: 'Big Mateus' },
]

const serviceImages = [
  '/portfolio-media/social-acai.webp',
  '/portfolio-media/design-ukimports.webp',
  '/portfolio-media/identidade-vista-bajeko.png',
  '/portfolio-media/video-estetica-poster.jpg',
  '/portfolio-media/gestao-producao.webp',
  '/portfolio-media/landing-pousada.webp',
  '/portfolio-media/trafego-itamang.webp',
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

export default function EixoEditorialSite() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const duplicatedMedia = [...mediaStrip, ...mediaStrip]
  const duplicatedServices = [...services, ...services]

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 72)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#fffdfa] text-ink">
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

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex bg-azure text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 sm:text-[13px] ${
              scrolled ? 'px-4 py-2' : 'px-4 py-2.5 sm:px-5'
            }`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))' }}
          >
            Vamos conversar ↗
          </a>
        </div>
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
            className="mx-auto max-w-[1250px] font-display text-[clamp(52px,9.2vw,142px)] font-black uppercase leading-[0.82] tracking-[-0.075em] max-sm:text-[44px] max-sm:leading-[0.88] max-sm:tracking-[-0.06em]"
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
                  sizes="285px"
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
              <h2 className="max-w-[1180px] text-right font-display text-[clamp(42px,6.8vw,104px)] font-black uppercase leading-[0.92] tracking-[-0.055em]">
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

      <section id="servicos" className="scroll-mt-24 border-t border-ink/10 px-[var(--gutter)] py-[clamp(78px,10vw,132px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <SectionNumber number="02" />
            <Reveal>
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="max-w-[900px] font-display text-[clamp(44px,7vw,102px)] font-black uppercase leading-[0.88] tracking-[-0.06em]">
                  Tudo o que a marca precisa para <span className="text-azure">aparecer.</span>
                </h2>
                <p className="max-w-[330px] text-[15px] leading-relaxed text-ink/55">
                  Da ideia à entrega, cada frente se conecta à próxima para o trabalho ganhar consistência.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 border-t border-ink/15">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                className="group relative grid min-h-[132px] items-center gap-6 overflow-hidden border-b border-ink/15 py-6 transition-colors duration-500 hover:bg-lavanda/55 sm:grid-cols-[70px_1fr_1fr_170px]"
                initial={reduce ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: index * 0.025 }}
              >
                <span className="font-mono text-[11px] text-azure">0{index + 1}</span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-[190px] top-1/2 hidden size-9 -translate-y-1/2 place-items-center font-display text-[26px] font-black text-azure opacity-0 transition-all duration-500 group-hover:rotate-90 group-hover:opacity-100 xl:grid"
                >
                  ×
                </span>
                <h3 className="font-display text-[clamp(30px,4vw,58px)] font-black leading-none tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-3">
                  {service.title}
                </h3>
                <p className="max-w-[48ch] text-[13px] leading-relaxed text-ink/55 sm:text-[14px]">{service.text}</p>
                <div className="relative hidden h-[96px] overflow-hidden bg-lavanda sm:block">
                  <Image
                    src={serviceImages[index]!}
                    alt=""
                    fill
                    sizes="170px"
                    className="object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="scroll-mt-24 bg-ink px-[var(--gutter)] py-[clamp(82px,10vw,140px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <div className="flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
              <span className="h-px w-10 bg-white/20" />
              03
            </div>
            <Reveal>
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="max-w-[980px] font-display text-[clamp(44px,7vw,102px)] font-black uppercase leading-[0.88] tracking-[-0.06em]">
                  Marcas e histórias que ganharam <span className="text-azure">forma.</span>
                </h2>
                <p className="max-w-[290px] text-[14px] leading-relaxed text-white/55">Projetos reais de comunicação, identidade e conteúdo.</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={`${project.client}-${index}`} delay={(index % 3) * 0.06}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                    {project.type === 'video' ? (
                      <video
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        autoPlay={!reduce}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={project.poster}
                        aria-label={project.alt}
                      >
                        <source src={project.src} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={project.src}
                        alt={project.alt}
                        fill
                        sizes="(min-width: 1280px) 32vw, (min-width: 768px) 50vw, 100vw"
                        className={`${project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                        style={{ objectPosition: project.position }}
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 z-10 grid size-14 -translate-x-1/2 -translate-y-1/2 rotate-[-24deg] place-items-center bg-azure font-display text-xl font-black text-white opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-100"
                    >
                      X
                    </span>
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 to-transparent p-5 pt-24">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/60">{project.tags}</p>
                        <h3 className="mt-2 font-display text-[24px] font-bold">{project.client}</h3>
                      </div>
                      <span className="grid size-10 place-items-center border border-white/35 text-sm transition-colors group-hover:border-azure group-hover:bg-azure">↗</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-ink/10 bg-azure py-7 text-white">
        <div className={`eixo-service-marquee flex w-max items-center ${reduce ? '' : 'will-change-transform'}`}>
          {duplicatedServices.map((service, index) => (
            <div key={`${service.title}-${index}`} className="flex items-center">
              <span className="px-5 font-display text-[clamp(34px,5vw,72px)] font-black uppercase tracking-[-0.04em]">{service.title}</span>
              <span className="text-[clamp(26px,4vw,56px)] text-ink">✦</span>
            </div>
          ))}
        </div>
      </section>

      <section id="metodo" className="scroll-mt-24 px-[var(--gutter)] py-[clamp(82px,11vw,148px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 lg:grid-cols-[160px_1fr]">
            <SectionNumber number="04" />
            <Reveal>
              <h2 className="max-w-[1050px] font-display text-[clamp(44px,7vw,102px)] font-black uppercase leading-[0.88] tracking-[-0.06em]">
                Criatividade precisa de <span className="text-azure">processo.</span>
              </h2>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-px bg-ink/15 md:grid-cols-2 xl:grid-cols-4">
            {methodSteps.map((step, index) => (
              <Reveal key={step.key} className="h-full" delay={index * 0.05}>
                <article className="flex h-full min-h-[330px] flex-col bg-[#fffdfa] p-7 transition-colors duration-300 hover:bg-lavanda">
                  <span className="font-mono text-[10px] text-azure">0{index + 1}</span>
                  <h3 className="mt-auto font-display text-[30px] font-black tracking-[-0.035em]">{step.label}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-ink/55">{step.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="border border-ink/12 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-ink/55">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 px-[var(--gutter)] py-[clamp(80px,10vw,132px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionNumber number="05" />
              <Reveal>
                <h2 className="mt-8 max-w-[820px] font-display text-[clamp(40px,6vw,86px)] font-black uppercase leading-[0.9] tracking-[-0.055em]">
                  Identidades que já passaram pelo nosso <span className="text-azure">eixo.</span>
                </h2>
              </Reveal>
            </div>
            <p className="max-w-[320px] text-[14px] leading-relaxed text-ink/50">Seleção de marcas e sistemas visuais presentes no portfólio.</p>
          </div>
          <div className="mt-11 grid grid-cols-2 border-l border-t border-ink/10 sm:grid-cols-4">
            {marks.map((mark) => (
              <div key={mark.src} className="relative aspect-square border-b border-r border-ink/10 bg-white p-5">
                <Image src={mark.src} alt={mark.alt} fill sizes="25vw" className="object-contain p-8 grayscale transition-all duration-500 hover:grayscale-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contato" className="scroll-mt-24 bg-ink px-[var(--gutter)] pb-8 pt-[clamp(88px,11vw,150px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-azure">Próximo projeto</p>
          <h2 className="mt-6 max-w-[1250px] font-display text-[clamp(54px,9.5vw,146px)] font-black uppercase leading-[0.8] tracking-[-0.075em]">
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
