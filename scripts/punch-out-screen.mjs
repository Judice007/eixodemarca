#!/usr/bin/env node
// Torna transparente (1) o fundo branco do canvas do mockup, via flood-fill
// a partir das bordas, e (2) a área da "tela" (chroma magenta), via
// distância de cor — pra que o conteúdo dos slides apareça por trás dela e
// as mãos/aparelho fiquem recortados do fundo, igual ao asset anterior.
//
// Uso: node scripts/punch-out-screen.mjs <entrada.png> <saida.png>

import sharp from 'sharp'

const [, , IN_PATH, OUT_PATH] = process.argv
if (!IN_PATH || !OUT_PATH) {
  console.error('uso: node scripts/punch-out-screen.mjs <entrada.png> <saida.png>')
  process.exit(1)
}

// Magenta da tela: cor de referência medida no platô (não é o puro 255/0/255
// por causa de compressão/gamma do render).
const MAGENTA_REF = [238, 4, 235]
const MAGENTA_INNER = 40
const MAGENTA_OUTER = 200

// Fundo branco do canvas.
const WHITE_FLOOD_MAX_DIST = 40 // o quanto de "branco sujo" ainda conta como fundo, pra conectividade
const WHITE_INNER = 15 // abaixo disso: 100% transparente
const WHITE_OUTER = 40 // acima disso (mas ainda no fundo conectado): 100% opaco

function dist3(r, g, b, rr, gg, bb) {
  const dr = rr - r
  const dg = gg - g
  const db = bb - b
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

async function main() {
  const img = sharp(IN_PATH)
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const n = width * height

  // --- flood fill do fundo branco a partir da borda ---
  const bgMask = new Uint8Array(n) // 1 = alcançável a partir da borda via pixels "brancos"
  const whiteDist = new Float32Array(n)
  const queue = new Int32Array(n)
  let qHead = 0
  let qTail = 0

  function whitenessAt(idx) {
    const p = idx * channels
    return dist3(data[p], data[p + 1], data[p + 2], 255, 255, 255)
  }

  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const idx = y * width + x
      const d = whitenessAt(idx)
      whiteDist[idx] = d
      if (!bgMask[idx] && d <= WHITE_FLOOD_MAX_DIST) {
        bgMask[idx] = 1
        queue[qTail++] = idx
      }
    }
  }
  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      const idx = y * width + x
      const d = whitenessAt(idx)
      whiteDist[idx] = d
      if (!bgMask[idx] && d <= WHITE_FLOOD_MAX_DIST) {
        bgMask[idx] = 1
        queue[qTail++] = idx
      }
    }
  }

  while (qHead < qTail) {
    const idx = queue[qHead++]
    const x = idx % width
    const y = (idx / width) | 0
    const neighbors = []
    if (x > 0) neighbors.push(idx - 1)
    if (x < width - 1) neighbors.push(idx + 1)
    if (y > 0) neighbors.push(idx - width)
    if (y < height - 1) neighbors.push(idx + width)
    for (const nb of neighbors) {
      if (bgMask[nb]) continue
      const d = whitenessAt(nb)
      whiteDist[nb] = d
      if (d <= WHITE_FLOOD_MAX_DIST) {
        bgMask[nb] = 1
        queue[qTail++] = nb
      }
    }
  }

  // --- aplica alpha: fundo (flood) com feather, senão magenta com feather, senão opaco ---
  for (let i = 0; i < n; i++) {
    const p = i * channels
    const r = data[p]
    const g = data[p + 1]
    const b = data[p + 2]

    if (bgMask[i]) {
      const d = whiteDist[i]
      let alpha
      if (d <= WHITE_INNER) alpha = 0
      else if (d >= WHITE_OUTER) alpha = 255
      else alpha = Math.round(((d - WHITE_INNER) / (WHITE_OUTER - WHITE_INNER)) * 255)
      data[p + 3] = alpha
      continue
    }

    const dm = dist3(r, g, b, MAGENTA_REF[0], MAGENTA_REF[1], MAGENTA_REF[2])
    if (dm <= MAGENTA_OUTER) {
      let alpha
      if (dm <= MAGENTA_INNER) alpha = 0
      else alpha = Math.round(((dm - MAGENTA_INNER) / (MAGENTA_OUTER - MAGENTA_INNER)) * 255)
      data[p + 3] = alpha
      continue
    }

    data[p + 3] = 255
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(OUT_PATH)
  console.log('vazado salvo em', OUT_PATH)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
