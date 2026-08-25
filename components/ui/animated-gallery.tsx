'use client'

import * as React from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type HTMLMotionProps, type MotionValue, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Galeria que "levanta" com o scroll: as colunas começam tombadas em 3D e vão
 * ficando de frente conforme a seção passa, com as colunas laterais correndo em
 * velocidades diferentes.
 *
 * Adaptado do bloco original em dois pontos que importam aqui:
 *  - usa `framer-motion` (já no projeto) em vez do pacote `motion`;
 *  - respeita `prefers-reduced-motion`: quem pediu menos movimento recebe a
 *    grade parada, sem rotação nem parallax. Sem isso a cena inteira gira na
 *    cara de quem tem sensibilidade vestibular.
 */

const SPRING = { type: 'spring', stiffness: 100, damping: 16, mass: 0.75, restDelta: 0.005 } as const

const blurVariants: Variants = {
  hidden: { filter: 'blur(10px)', opacity: 0 },
  visible: { filter: 'blur(0px)', opacity: 1 },
}

type ContainerScrollContextValue = {
  scrollYProgress: MotionValue<number>
  /** true quando o usuário pediu menos movimento — as peças param de transformar */
  reduce: boolean
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined)

export function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) throw new Error('Use os componentes da galeria dentro de <ContainerScroll>.')
  return context
}

/**
 * Onde a cena termina de se montar, em progresso de scroll.
 *
 * Tudo — rotação, escala e o deslize das colunas — acaba aqui. Depois deste
 * ponto a parede fica PARADA até a seção sair: é o intervalo em que os nomes
 * dos clientes aparecem e dá pra ler sem nada se mexendo em volta.
 */
export const POUSO = 0.55

export function ContainerScroll({ children, className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollRef })
  const reduce = !!useReducedMotion()

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress, reduce }}>
      <div
        ref={scrollRef}
        className={cn('relative min-h-[120vh]', className)}
        style={{ perspective: '1000px', perspectiveOrigin: 'center top', ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

/**
 * O palco que fica preso na tela enquanto a seção rola.
 *
 * `position: sticky` morre sob qualquer ancestral com overflow diferente de
 * visible — inclusive o `overflow-hidden` que parece inofensivo. Aqui o
 * overflow-hidden é do próprio elemento sticky (isso pode), mas se a galeria
 * for movida pra dentro de um wrapper cortado, ela para de grudar.
 */
export function ContainerSticky({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden', className)}
      style={{ perspective: '1000px', perspectiveOrigin: 'center top', transformOrigin: '50% 50%', ...style }}
      {...props}
    />
  )
}

export function GalleryContainer({ children, className, style, ...props }: HTMLMotionProps<'div'>) {
  const { scrollYProgress, reduce } = useContainerScrollContext()
  // Rotação e escala terminam juntas em POUSO. No original a escala só
  // fechava em 0.9, então a parede continuava crescendo bem depois de já
  // estar de frente — movimento sobrando justo na hora de olhar as peças.
  const rotateX = useTransform(scrollYProgress, [0, POUSO * 0.78], [72, 0])
  const scale = useTransform(scrollYProgress, [POUSO * 0.78, POUSO], [1.12, 1])

  return (
    <motion.div
      className={cn('relative grid size-full grid-cols-3 gap-2 rounded-2xl', className)}
      style={
        reduce
          ? { transformStyle: 'preserve-3d', ...style }
          : { rotateX, scale, transformStyle: 'preserve-3d', perspective: '1000px', ...style }
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function GalleryCol({ className, style, yRange = ['0%', '-10%'], ...props }: HTMLMotionProps<'div'> & { yRange?: string[] }) {
  const { scrollYProgress, reduce } = useContainerScrollContext()
  // O deslize das colunas acontece DURANTE a subida e para junto com ela. No
  // original ele ia de 0.5 a 1, ou seja, começava só quando a parede acabava
  // de levantar: era a segunda animação, colada na primeira.
  const y = useTransform(scrollYProgress, [0, POUSO], yRange)

  return <motion.div className={cn('relative flex w-full flex-col gap-2', className)} style={reduce ? style : { y, ...style }} {...props} />
}

export const ContainerStagger = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(function ContainerStagger(
  { className, viewport, transition, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      initial="hidden"
      whileInView="visible"
      // O original escrevia `once: true || viewport?.once`, que ignora o que
      // vem de fora — `true ||` curto-circuita sempre.
      viewport={{ once: true, ...viewport }}
      transition={{ staggerChildren: 0.2, ...transition }}
      {...props}
    />
  )
})

export const ContainerAnimated = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(function ContainerAnimated(
  { className, transition, ...props },
  ref,
) {
  // Mesma pegadinha do `||` no original: `SPRING || transition` nunca deixava
  // ninguém sobrescrever a mola. Aqui o que vem por prop ganha.
  return <motion.div ref={ref} className={cn(className)} variants={blurVariants} transition={{ ...SPRING, ...transition }} {...props} />
})
