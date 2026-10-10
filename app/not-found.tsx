import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fffdfa] text-ink">
      <SiteHeader />
      <section className="px-[var(--gutter)] pb-[clamp(72px,9vw,120px)] pt-[clamp(150px,22vh,230px)]">
        <div className="mx-auto max-w-[1100px]">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-azure-label">Erro 404</p>
          <h1 className="mt-5 max-w-[14ch] [text-wrap:balance] font-display text-[clamp(34px,6.4vw,92px)] font-normal uppercase leading-[1.05] tracking-[-0.005em] [word-spacing:0.1em]">
            Essa página não existe.
          </h1>
          <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-ink/70 sm:text-[18px]">
            O endereço pode ter mudado ou ter sido digitado errado. Daqui você chega em qualquer lugar do site.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="bg-azure px-6 py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-ink">
              Voltar ao início
            </Link>
            <Link href="/portfolio/artes" className="border border-ink/25 px-6 py-3.5 text-[13px] font-bold transition-colors hover:border-ink">
              Ver as artes
            </Link>
            <Link href="/portfolio/video" className="border border-ink/25 px-6 py-3.5 text-[13px] font-bold transition-colors hover:border-ink">
              Ver os vídeos
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
