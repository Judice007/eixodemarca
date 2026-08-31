'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { methodSteps, services } from '@/lib/data'
import { identities } from '@/lib/portfolio'
import Link from 'next/link'
import ServiceOrbit from '@/components/hero/ServiceOrbit'
import MethodAxis from '@/components/MethodAxis'
import PontoCegoCta from '@/components/PontoCegoCta'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArtGallery from '@/components/portfolio/ArtGallery'
import VideoMosaic from '@/components/portfolio/VideoMosaic'
import { Reveal, SectionNumber } from '@/components/reveal'
import KineticGrid from '@/components/ui/kinetic-grid'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'
import WorkSphere from '@/components/visual/WorkSphere'
import { projects } from '@/lib/portfolio'

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

// Artes + marcas reais viram as bolhas da esfera da seção 01. As marcas são
// 1:1 e recortam redondo sem perder nada; as artes 4:5 entram por object-cover.
const sphereImages = [
  ...identities.map((identity) => ({ src: identity.src, alt: identity.alt })),
  ...projects.map((project) => ({ src: project.src, alt: project.alt })),
]

export default function EixoEditorialSite() {
  const reduce = useReducedMotion()
  const duplicatedServices = [...services, ...services]

  return (
    <main id="top" className="min-h-screen bg-[#fffdfa] text-ink">
      <SiteHeader />

      <section className="relative">
        {/* Fundo interativo: grade que se distorce perto do cursor e ondula
            no clique, recolorida pra paleta do Eixo (ink + coral) em vez do
            azul padrão do componente. Hero virou um bloco escuro por causa
            disso — todo o texto abaixo foi reajustado pra contraste em fundo
            escuro (antes assumia o fundo creme do resto do site). */}
        <KineticGrid
          globalColor="brand"
          className="flex min-h-[100svh] flex-col justify-between px-[var(--gutter)] pb-0 pt-[clamp(130px,18vh,190px)]"
        >
          {/* Texto alinhado à esquerda no desktop, centralizado abaixo de lg.
              O mascote 3D que ficava à direita saiu: o runtime da Spline
              custava 1,4 MB de JS e um contexto WebGL vivo por um robô
              decorativo, que nem era o panda da marca. */}
          <div className="mx-auto flex w-full max-w-[1420px] flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="w-full text-center lg:flex-1 lg:text-left">
              <motion.p
                className="mx-auto mb-4 w-fit border border-white/20 px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70 lg:mx-0"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Sua marca fora do automático
              </motion.p>
              <motion.div
                className="mx-auto mb-7 w-fit lg:mx-0"
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <PontoCegoCta variant="outline" />
              </motion.div>
              <motion.h1
                className="mx-auto max-w-[1250px] [text-wrap:balance] font-display text-[clamp(28px,5vw,78px)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-paper max-sm:text-[24px] max-sm:leading-[0.96] max-sm:tracking-[-0.035em] lg:mx-0"
                initial={reduce ? false : { opacity: 0, y: 45 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="block whitespace-nowrap">Conteúdo que</span>
                <span className="block whitespace-nowrap text-azure">chama atenção.</span>
              </motion.h1>
              <motion.div
                className="mx-auto mt-9 flex max-w-[900px] flex-col items-center justify-between gap-6 md:flex-row lg:mx-0"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.18 }}
              >
                <p className="max-w-[590px] text-[15px] leading-relaxed text-white/65 md:text-left md:text-[17px]">
                  Unimos social media, design, vídeo e organização para transformar ideias em presença digital — e tirar cada projeto do papel.
                </p>
                <a
                  href="#portfolio"
                  className="inline-flex shrink-0 items-center gap-3 bg-azure px-6 py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-white"
                >
                  Ver projetos <span aria-hidden>↓</span>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Carrossel 3D no lugar da faixa que rolava sozinha — mesmas 9
              imagens reais do portfólio, agora navegável (arrasta ou usa as
              setas) em vez de só decorativo. */}
          <div className="relative mt-[clamp(28px,5vh,60px)] pb-6">
            <CoverflowCarousel
              slides={mediaStrip}
              showNavigation
              autoplayMs={3200}
              label="Trabalhos do Eixo de Marca"
              cardClassName="bg-[#1d0b35]"
            />
          </div>
        </KineticGrid>
      </section>

      {/* Seção 01: esfera de trabalhos girando atrás, texto entrando em fade
          por cima. Fundo escuro de propósito — a profundidade das bolhas (as
          de trás apagam) só lê contra o escuro; no creme antigo elas sumiam.
          O scrim radial no meio segura o contraste do texto. */}
      <section className="relative isolate overflow-hidden border-t border-white/10 bg-ink px-[var(--gutter)] py-[clamp(120px,15vw,200px)] text-white">
        {/* No mobile a esfera desce pro rodapé da seção (o texto ocupa quase
            toda a altura) e fica mais apagada; no desktop ela sobe pro centro
            e vai pra direita, ao lado do texto. */}
        <WorkSphere
          images={sphereImages}
          className="opacity-45 [--sphere-x:50%] [--sphere-y:86%] lg:opacity-100 lg:[--sphere-x:74%] lg:[--sphere-y:50%]"
        />
        {/* Escurece só a faixa da esquerda, onde o texto vive. Um scrim radial
            no meio apagava justamente as bolhas maiores da frente, que são o
            ponto do efeito. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(23,10,42,.96) 0%, rgba(23,10,42,.9) 34%, rgba(23,10,42,.55) 56%, transparent 78%)',
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1420px] flex-col gap-6">
          <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            <span className="h-px w-10 bg-white/25" />
            01
          </div>
          <div>
            <Reveal>
              {/* Medida mais estreita que antes (era 1180px): mantém o texto
                  na metade esquerda, longe do miolo da esfera. */}
              <h2 className="max-w-[880px] [text-shadow:0_2px_20px_rgba(23,10,42,.95)] [text-wrap:balance] font-display text-[clamp(23px,3.4vw,50px)] font-black uppercase leading-[0.98] tracking-[-0.035em] text-paper max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                Aqui tudo começa com <span className="text-azure">direção.</span> Entregamos comunicação pensada, não apenas automática.
              </h2>
            </Reveal>
            <Reveal className="mt-12 max-w-[720px]" delay={0.08}>
              <p className="text-[16px] leading-[1.7] text-white/70 [text-shadow:0_2px_16px_rgba(23,10,42,.95)] sm:text-[19px]">
                Estratégia, criatividade e processo trabalhando juntos. Cada escolha precisa reforçar a marca, aproximar pessoas e conduzir o projeto para uma entrega clara.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ServiceOrbit />

      <section id="portfolio" className="scroll-mt-24 bg-ink px-[var(--gutter)] py-[clamp(82px,10vw,140px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          {/* Galeria de cards flutuantes no lugar do corredor + coluna fixa +
              grade que existiam aqui: a peça inclina com o cursor e abre no
              clique. Cabeçalho volta a ser uma faixa normal no topo, já que a
              coluna sticky saiu junto. */}
          <div className="flex flex-col gap-6">
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

          <ArtGallery />

          <div className="mt-[clamp(76px,9vw,126px)] border-t border-white/15 pt-10">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-azure-on-dark">Portfólio em movimento</p>
                  {/* h2, não h3: é título de seção e vinha depois dos h3 dos
                      cards de projeto, quebrando a hierarquia do documento. */}
                  <h2 className="mt-4 max-w-[820px] [text-wrap:balance] font-display text-[clamp(21px,3.1vw,43px)] font-black uppercase leading-[1] tracking-[-0.035em]">
                    Histórias que também ganham <span className="text-azure">ritmo.</span>
                  </h2>
                </div>
                <div className="max-w-[300px]">
                  <p className="text-[14px] leading-relaxed text-white/55">
                    Os seis vídeos do portfólio reunidos em uma seleção de conteúdo vertical, turismo, apresentação e cobertura.
                  </p>
                  {/* A página dedicada de vídeos não tinha nenhuma porta de
                      entrada na home depois que as abas saíram — quem não
                      soubesse a URL não chegava nela. */}
                  <Link
                    href="/portfolio/video"
                    className="mt-4 inline-flex items-center gap-2 border-b border-azure/40 pb-1 font-sans text-[13px] font-bold text-azure-on-dark transition-colors hover:border-azure hover:text-white"
                  >
                    Ver todos os vídeos <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </Reveal>

            <VideoMosaic />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-ink/10 bg-azure py-7 text-ink">
        <div className={`eixo-service-marquee flex w-max items-center ${reduce ? '' : 'will-change-transform'}`}>
          {duplicatedServices.map((service, index) => (
            <div key={`${service.title}-${index}`} className="flex items-center">
              <span className="px-5 font-display text-[clamp(19px,2.8vw,40px)] font-black uppercase leading-none tracking-[-0.025em]">{service.title}</span>
              {/* Separador, não conteúdo — daí o aria-hidden. Em branco porque
                  o roxo sobre o vermelho novo dá 3.65:1, e a 14px isso reprova
                  (os nomes dos serviços ao lado passam por serem grandes). */}
              <span aria-hidden className="text-[clamp(14px,2.2vw,31px)] text-white">✦</span>
            </div>
          ))}
        </div>
      </section>

      <section id="metodo" className="scroll-mt-24 px-[var(--gutter)] py-[clamp(82px,11vw,148px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col gap-6">
            <SectionNumber number="04" />
            <Reveal>
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="max-w-[1050px] [text-wrap:balance] font-display text-[clamp(24px,3.8vw,55px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Criatividade precisa de <span className="text-azure-heading">processo.</span>
                </h2>
                <p className="max-w-[300px] text-[14px] leading-relaxed text-ink/65">
                  Quatro etapas, na ordem. Cada uma só começa quando a anterior deu o que a próxima precisa.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Etapas sobre um eixo que se preenche conforme a rolagem: o
              traço de coral avança e cada etapa acende quando é alcançada.
              O eixo é o nome da marca, então ele carrega o significado aqui. */}
          <MethodAxis steps={methodSteps} />
        </div>
      </section>

      {/* pb menor que o pt: a grade de marcas é a última prova de trabalho
          antes da chamada final, e o vão grande entre as duas quebrava o
          ritmo bem no ponto em que ele mais importa. */}
      <section id="identidade" className="scroll-mt-24 border-t border-ink/10 px-[var(--gutter)] pb-[clamp(48px,5vw,72px)] pt-[clamp(80px,10vw,132px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <SectionNumber number="05" />
              <Reveal>
                <h2 className="mt-8 max-w-[820px] [text-wrap:balance] font-display text-[clamp(22px,3.3vw,47px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                  Marcas criadas pelo nosso <span className="text-azure-heading">eixo.</span>
                </h2>
              </Reveal>
            </div>
            <p className="max-w-[320px] text-[14px] leading-relaxed text-ink/65">Clique numa marca pra ver a identidade visual completa.</p>
          </div>
          {/* Duas coisas mudaram aqui, ambas por bom motivo:
              1. O nome da marca é PERMANENTE. Antes só aparecia no hover — e
                 como no toque não existe hover, no celular ele nunca aparecia:
                 oito quadrados cinzas sem identificação nenhuma.
              2. Sem grayscale. Numa seção que mostra IDENTIDADE VISUAL, apagar
                 a cor apaga metade do trabalho. A "parede uniforme" que ele
                 criava custava a personalidade de cada marca.
              O acento de cada marca vira o filete que acende no hover, então a
              cor própria dela é o que responde ao cursor. */}
          <div className="mt-11 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-5">
            {identities.map((mark) => (
              <Link
                key={mark.slug}
                href={`/identidade-visual/${mark.slug}`}
                className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azure-heading"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-ink">
                  <Image
                    src={mark.src}
                    alt={mark.alt}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* filete na cor da própria marca */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ backgroundColor: mark.accent }}
                  />
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[15px] font-bold uppercase leading-tight tracking-[-0.02em]">
                    {mark.name}
                  </h3>
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-[11px] text-ink/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-azure-heading"
                  >
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
