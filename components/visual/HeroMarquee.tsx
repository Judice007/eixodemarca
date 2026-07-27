// Faixa marquee do Hero (mobile): palavras de serviço em display bold rolando em loop
// infinito. Dois tracks idênticos lado a lado, ambos animando translateX(0 → -100%),
// então a emenda é perfeita em qualquer ponto. Só CSS (keyframe `marquee` em globals),
// pausa com prefers-reduced-motion. Decorativo (aria-hidden, pointer-events-none).
const WORDS = ['Branding', 'Design', 'Motion', 'Estratégia', 'Mídia', 'Performance', '3D', 'Web']

export default function HeroMarquee({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex select-none overflow-hidden border-y border-ink/10 py-3 ${className}`}
    >
      {[0, 1].map((track) => (
        <div
          key={track}
          className="flex shrink-0 items-center whitespace-nowrap animate-[marquee_24s_linear_infinite] motion-reduce:animate-none"
        >
          {WORDS.map((w) => (
            <span key={w} className="flex items-center">
              <span className="px-[0.28em] font-display text-[clamp(30px,8vw,60px)] font-extrabold uppercase leading-none tracking-[-0.02em] text-ink">
                {w}
              </span>
              <span className="px-[0.05em] text-[clamp(22px,5vw,40px)] font-light text-azure">—</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
