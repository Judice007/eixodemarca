#!/usr/bin/env node
// Detecta a bounding box do placeholder magenta/rosa (a "tela" do mockup)
// dentro de um asset de mãos+celular, e imprime como % da largura/altura
// totais da imagem — pra plugar direto em SCREEN em components/hero/constants.ts.
//
// Uso: node scripts/detect-screen-bbox.js public/assets/device/algum-mockup.png

import sharp from 'sharp'

const IMG_PATH = process.argv[2]
if (!IMG_PATH) {
  console.error('uso: node scripts/detect-screen-bbox.js <caminho-da-imagem>')
  process.exit(1)
}

// Alvo magenta ~ (255, 0, 255). Match com tolerância pra pegar antialiasing
// na borda sem confundir com o fundo branco ou o corpo preto do aparelho.
function isMagenta(r, g, b) {
  return r > 140 && b > 140 && g < Math.min(r, b) * 0.55 && Math.abs(r - b) < 90
}

async function main() {
  const img = sharp(IMG_PATH)
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  let matchCount = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      if (isMagenta(r, g, b)) {
        matchCount++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  if (matchCount === 0) {
    console.error('Nenhum pixel magenta encontrado — cheque a tolerância ou a imagem.')
    process.exit(1)
  }

  const bbox = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
  const pct = {
    top: (bbox.top / height) * 100,
    left: (bbox.left / width) * 100,
    width: (bbox.width / width) * 100,
    height: (bbox.height / height) * 100,
  }

  console.log('tamanho da imagem:', width, 'x', height)
  console.log('pixels detectados:', matchCount)
  console.log('bbox (px):', bbox)
  console.log('bbox (% da imagem):', {
    top: pct.top.toFixed(3) + '%',
    left: pct.left.toFixed(3) + '%',
    width: pct.width.toFixed(3) + '%',
    height: pct.height.toFixed(3) + '%',
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
