'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { gsap, useGSAP, ScrollTrigger } from '@/lib/registerGsap'
import { isMobileViewport, prefersReducedMotion } from '@/lib/capability'
import { services } from '@/lib/data'
import { MOBILE_MQ } from '@/lib/mobileMotion'

const STEPS = services.length
const SCREENS_PER_STEP = 0.82

const SERVICE_META = [
  {
    eyebrow: 'Planejar · Publicar · Aproximar',
    screen: 'Conteúdo em movimento',
    keywords: ['Calendário', 'Feed', 'Campanhas'],
  },
  {
    eyebrow: 'Criar · Lançar · Destacar',
    screen: 'Peças com linguagem própria',
    keywords: ['Campanhas', 'Peças', 'Direção'],
  },
  {
    eyebrow: 'Organizar · Reconhecer · Marcar',
    screen: 'Sistema visual',
    keywords: ['Marca', 'Identidade', 'Consistência'],
  },
  {
    eyebrow: 'Captar · Editar · Prender',
    screen: 'Ritmo para a tela',
    keywords: ['Reels', 'Takes', 'Vertical'],
  },
  {
    eyebrow: 'Organizar · Conectar · Entregar',
    screen: 'Fluxo do projeto',
    keywords: ['Tarefas', 'Prazos', 'Processos'],
  },
  {
    eyebrow: 'Apresentar · Captar · Converter',
    screen: 'Página estratégica',
    keywords: ['Oferta', 'Contato', 'Conversão'],
  },
  {
    eyebrow: 'Alcançar · Medir · Otimizar',
    screen: 'Mídia em evolução',
    keywords: ['Público', 'Campanha', 'Resultados'],
  },
] as const

type Service = (typeof services)[number]

const cardVariants: Variants = {
  enter: ({ side, direction }: { side: number; direction: number }) => ({
    opacity: 0,
    x: side * (direction >= 0 ? 120 : 72),
    y: 24,
    rotate: side * 2.5,
    scale: 0.94,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
  exit: ({ side, direction }: { side: number; direction: number }) => ({
    opacity: 0,
    x: -side * (direction >= 0 ? 92 : 120),
    y: -18,
    rotate: -side * 2,
    scale: 0.96,
    transition: { duration: 0.38, ease: [0.7, 0, 0.84, 0] },
  }),
}

function SocialScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-ink">
      <Image
        src="/portfolio-media/social-acai.webp"
        alt="Peça de conteúdo criada para a Di Casa Açaí"
        fill
        sizes="250px"
        className="object-cover"
      />
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent px-3 pb-8 pt-3">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className={`size-7 rounded-full border-2 ${item === 0 ? 'border-azure bg-azure/40' : 'border-white/70 bg-white/20'}`} />
        ))}
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between bg-ink/88 px-3 py-2 text-white backdrop-blur">
        <span className="font-mono text-[7px] uppercase tracking-[0.14em]">Conteúdo real</span>
        <span className="size-1.5 rounded-full bg-azure" />
      </div>
    </div>
  )
}

function DesignScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-ink">
      <Image
        src="/portfolio-media/design-ukimports.webp"
        alt="Peça de campanha criada para a UK Imports"
        fill
        sizes="250px"
        className="object-cover"
      />
      <div className="absolute inset-3 border border-white/55">
        <span className="absolute left-0 top-0 bg-ink px-2 py-1 font-mono text-[6px] uppercase tracking-[0.16em] text-white">
          Artboard / campanha
        </span>
      </div>
    </div>
  )
}

function IdentityScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-[#063f54]">
      <Image
        src="/portfolio-media/identidade-vista-bajeko.png"
        alt="Identidade visual criada para a Vista Bajeko"
        fill
        sizes="250px"
        className="object-contain"
      />
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between border border-white/20 bg-black/20 px-3 py-2 text-white backdrop-blur">
        <span className="font-mono text-[7px] uppercase tracking-[0.14em]">Identidade aplicada</span>
        <span className="h-px w-6 bg-[#e9b46f]" />
      </div>
    </div>
  )
}

