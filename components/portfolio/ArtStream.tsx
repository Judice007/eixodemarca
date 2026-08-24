'use client'

import { ImageStreamHero, type StreamImage } from '@/components/ui/image-stream-hero'
import { projects } from '@/lib/portfolio'
import { useVisible } from '@/components/hooks/useVisible'

// As mesmas peças reais da grade logo abaixo: o corredor traz as artes voando
// e, mais adiante na seção, elas se assentam na grade.
const IMAGES: StreamImage[] = projects.map((project) => ({
  src: project.src,
  alt: '',
}))

/**
 * Abertura da seção de artes: as peças vêm de longe pelos dois trilhos,
 * crescendo em direção a quem olha, e saem pelas bordas.
 *
 * É animação de CSS puro (keyframes + perspective), sem JS por frame — então
 * não concorre com o resto da página e para sozinha em
 * `prefers-reduced-motion` (o componente congela o corredor cheio em vez de
 * desmontá-lo).
 *
 * `aria-hidden` no corredor inteiro é do próprio componente: é decorativo, e a
 * relação nomeada das peças já existe na grade abaixo.
 */
export default function ArtStream() {
  const [ref, visible] = useVisible<HTMLDivElement>()

  return (
    <ImageStreamHero
      ref={ref}
      // Composição 3D de 18 camadas: parada fora da tela, senão a GPU segue
      // compondo o corredor inteiro com a seção longe.
      data-paused={visible ? undefined : 'true'}
      images={IMAGES}
      cards={9}
      speed={20}
      axis={46}
      className="h-[clamp(240px,34vw,440px)] w-full rounded-[20px] bg-ink data-[paused=true]:[&_*]:[animation-play-state:paused]"
      // dropExit em unidades de MUNDO: a projeção multiplica pela escala da
      // carta, que na saída é exitHeight/cardHeight = 46/25 = 1.84. Então 9
      // aqui viram ~16.6cqw na tela (~225px num bloco de 440px) — as peças da
      // frente mergulham pra baixo, na direção da grade, enquanto as do fundo
      // seguem retas.
      //
      // O eixo sobe pra 46% justamente pra abrir esse espaço de queda.
      path={{ cardRadius: 0.5, dropExit: 9, dropCurve: 2.8 }}
    >
      {/* Bordas dissolvidas: sem isso as cartas somem num corte reto na quina
          do bloco, e a leitura de "vindo de longe" quebra na saída. O fundo
          também dissolve, pra peça que mergulha entregar o movimento à grade
          em vez de ser decepada na borda. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(23,10,42,.95) 0%, transparent 18%, transparent 82%, rgba(23,10,42,.95) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%]"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(23,10,42,.92))' }}
      />
    </ImageStreamHero>
  )
}
