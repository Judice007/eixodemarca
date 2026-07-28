'use client'

// Dock de navegação mobile — portada de zarpei landing-1 (bottom-nav.tsx), adaptada
// ao Eixo de Marca: barra ink constante + disco coral que segue a seção ativa (scroll-spy),
// recorte "gooey" por máscara SVG, navegação via ScrollSmoother (não briga com o scroll
// suavizado), 5º item leva ao contato. Só mobile (lg:hidden); some quando o footer
// (#contato) entra em vista pra não cobrir o CTA final. Respeita safe-area inferior.
import { useEffect, useId, useState, type ReactElement } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { ScrollSmoother, ScrollTrigger } from '@/lib/registerGsap'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { haptic } from '@/lib/haptics'
import { usePressable } from '@/hooks/usePressable'
import { scrollState } from '@/lib/scrollState'

type IconProps = { className?: string }
const svg = (children: ReactElement) => {
  const Icon = (p: IconProps) => (
    <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
  Icon.displayName = 'NavIcon'
  return Icon
}
const Home = svg(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>)
const Play = svg(<><circle cx="12" cy="12" r="9" /><path d="m10 8.5 6 3.5-6 3.5z" /></>)
const Studio = svg(<><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /></>)
const Grid = svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>)
const Chat = svg(<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />)

type Item = { id: string; label: string; icon: (p: IconProps) => ReactElement; target: string }

// 4 seções (âncoras de scroll-spy) + Falar (leva ao próximo passo)
const navItems: Item[] = [
  { id: 'hero', label: 'Início', icon: Home, target: 'hero' },
  { id: 'reel', label: 'Reel', icon: Play, target: 'reel' },
  { id: 'manifesto', label: 'Eixo', icon: Studio, target: 'manifesto' },
  { id: 'work', label: 'Serviços', icon: Grid, target: 'work' },
  { id: 'contato', label: 'Falar', icon: Chat, target: 'contato' },
]
const SPY_IDS = ['hero', 'reel', 'manifesto', 'work']

// geometria (portada do zarpei; W reduzido p/ caber com folga em telas ~360px)
const W = 336
const H = 60
const DR = 26
const GAP = -24
const RISE = DR * 3 + GAP + 12
const R = 30
const RING = 9
const CUTOUT_R = DR + RING
const DISC_TOP = RISE - GAP - DR * 2
const DISC_CY = -GAP - DR

// o disco só evita encostar nos cantos arredondados
const DISC_MIN = R + 14
const DISC_MAX = W - R - 14
const discClamp = (cx: number) => Math.max(DISC_MIN, Math.min(DISC_MAX, cx))

// Barra = retângulo arredondado estático. O notch é recortado por uma <mask> com um
// círculo concêntrico ao disco (subtração booleana) — encaixe perfeito em qualquer
// posição, sem caso especial.
const BAR_RECT = [
  `M ${R},0`,
  `H ${W - R}`,
  `A ${R},${R} 0 0 1 ${W},${R}`,
  `V ${H - R}`,
  `A ${R},${R} 0 0 1 ${W - R},${H}`,
  `H ${R}`,
  `A ${R},${R} 0 0 1 0,${H - R}`,
  `V ${R}`,
  `A ${R},${R} 0 0 1 ${R},0`,
  `Z`,
].join(' ')