function VideoScreen({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative h-full overflow-hidden bg-ink text-white">
      <video
        className="h-full w-full object-cover"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/portfolio-media/video-estetica-poster.jpg"
        aria-label="Vídeo vertical de procedimento estético editado para o portfólio"
      >
        <source src="/portfolio-media/video-estetica.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      {reduce ? (
        <motion.span
          className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-azure text-lg"
        >
          ▶
        </motion.span>
      ) : null}
      <motion.span
        className="absolute bottom-4 left-3 block h-0.5 bg-azure"
        animate={reduce ? { width: '62%' } : { width: ['8%', 'calc(100% - 24px)', '8%'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function ProjectScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-ink">
      <Image
        src="/portfolio-media/gestao-producao.webp"
        alt="Felipe Júdice trabalhando em uma produção audiovisual"
        fill
        sizes="250px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-1.5">
        {['Briefing', 'Produção', 'Entrega'].map((item, index) => (
          <span key={item} className={`px-1.5 py-2 text-center text-[6px] font-bold uppercase ${index === 1 ? 'bg-azure text-white' : 'bg-white/90 text-ink'}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function LandingScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-white">
      <Image
        src="/portfolio-media/landing-pousada.webp"
        alt="Peça de turismo criada para a Pousada da Praia"
        fill
        sizes="250px"
        className="object-cover"
      />
      <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 bg-ink px-3">
        <span className="size-1.5 rounded-full bg-azure" />
        <span className="size-1.5 rounded-full bg-white/30" />
        <span className="size-1.5 rounded-full bg-white/30" />
      </div>
      <div className="absolute inset-x-3 bottom-3 bg-paper/92 p-3 backdrop-blur">
        <span className="font-mono text-[6px] uppercase tracking-[0.16em] text-azure">Experiência + destino</span>
        <div className="mt-2 inline-flex bg-ink px-3 py-2 text-[7px] font-bold text-white">CONHECER →</div>
      </div>
    </div>
  )
}

function AdsScreen({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative h-full overflow-hidden bg-ink text-white">
      <Image
        src="/portfolio-media/trafego-itamang.webp"
        alt="Peça comercial criada para a Itamang"
        fill
        sizes="250px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
      <div className="absolute left-3 right-3 top-3 flex items-center justify-between bg-ink/70 px-3 py-2 backdrop-blur">
        <span className="font-mono text-[6px] uppercase tracking-[0.15em]">Campanha ativa</span>
        <motion.span
          className="size-2 rounded-full bg-azure"
          animate={reduce ? undefined : { boxShadow: ['0 0 0 0 rgba(255,102,92,.6)', '0 0 0 8px rgba(255,102,92,0)'] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </div>
      <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
        <div className="bg-white/90 p-2 text-ink">
          <span className="font-mono text-[6px] uppercase text-ink/45">Público</span>
          <p className="mt-1 text-[9px] font-bold">Segmentado</p>
        </div>
        <div className="bg-azure p-2 text-white">
          <span className="font-mono text-[6px] uppercase text-white/60">Rota</span>
          <p className="mt-1 text-[9px] font-bold">Otimizada</p>
        </div>
      </div>
    </div>
  )
}

function ActivePhoneScreen({ index, reduce }: { index: number; reduce: boolean }) {
  switch (index) {
    case 0:
      return <SocialScreen />
    case 1:
      return <DesignScreen />
    case 2:
      return <IdentityScreen />
    case 3:
      return <VideoScreen reduce={reduce} />
    case 4:
      return <ProjectScreen />
    case 5:
      return <LandingScreen />
    case 6:
      return <AdsScreen reduce={reduce} />
    default:
      return null
  }
}

function Phone({ active, reduce, compact = false }: { active: number; reduce: boolean; compact?: boolean }) {
  const service = services[active]!
  const meta = SERVICE_META[active]!
  return (
    <motion.div
      className={`relative shrink-0 rounded-[46px] bg-[#100618] p-[9px] shadow-[0_44px_90px_-34px_rgba(42,16,74,.72)] ${
        compact ? 'h-[410px] w-[205px]' : 'h-[500px] w-[250px]'
      }`}
      animate={reduce ? undefined : { rotate: active % 2 === 0 ? -2.2 : 2.2, y: active % 2 === 0 ? -5 : 5 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="absolute -right-1 top-[105px] h-16 w-1 rounded-r bg-azure" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[38px] bg-paper">
        <div className="relative flex h-[58px] shrink-0 items-end justify-between px-5 pb-3">
          <span className="text-[9px] font-bold text-ink">EIXO</span>
          <span className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-[#100618]" />
          <span className="font-mono text-[7px] text-ink/45">0{active + 1} / 0{STEPS}</span>
        </div>
        <div className="px-4">
          <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-azure">{meta.screen}</p>
          <h4 className="mt-1 min-h-[44px] font-display text-[20px] font-black leading-[0.95] tracking-[-0.035em] text-ink">
            {service.title}
          </h4>
        </div>
        <div className="relative mx-4 mt-3 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ActivePhoneScreen index={active} reduce={reduce} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex h-12 shrink-0 items-center justify-center gap-1.5">
          {services.map((item, index) => (
            <span key={item.title} className={`h-1 rounded-full transition-all duration-300 ${index === active ? 'w-5 bg-azure' : 'w-1 bg-ink/15'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ServiceCard({ service, index, mobile = false }: { service: Service; index: number; mobile?: boolean }) {
  const meta = SERVICE_META[index]!
  return (
    <article
      className={`relative bg-paper text-ink shadow-[0_30px_80px_-42px_rgba(42,16,74,.5)] ${
        mobile ? 'w-[88%] max-w-[340px] p-6' : 'w-full max-w-[420px] p-8 xl:p-10'
      }`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))' }}
    >
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-azure">0{index + 1} / 0{STEPS}</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">Serviço ativo</span>
      </div>
      <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-azure">{meta.eyebrow}</p>
      <h3 className={`mt-3 font-display font-black leading-[0.9] tracking-[-0.045em] ${mobile ? 'text-[34px]' : 'text-[clamp(42px,4.8vw,68px)]'}`}>
        {service.title}
      </h3>
      <p className="mt-5 max-w-[40ch] text-[14px] leading-[1.6] text-ink/65">{service.text}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {meta.keywords.map((keyword) => (
          <li key={keyword} className="border border-ink/12 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/60">
            {keyword}
          </li>
        ))}
      </ul>
    </article>
  )
}

function ProgressRail({ active }: { active: number }) {
  return (
    <div className="absolute inset-x-[8%] bottom-4 flex items-center gap-3" aria-hidden>
      {services.map((service, index) => (
        <div key={service.title} className="flex flex-1 items-center gap-2">
          <span className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 ${index <= active ? 'bg-azure' : 'bg-ink/20'}`} />
          <span className={`h-px flex-1 transition-colors duration-300 ${index < active ? 'bg-azure/60' : 'bg-ink/10'}`} />
        </div>
      ))}
    </div>
  )
}

function StaticServices() {
  return (
    <div className="mx-auto max-w-[var(--maxw)] px-[var(--gutter)] py-20">
      <div className="mb-12 text-center">
        <p className="section-eyebrow mb-3 justify-center">Como atuamos</p>
        <h2 className="section-title text-ink">Seu projeto, na tela.</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>
    </div>
  )
}

function MobileServices({ active, reduce }: { active: number; reduce: boolean }) {
  return (
    <div className="mx-auto max-w-[520px] px-[var(--gutter)]">
      <div className="mb-4 text-center">
        <p className="section-eyebrow mb-3 justify-center">Como atuamos</p>
        <h2 className="section-title text-ink">Seu projeto, na tela.</h2>
        <p className="mx-auto mt-4 max-w-[34ch] text-[14px] leading-relaxed text-ink/60">
          Role para explorar cada serviço da Eixo.
        </p>
      </div>
      <div className="relative">
        <div className="sticky top-[92px] z-10 flex h-[500px] items-start justify-center pt-8">
          <Phone active={active} reduce={reduce} compact />
        </div>
        <div className="relative z-20 -mt-20 flex flex-col gap-[34vh] pb-[30vh]">
          {services.map((service, index) => (
            <div
              key={service.title}
              data-service-card
              data-service-index={index}
              className={`flex min-h-[52vh] items-end ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <ServiceCard service={service} index={index} mobile />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WorkLusion() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const lastRef = useRef(0)
  const reduce = !!useReducedMotion()
  const current = services[active]!
  const side = active % 2 === 0 ? -1 : 1

  useGSAP(
    () => {
      if (isMobileViewport() || prefersReducedMotion()) return

      ScrollTrigger.create({
        id: 'work-services',
        trigger: root.current ?? undefined,
        start: 'top top',
        end: () => '+=' + window.innerHeight * SCREENS_PER_STEP * STEPS,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        refreshPriority: -10,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.min(STEPS - 1, Math.max(0, Math.floor(self.progress * STEPS)))
          if (index !== lastRef.current) {
            setDirection(index > lastRef.current ? 1 : -1)
            lastRef.current = index
            setActive(index)
          }
        },
        onLeaveBack: () => {
          lastRef.current = 0
          setDirection(-1)
          setActive(0)
        },
      })
    },
    { scope: root }
  )

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOBILE_MQ, () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]')
        cards.forEach((card, index) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 62%',
            end: 'bottom 38%',
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          })
          if (!prefersReducedMotion()) {
            gsap.from(card, {
              x: index % 2 === 0 ? -36 : 36,
              autoAlpha: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            })
          }
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section
      id="work"
      ref={root}
      className="relative isolate z-10 overflow-hidden bg-bone max-lg:py-[clamp(64px,10vw,92px)] lg:h-screen"
    >
      {reduce && !isMobileViewport() ? (
        <StaticServices />
      ) : (
        <>
          <div className="hidden h-full lg:block">
            <div className="absolute inset-0">
              <span className="absolute -left-[2vw] top-[13vh] font-display text-[clamp(90px,16vw,230px)] font-black leading-none tracking-[-0.08em] text-ink/[0.035]">
                SERVIÇOS
              </span>
              <span className="absolute left-1/2 top-1/2 h-[76vh] w-[76vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/[0.07]" />
              <span className="absolute left-1/2 top-1/2 h-[54vh] w-[54vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-azure/20" />
            </div>

            <div className="relative mx-auto flex h-full max-w-[var(--maxw)] flex-col px-[var(--gutter)] pb-8 pt-[112px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="section-eyebrow">Como atuamos</p>
                  <h2 className="mt-3 font-display text-[clamp(32px,4vw,58px)] font-black leading-[0.95] tracking-[-0.045em] text-ink">
                    Seu projeto,
                    <br />
                    <span className="text-azure">na tela.</span>
                  </h2>
                </div>
                <div className="max-w-[250px] text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">Role para explorar</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink/55">O celular permanece no eixo. Cada serviço muda a experiência.</p>
                </div>
              </div>

              <div className="relative min-h-0 flex-1">
                <motion.div
                  className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-[47%]"
                  animate={reduce ? undefined : { x: side * 12 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -z-10 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-azure/20"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  >
                    <span className="absolute left-1/2 top-[-5px] size-2.5 -translate-x-1/2 rounded-full bg-azure" />
                    <span className="absolute bottom-[35px] right-[28px] size-1.5 rounded-full bg-ink/35" />
                  </motion.span>
                  <Phone active={active} reduce={reduce} />
                </motion.div>

                <AnimatePresence custom={{ side, direction }} initial={false} mode="wait">
                  <motion.div
                    key={active}
                    custom={{ side, direction }}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={`absolute top-1/2 z-30 w-[min(35vw,420px)] -translate-y-1/2 ${
                      side < 0 ? 'left-[1%] xl:left-[3%]' : 'right-[1%] xl:right-[3%]'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute top-1/2 h-px w-[clamp(36px,5vw,76px)] bg-azure/45 ${
                        side < 0 ? 'left-full' : 'right-full'
                      }`}
                    >
                      <span className={`absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-azure ${side < 0 ? '-right-1' : '-left-1'}`} />
                    </span>
                    <ServiceCard service={current} index={active} />
                  </motion.div>
                </AnimatePresence>

                <div
                  className={`absolute top-[58%] z-10 max-w-[180px] transition-all duration-500 ${
                    side < 0 ? 'right-[5%] text-right' : 'left-[5%] text-left'
                  }`}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-ink/35">Dentro da tela</p>
                  <p className="mt-2 font-display text-[17px] font-bold leading-tight text-ink/55">{SERVICE_META[active]!.screen}</p>
                </div>
              </div>

              <ProgressRail active={active} />
            </div>
          </div>

          <div className="lg:hidden">
            <MobileServices active={active} reduce={reduce} />
          </div>
        </>
      )}
    </section>
  )
}
