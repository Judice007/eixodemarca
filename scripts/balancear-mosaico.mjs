// Escolhe o row-span de cada vídeo do mosaico pra que as colunas terminem na
// mesma altura, em TODOS os números de coluna do site (3, 4, 5 e 6).
//
// Como o grid é `grid-flow-row-dense` com células de 1 coluna, o auto-placement
// do CSS equivale a "coloca cada item na coluna mais baixa, empate = mais à
// esquerda". Como todas as linhas têm o mesmo gap, a altura de uma coluna é
// proporcional à SOMA dos spans dela — então dá pra simular sem navegador.
//
// Uso:  node scripts/balancear-mosaico.mjs [quantidade]   (padrão: 19)
// Rode de novo sempre que a lista de vídeos mudar de tamanho ou de ordem, e
// cole o array impresso em SPANS no components/portfolio/VideoMosaic.tsx.

const N = Number(process.argv[2] ?? 19)
const COLUNAS = [6, 5, 4, 3]
const PESO = { 6: 6, 5: 3, 4: 1.5, 3: 1 } // xl/lg pesam mais: é onde a grade é vista
const MIN = 17 // spans 17-23 mantêm a célula vertical (~0.42 a ~0.66) em colunas de 175 a 217px
const MAX = 23

function colunas(spans, k) {
  const soma = Array(k).fill(0)
  for (const s of spans) {
    let c = 0
    for (let i = 1; i < k; i++) if (soma[i] < soma[c]) c = i
    soma[c] += s
  }
  return soma
}
const espalhamento = (spans, k) => {
  const s = colunas(spans, k)
  return Math.max(...s) - Math.min(...s)
}
function custo(spans) {
  let c = 0
  for (const k of COLUNAS) c += PESO[k] * espalhamento(spans, k)
  // vizinhos iguais lêem como grade regular, não como mosaico
  for (let i = 1; i < spans.length; i++) if (spans[i] === spans[i - 1]) c += 2
  return c
}

// LCG com semente fixa: o resultado é reproduzível
let seed = 20260925
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32)

let melhor = null
let melhorCusto = Infinity
for (let tentativa = 0; tentativa < 400; tentativa++) {
  let atual = Array.from({ length: N }, () => MIN + Math.floor(rnd() * (MAX - MIN + 1)))
  let cAtual = custo(atual)
  for (let it = 0; it < 4000; it++) {
    const i = Math.floor(rnd() * N)
    const antes = atual[i]
    atual[i] = MIN + Math.floor(rnd() * (MAX - MIN + 1))
    const c = custo(atual)
    if (c <= cAtual) cAtual = c
    else atual[i] = antes
  }
  if (cAtual < melhorCusto) { melhorCusto = cAtual; melhor = [...atual] }
}

console.log(`n = ${N}   custo = ${melhorCusto}`)
console.log('spans:', JSON.stringify(melhor))
for (const k of COLUNAS) {
  const s = colunas(melhor, k)
  console.log(`  ${k} colunas: somas ${JSON.stringify(s)}  sobra ${Math.max(...s) - Math.min(...s)} linhas (~${(Math.max(...s) - Math.min(...s)) * 20}px)`)
}
console.log('\nCole em SPANS:')
for (const s of melhor) console.log(`  'aspect-[9/16] sm:aspect-auto sm:row-span-${s}',`)