// navega via ScrollSmoother (não briga com o scroll suavizado); fallback nativo.
function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const sm = ScrollSmoother.get()
  if (sm) {
    scrollState.navigating = true
    window.setTimeout(() => {
      scrollState.navigating = false
    }, 1800)
    const pinned =
      id === 'work'
        ? ScrollTrigger.getById('work-services')
        : ScrollTrigger.getAll().find((trigger) => trigger.vars.pin && trigger.vars.trigger === el)
    sm.scrollTo(pinned ? pinned.start : el, true, pinned ? undefined : 'top 72px')
  }
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BottomNav() {
  const activeId = useScrollSpy(SPY_IDS)
  const active = Math.max(0, navItems.findIndex((it) => it.id === activeId))
  const reduce = useReducedMotion()
  const pressable = usePressable()
  const slot = W / navItems.length
  const centerOf = (i: number) => slot * i + slot / 2
  const maskId = useId()
  const gooId = useId()

  // posição única compartilhada pelo recorte (máscara) e pelo disco
  const discX = useMotionValue(discClamp(centerOf(0)))

  // some quando o footer (#contato) entra em vista — não cobre o CTA final
  const [nearEnd, setNearEnd] = useState(false)
  useEffect(() => {
    const footer = document.getElementById('contato')
    if (!footer) return
    const io = new IntersectionObserver(([e]) => setNearEnd(!!e?.isIntersecting), { rootMargin: '0px 0px -8% 0px' })
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const target = discClamp(slot * active + slot / 2)
    const spring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 30 }
    const controls = animate(discX, target, spring)
    return () => controls.stop()
  }, [active, reduce, discX, slot])

  const ActiveIcon = navItems[active]!.icon

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 z-50 flex justify-center px-4 lg:hidden"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))', pointerEvents: nearEnd ? 'none' : undefined }}
    >
      <motion.div
        initial={reduce ? false : { y: 30, opacity: 0 }}
        animate={{ y: nearEnd ? 40 : 0, opacity: nearEnd ? 0 : 1 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 28 }}
        className="relative origin-bottom drop-shadow-[0_18px_34px_rgba(0,0,0,0.28)]"
        style={{ width: W, height: H + RISE }}
      >
        {/* barra: retângulo arredondado com o círculo do disco recortado via máscara */}
        <svg width={W} height={H + RISE} viewBox={`0 ${-RISE} ${W} ${H + RISE}`} className="absolute left-0 top-0" aria-hidden="true">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={-RISE} width={W} height={H + RISE}>
              <rect x={0} y={-RISE} width={W} height={H + RISE} fill="#fff" />
              <motion.circle cx={discX} cy={DISC_CY} r={CUTOUT_R} fill="#000" />
            </mask>
            {/* filtro "gooey": blur derrete o scoop do recorte; threshold firme reconstitui
                a silhueta dura, então só o scoop derrete (cantos da barra continuam nítidos) */}
            <filter id={gooId} x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9.5" />
            </filter>
          </defs>
          <g filter={`url(#${gooId})`}>
            <path d={BAR_RECT} mask={`url(#${maskId})`} fill="#2a104a" />
          </g>
        </svg>

        {/* disco flutuante azure — encaixa no recorte concêntrico */}
        <motion.div
          className="pointer-events-none absolute left-0 grid place-items-center rounded-full bg-azure text-white"
          style={{ x: discX, marginLeft: -DR, top: DISC_TOP, width: DR * 2, height: DR * 2 }}
        >
          <ActiveIcon className="h-[22px] w-[22px]" />
        </motion.div>

        {/* itens */}
        <ul className="absolute left-0 flex" style={{ top: RISE, width: W, height: H }}>
          {navItems.map((it, i) => {
            const isActive = i === active
            const Icon = it.icon
            return (
              <li key={it.id} style={{ width: slot }} className="flex">
                <motion.button
                  {...pressable}
                  type="button"
                  onClick={() => {
                    haptic(it.id === 'contato' ? 'confirm' : 'tick')
                    goTo(it.target)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={it.label}
                  className="flex h-full w-full flex-col items-center justify-end gap-1 rounded-2xl pb-2.5 outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <span className={`transition-opacity duration-150 ${isActive ? 'opacity-0' : 'text-white/70'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`text-[10px] leading-none transition-colors duration-200 ${isActive ? 'font-bold text-white' : 'font-medium text-white/65'}`}>
                    {it.label}
                  </span>
                </motion.button>
              </li>
            )
          })}
        </ul>
      </motion.div>
    </nav>
  )
}
