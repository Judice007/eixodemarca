'use client'

import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { useVisible } from '@/components/hooks/useVisible'

/**
 * Mascote 3D à direita do bloco de texto do hero. É irmão do texto no flex (e
 * não `absolute` por cima dele), então os dois dividem a linha sem se sobrepor.
 *
 * A cena só é MONTADA enquanto o hero está na tela: o runtime da Spline é um
 * motor 3D completo com laço de render próprio, de longe a coisa mais cara da
 * página, e ele seguia renderizando com o hero a várias telas de distância.
 * Desmontar libera o contexto WebGL inteiro em vez de só pausar um laço.
 *
 * A cena é a demo pública (robô) do prompt que o cliente mandou; quando existir
 * uma cena de panda publicada, troca só o valor de `scene`.
 */

// Altura casada com a da coluna de texto (~345px): se o mascote for mais alto
// que ela, é ele que passa a definir a altura da linha e o hero estica à toa.
export default function HeroMascot() {
  const [ref, visible] = useVisible<HTMLDivElement>('300px')

  return (
    <div
      ref={ref}
      className="hidden shrink-0 lg:block lg:h-[330px] lg:w-[320px] xl:h-[350px] xl:w-[380px]"
    >
      <div className="relative h-full w-full">
        <Spotlight className="-top-20 left-0" size={260} />
        {visible && (
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  )
}
