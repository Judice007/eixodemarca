'use client'

import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'

/**
 * Mascote 3D ao lado do título do hero. A cena Spline é a demo pública
 * (robô) do prompt que o cliente mandou — ainda não existe uma cena de
 * panda publicada; assim que tiver um link .splinecode próprio, troca só
 * o valor de `scene` abaixo.
 */
export default function HeroMascot() {
  return (
    <div className="pointer-events-none absolute right-[-40px] top-1/2 hidden h-[340px] w-[340px] -translate-y-1/2 lg:right-[-10px] lg:block xl:right-[20px] xl:h-[400px] xl:w-[400px]">
      <div className="pointer-events-auto relative h-full w-full">
        <Spotlight className="-top-20 left-0" size={260} />
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="h-full w-full"
        />
      </div>
    </div>
  )
}
