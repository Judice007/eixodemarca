import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArtGrid from '@/components/portfolio/ArtGrid'

export const metadata: Metadata = {
  title: 'Artes e design — Eixo de Marca',
  description: 'Campanhas, identidade visual e peças de design produzidas pelo Eixo de Marca.',
  alternates: { canonical: '/portfolio/artes' },
}

export default function PortfolioArtesPage() {
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
                Artes e design que ganharam <span className="text-azure">forma.</span>
              </h1>
              <p className="max-w-[290px] text-[14px] leading-relaxed text-white/55">Campanhas, identidade visual e peças de design produzidas pelo Eixo de Marca.</p>
            </div>
          </div>

          <ArtGrid />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
