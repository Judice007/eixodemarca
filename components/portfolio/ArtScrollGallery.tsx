'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useTransform } from 'framer-motion'
import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
  POUSO,
  useContainerScrollContext,
} from '@/components/ui/animated-gallery'
import { projects, slugify } from '@/lib/portfolio'

/**
 * Abertura da página de artes: a parede levanta com o scroll, pousa e PARA.
 *
 * Duas peças por coluna, não três: com 4:5 e três peças a coluna passava da
 * altura da janela (1,73x medido), então parte da arte só aparecia enquanto
 * as colunas deslizavam. Como agora nada desliza depois do pouso, tudo o que
 * está na cena precisa caber na cena.
 *
 * As colunas são fixas (e não fatias de `projects`) porque a cena é escolhida:
 * peça escura ao lado de peça clara, sem repetir cliente em colunas vizinhas.
 * Fatiar o array daria uma coluna por marca, já que `projects` vem agrupado.
 */
const COLUNAS: string[][] = [
  ['uk-imports-02', 'di-casa-acai-03'],
  ['pousada-da-praia-01', 'ecoutil-04'],
  ['reset-04', 'itamang-03'],
  ['uk-imports-05', 'ecoutil-01'],
]

const porArquivo = new Map(projects.map((project) => [project.src.split('/').pop()!.replace('.webp', ''), project]))

const colunas = COLUNAS.map((coluna) => coluna.map((nome) => porArquivo.get(nome)).filter((p) => p !== undefined))

/**
 * Card com o nome do cliente, que só aparece depois que a parede pousa.
 *
 * A opacidade é presa ao scroll (e não a um `whileInView`) de propósito: assim
 * o nome é o fim do MESMO gesto, e não uma segunda animação disputando a tela
 * com a primeira.
 */
function Card({ project }: { project: (typeof projects)[number] }) {
  const { scrollYProgress, reduce } = useContainerScrollContext()
  const opacity = useTransform(scrollYProgress, [POUSO, POUSO + 0.12], [0, 1])

  return (
    <Link
      href={`/portfolio/artes/${slugify(project.client)}`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-md bg-white/5 shadow-lg"
    >
      <Image src={project.src} alt={project.alt} fill sizes="(min-width: 1100px) 240px, 30vw" className="object-cover" />

      <motion.div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-2.5 pt-12 sm:p-3 sm:pt-14"
        style={reduce ? undefined : { opacity }}
      >
        <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/70 sm:text-[8px]">{project.tags}</p>
        <h3 className="mt-1 font-display text-[12px] font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-[15px]">
          {project.client}
        </h3>
      </motion.div>
    </Link>
  )
}

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

      {/* 190vh: ~90vh de curso preso. A cena se monta na primeira metade e
          fica parada na segunda — é a pausa pra ler os nomes. O bloco original
          pedia 350vh, o que aqui seriam 3,5 telas só de abertura. */}
      <ContainerScroll className="relative h-[190vh]">
        <ContainerSticky className="flex h-svh items-center justify-center">
          {/* Largura medida, não chutada:
              - desktop travado em 1060px. Nos 1420px do container o card dava
                ~340 e a dupla passava da janela;
              - no celular a parede vai a 150vw e sangra pelos lados. Com as
                colunas dentro dos 375px o card ficava com 104px, um selo no
                meio da tela. O palco tem overflow-hidden, então o excesso é
                cortado e não vira rolagem lateral (medido). */}
          <GalleryContainer className="h-auto w-[150vw] max-w-none shrink-0 grid-cols-3 gap-3 sm:w-full sm:max-w-[min(1060px,92vw,140vh)] sm:grid-cols-4 md:gap-4">
            {colunas.map((coluna, indice) => (
              <GalleryCol
                key={indice}
                // A quarta coluna só existe a partir de sm: no celular são 3
                // colunas, senão o card volta a encolher demais.
                className={`gap-3 md:gap-4 ${indice === 3 ? 'hidden sm:flex' : ''} ${indice % 2 === 1 ? 'mt-[-10%]' : ''}`}
                yRange={indice % 2 === 1 ? ['14%', '0%'] : ['-12%', '0%']}
              >
                {coluna.map((project) => (
                  <Card key={project.src} project={project} />
                ))}
              </GalleryCol>
            ))}
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>
    </>
  )
}
