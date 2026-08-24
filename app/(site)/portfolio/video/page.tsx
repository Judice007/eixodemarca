import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import VideoGrid from '@/components/portfolio/VideoGrid'

export const metadata: Metadata = {
  title: 'Vídeos — Eixo de Marca',
  description: 'Reels, coberturas e conteúdo vertical produzidos pelo Eixo de Marca.',
  alternates: { canonical: '/portfolio/video' },
  openGraph: {
    title: 'Vídeos — Eixo de Marca',
    description: 'Reels, coberturas e conteúdo vertical produzidos pelo Eixo de Marca.',
  },
}

export default function PortfolioVideoPage() {
  return (
    <main className="min-h-screen bg-[#fffdfa] text-ink">
      <SiteHeader />

      <section className="bg-ink px-[var(--gutter)] pb-[clamp(82px,10vw,140px)] pt-[clamp(130px,18vh,190px)] text-white">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              <span className="h-px w-10 bg-white/20" />
              Portfólio
            </div>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <h1 className="max-w-[980px] [text-wrap:balance] font-display text-[clamp(24px,3.8vw,55px)] font-black uppercase leading-[0.98] tracking-[-0.035em] max-sm:leading-[1.02] max-sm:tracking-[-0.025em]">
                Vídeos que ganharam <span className="text-azure">ritmo.</span>
              </h1>
              <p className="max-w-[290px] text-[14px] leading-relaxed text-white/55">Reels, coberturas, takes e conteúdos verticais produzidos pelo Eixo de Marca.</p>
            </div>
          </div>

          <VideoGrid className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5" />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
