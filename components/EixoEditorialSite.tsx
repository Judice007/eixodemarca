'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { methodSteps, services } from '@/lib/data'
import { identities } from '@/lib/portfolio'
import Link from 'next/link'
import ServiceOrbit from '@/components/hero/ServiceOrbit'
import PontoCegoCta from '@/components/PontoCegoCta'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArtGrid from '@/components/portfolio/ArtGrid'
import VideoMosaic from '@/components/portfolio/VideoMosaic'
import PortfolioTabs from '@/components/portfolio/PortfolioTabs'
import { Reveal, RevealGroup, RevealItem, SectionNumber } from '@/components/reveal'
import KineticGrid from '@/components/ui/kinetic-grid'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'
import HeroMascot from '@/components/hero/HeroMascot'

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
          {/* Texto à esquerda, mascote à direita: são irmãos no flex, então o
              robô não cobre mais o fim de "chama atenção." como cobria quando
              era absolute por cima do h1. Abaixo de lg o mascote some e o
              texto volta a ser centralizado. */}
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
                  className="inline-flex shrink-0 items-center gap-3 bg-azure px-6 py-3.5 text-[13px] font-bold text-ink transition-colors hover:bg-white"
                >
                  Ver projetos <span aria-hidden>↓</span>
                </a>
              </motion.div>
            </div>

            {!reduce && <HeroMascot />}
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

      <section className="border-t border-ink/10 px-[var(--gutter)] py-[clamp(82px,11vw,146px)]">
        <div className="mx-auto flex max-w-[1420px] flex-col gap-6">
          <SectionNumber number="01" />
          <div>
            <Reveal>
              <h2 className="max-w-[1180px] [text-wrap:balance] font-display text-[clamp(23px,3.7vw,57px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                Aqui tudo começa com <span className="text-azure-heading">direção.</span> Entregamos comunicação pensada, não apenas automática.
              </h2>
            </Reveal>
            <Reveal className="mt-12 max-w-[720px]" delay={0.08}>
              <p className="text-[16px] leading-[1.7] text-ink/60 sm:text-[19px]">
                Estratégia, criatividade e processo trabalhando juntos. Cada escolha precisa reforçar a marca, aproximar pessoas e conduzir o projeto para uma entrega clara.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ServiceOrbit />

      <section id="portfolio" className="scroll-mt-24 bg-ink px-[var(--gutter)] py-[clamp(82px,10vw,140px)] text-white">
        <div className="mx-auto max-w-[1420px]">
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
            {/* Mesmo filtro que existe nas páginas dedicadas — daqui dá pra
                pular direto pra "só artes" ou "só vídeo" sem rolar tudo. */}
            <PortfolioTabs />
          </div>

          <ArtGrid />

          <div className="mt-[clamp(76px,9vw,126px)] border-t border-white/15 pt-10">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-azure">Portfólio em movimento</p>
                  {/* h2, não h3: é título de seção e vinha depois dos h3 dos
                      cards de projeto, quebrando a hierarquia do documento. */}
                  <h2 className="mt-4 max-w-[820px] [text-wrap:balance] font-display text-[clamp(21px,3.1vw,43px)] font-black uppercase leading-[1] tracking-[-0.035em]">
                    Histórias que também ganham <span className="text-azure">ritmo.</span>
                  </h2>
                </div>
                <p className="max-w-[300px] text-[14px] leading-relaxed text-white/55">
                  Os seis vídeos do portfólio reunidos em uma seleção de conteúdo vertical, turismo, apresentação e cobertura.
                </p>
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
              <span className="text-[clamp(14px,2.2vw,31px)] text-ink">✦</span>
            </div>
          ))}
        </div>
      </section>

      <section id="metodo" className="scroll-mt-24 px-[var(--gutter)] py-[clamp(82px,11vw,148px)]">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col gap-6">
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
                {/* min-h fixo de 330px deixava ~150px mortos abaixo dos chips.
                    O h-full já iguala a altura das células da linha. */}
                <article className="flex h-full flex-col bg-[#fffdfa] p-7 transition-colors duration-300 hover:bg-lavanda">
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

      <section id="identidade" className="scroll-mt-24 border-t border-ink/10 px-[var(--gutter)] py-[clamp(80px,10vw,132px)]">
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
          {/* Os arquivos têm fundo próprio (3 escuros, 3 brancos, 1 coral). Com
              object-contain num quadro branco cada um virava um retângulo de cor
              diferente dentro da célula — o efeito xadrez. Todos são 1:1, então
              object-cover preenche a célula sem cortar nada e o grid vira uma
              parede de marcas uniforme; o grayscale amarra os tons e a cor real
              volta no hover. Agora cada célula também é um link pra
              /identidade-visual/[slug] — a legenda "Ver identidade" só
              aparece no hover pra não competir com a "parede uniforme" que o
              grayscale já constrói. */}
          <div className="mt-11 grid grid-cols-2 border-l border-t border-ink/10 sm:grid-cols-4">
            {identities.map((mark) => (
              <Link
                key={mark.slug}
                href={`/identidade-visual/${mark.slug}`}
                className="group relative aspect-square overflow-hidden border-b border-r border-ink/10 bg-ink"
              >
                <Image src={mark.src} alt={mark.alt} fill sizes="25vw" className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white">Ver identidade ↗</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
