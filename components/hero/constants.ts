// Constantes da vitrine de serviços em órbita.
// Tudo que controla ritmo, distância e profundidade da cena mora aqui.

/** Proporção do asset das mãos (1074 x 924, já cortado sem a margem branca). */
export const ASSET_ASPECT = 1074 / 924

/**
 * Recorte da tela dentro do asset, em % da caixa do asset.
 * Medido pixel a pixel via scripts/detect-screen-bbox (a tela vem em chroma
 * magenta): o vazado real vai de x 320..753, y 20..885 num canvas 1074x924.
 * `radius` é % da LARGURA do asset — os cantos medem ~45px.
 */
export const SCREEN = {
  top: 2.165,
  left: 29.795,
  width: 40.317,
  height: 93.615,
  radius: 4.19,
} as const

/** Raio da tela convertido pra % da própria caixa da tela (pro border-radius). */
export const SCREEN_RADIUS_PCT = SCREEN.radius * (100 / SCREEN.width)

/**
 * A órbita é dirigida pelo scroll: a seção fica presa na tela e o progresso da
 * rolagem vira a posição da órbita.
 *  - VH_PER_SERVICE: quanto de rolagem cada serviço ocupa. A altura total da
 *    seção é works.length * este valor.
 *  - SMOOTHING: lerp entre a posição alvo (do scroll) e a desenhada, pra roda
 *    do mouse não sair aos saltos.
 */
export const SCROLL = { vhPerService: 500 / 7, smoothing: 0.12 } as const

/**
 * Faixa reservada no topo do palco pro título gigante. É também o quanto o
 * aparelho desce, já que ele está no fluxo. O mesmo valor abre a caixa da
 * órbita, pra que halo, trilha e cards girem em torno do centro REAL do
 * celular em vez do centro do palco (que inclui a faixa do título).
 */
// Cresceu pra caber o título E o nome do serviço ativo empilhados (antes só
// tinha o título — a legenda ficava flutuando por cima do aparelho).
//
// `min(13vw, 17vh)`: antes era só vw, então numa tela larga e baixa (1280x700,
// notebook comum) a faixa ficava com 168px enquanto a altura total não
// comportava — o `justify-center` do palco empurrava o topo pra debaixo do
// header e o título sumia atrás dele. Amarrando também à altura, a cena
// inteira encolhe junto quando a tela é baixa.
export const TITLE_BAND = 'clamp(4.75rem, min(13vw, 17vh), 10.5rem)'

/**
 * Distância horizontal entre dois slots vizinhos, em px, por breakpoint.
 * Menor no mobile porque o palco é mais estreito.
 */
export const SPACING = { base: 130, md: 170, xl: 230 } as const

/**
 * A quantos slots do centro o card termina de sumir. É isto — e não o SPACING —
 * que define quantos cards ficam visíveis: ~2 no mobile, ~3 no tablet, ~5 no desktop.
 */
export const SPAN = { base: 1.6, md: 2.2, xl: 2.6 } as const

/** Curva de profundidade: como o card encolhe, cai, gira e desfoca ao se afastar. */
export const DEPTH = {
  lift: 34, // px que o card desce na borda do arco
  liftPow: 1.6, // >1 deixa a queda mais acentuada nas pontas
  scaleStep: 0.17, // escala perdida por slot de distância
  scaleClamp: 2.5, // trava a perda de escala/brilho a partir daqui
  rotate: -6, // graus de rotação por slot
  blurStep: 2.2, // px de blur por slot
  blurMax: 6,
  dim: 0.12, // brilho perdido por slot
} as const

/** Camadas. Todo card fica abaixo do palco do celular, então passa atrás das mãos. */
export const LAYER = {
  title: 2,
  halo: 1,
  track: 3,
  cardBase: 15, // z do card central; cai 1 por slot de distância
  phone: 25,
  cta: 40,
} as const

export const TRANSITION = {
  screen: 0.7, // crossfade da tela do celular
  recenter: 0.9, // clique -> traz o card pro centro
  hoverScale: 0.12, // timeScale da órbita enquanto o mouse está em cima
  hoverRamp: 0.4, // tempo pra voltar à velocidade normal
} as const

export const PARALLAX = {
  lerp: 0.08,
  device: 10, // px de deslocamento do aparelho
  deviceTilt: 3, // graus de rotateY
  cards: 4, // px dos cards, na direção oposta
} as const

/** Flutuação individual do card (no wrapper interno, pra não brigar com a órbita). */
export const FLOAT = { amp: 6, minDuration: 3.6, maxDuration: 5.2 } as const

/** Largura dos cards por formato — casada com a proporção real de cada arte. */
export const CARD_SIZE = {
  portrait: { width: 168, aspect: '9 / 19.5' },
  square: { width: 190, aspect: '1 / 1' },
  landscape: { width: 240, aspect: '16 / 9' },
} as const
