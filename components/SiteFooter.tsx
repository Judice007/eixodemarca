import Link from 'next/link'
import { contactInfo, mailtoUrl, whatsappUrl } from '@/lib/data'
import PontoCegoCta from '@/components/PontoCegoCta'

export default function SiteFooter() {
  return (
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
            {/* Segunda chance de captura pra quem rolou a página inteira sem
                converter na hero — mesma oferta, sem repetir a cor sólida
                do CTA principal do rodapé. */}
            <PontoCegoCta variant="outline" />
          </div>
          <Link href="/#top" className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white">Voltar ao topo ↑</Link>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/60 sm:flex-row">
          <span>© 2026 Eixo de Marca — Brasil</span>
          <span>Estratégia · criação · gestão</span>
        </div>
      </div>
    </footer>
  )
}
