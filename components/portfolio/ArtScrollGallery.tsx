'use client'

import Image from 'next/image'
import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from '@/components/ui/animated-gallery'
import { projects } from '@/lib/portfolio'

/**
 * Abertura da página de artes: a grade levanta do chão com o scroll.
 *
 * As colunas são fixas (e não fatias de `projects`) porque a cena é escolhida:
 * peça escura ao lado de peça clara, sem duas do mesmo cliente lado a lado.
 * Fatiar o array daria três colunas de um cliente só, já que `projects` vem
 * agrupado por marca.
 */
// Três por coluna, não quatro: a arte é 4:5 (alta), enquanto o bloco original
// foi desenhado pra 16:9 (baixa). Com 4 cards de 4:5 a coluna passava de
// 2500px numa janela de 720 — o recorte comia dois terços de cada coluna.
const COLUNAS: string[][] = [
  ['uk-imports-02', 'reset-04', 'di-casa-acai-03'],
  ['pousada-da-praia-01', 'ecoutil-04', 'uk-imports-05'],
  ['di-casa-acai-01', 'ecoutil-01', 'itamang-03'],
]

const porArquivo = new Map(projects.map((project) => [project.src.split('/').pop()!.replace('.webp', ''), project]))

const colunas = COLUNAS.map((coluna) => coluna.map((nome) => porArquivo.get(nome)).filter((p) => p !== undefined))

export default function ArtScrollGallery() {
  return (
    <>
      <ContainerStagger className="mt-[clamp(48px,7vw,90px)] text-center">
        <ContainerAnimated>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-azure">O que já saiu daqui</p>
        </ContainerAnimated>
        <ContainerAnimated>
          <h2 className="mx-auto mt-4 max-w-[16ch] [text-wrap:balance] font-display text-[clamp(26px,4.4vw,60px)] font-black uppercase leading-[0.98] tracking-[-0.035em]">
            Cada peça no <span className="text-azure">eixo</span> da marca
          </h2>
        </ContainerAnimated>
        <ContainerAnimated>
          <p className="mx-auto mt-5 max-w-[46ch] text-[14px] leading-relaxed text-white/55">
            Role para ver o feed de cada cliente ganhar forma.
          </p>
        </ContainerAnimated>
      </ContainerStagger>

      {/* 210vh: a seção prende por ~2 telas. O bloco original pedia 350vh, o que
          aqui daria três telas e meia de rolagem só pra abertura — foi
          exatamente o que já soou como "rolagem travada" na home. */}
      <ContainerScroll className="relative h-[210vh]">
        <ContainerSticky className="flex h-svh items-center justify-center">
          {/* Largura da grade, medida em vez de chutada:
              - desktop travado em 1000px. Nos 1420px do container o card dava
                ~470 e a coluna passava de 1700px numa janela de 720;
              - no celular a parede é MAIS larga que a tela (150vw) e sangra
                pelos lados. Com 3 colunas em 375px o card ficava com 104px —
                selo de correio ocupando metade da tela. Como o palco tem
                overflow-hidden, o excesso é cortado e não vira rolagem lateral
                (medido: scrollWidth === clientWidth). */}
          <GalleryContainer className="h-auto w-[150vw] max-w-none shrink-0 gap-3 sm:w-full sm:max-w-[min(1000px,92vw)] md:gap-4">
            {colunas.map((coluna, indice) => (
              <GalleryCol
                key={indice}
                className={indice === 1 ? 'mt-[-32%] gap-3 md:gap-4' : '-mt-2 gap-3 md:gap-4'}
                yRange={indice === 1 ? ['15%', '5%'] : ['-10%', '2%']}
              >
                {coluna.map((project) => (
                  <div key={project.src} className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-white/5 shadow-lg">
                    <Image
                      src={project.src}
                      alt={project.alt}
                      fill
                      sizes="(min-width: 1100px) 320px, 30vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </GalleryCol>
            ))}
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>
    </>
  )
}
