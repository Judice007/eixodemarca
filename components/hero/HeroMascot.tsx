'use client'

import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'

/**
 * Mascote 3D à direita do bloco de texto do hero. Antes era `absolute` por
 * cima do h1 e acabava cobrindo o fim de "chama atenção." — agora é um irmão
 * do texto no flex, então os dois dividem a linha sem se sobrepor.
 *
 * A cena Spline é a demo pública (robô) do prompt que o cliente mandou; assim
 * que existir uma cena de panda publicada, troca só o valor de `scene`.
 */
// Altura casada com a da coluna de texto (~345px): se o mascote for mais alto
// que ela, é ele que passa a definir a altura da linha e o hero estica à toa.
export default function HeroMascot() {
  return (
    <div className="hidden shrink-0 lg:block lg:h-[330px] lg:w-[320px] xl:h-[350px] xl:w-[380px]">
      <div className="relative h-full w-full">
        <Spotlight className="-top-20 left-0" size={260} />
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="h-full w-full"
        />
      </div>
    </div>
  )
}
