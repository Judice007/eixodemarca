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
      // Eixo bem alto: toda a altura abaixo dele vira pista de queda.
      axis={30}
      // Sem rounded/bg próprio: era uma CAIXA fechada, e as peças grandes
      // batiam na borda de baixo e eram decepadas antes de chegar perto da
      // grade. Agora a faixa se funde ao fundo da seção, então a peça sai de
      // cena descendo em vez de esbarrar numa parede visível.
      //
      // Fica na largura do container, não em w-screen: sangrar criaria rolagem
      // horizontal, e conter isso com overflow-hidden na seção quebraria a
      // coluna sticky do texto (sticky não funciona sob ancestral com overflow).
      className="h-[clamp(300px,42vw,560px)] w-full data-[paused=true]:[&_*]:[animation-play-state:paused]"
      // dropExit em unidades de MUNDO: a projeção multiplica pela escala da
      // carta, que na saída é exitHeight/cardHeight = 46/25 = 1.84. Então 20
      // aqui viram ~37cqw na tela — a peça da frente desce quase meia largura
      // de container antes de sair, enquanto as do fundo seguem retas.
      path={{ cardRadius: 0.5, dropExit: 20, dropCurve: 2.6 }}
    >
      {/* Fade só embaixo, e forte: a peça dissolve descendo, entregando o
          movimento à grade em vez de terminar num corte reto. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{ background: 'linear-gradient(to bottom, transparent, #2a104a 82%)' }}
      />
    </ImageStreamHero>
  )
}
