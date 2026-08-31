// Deriva a paleta nova a partir das cores oficiais do kit da marca.
//
// Não dá pra só trocar os hex: o roxo antigo (#2a104a) e o novo (#28112e) têm
// matizes diferentes, então toda a família derivada (palco, card, sobrelinhas)
// sairia fora de tom. A regra aqui é: manter o MESMO degrau de luminosidade
// que a rampa antiga tinha em relação ao ink, e reconstruir no matiz novo.

const ROXO = '#28112e', VERMELHO = '#da2d3a', PAPEL = '#f3efe8'
const INK_ANTIGO = '#2a104a', BONE_ANTIGO = '#fff8f2', AZURE_ANTIGO = '#ff665c'

const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const hex = ([r, g, b]) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')

function rgb2hsl(c) {
  const [r, g, b] = c.map(v => v / 255)
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  const l = (mx + mn) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6
    else if (mx === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
  }
  return [(h * 60 + 360) % 360, s, l]
}
function hsl2rgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2
  const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  return t.map(v => (v + m) * 255)
}
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const [r, g, b] = c; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
const raz = (a, b) => { const [l1, l2] = [lum(rgb(a)), lum(rgb(b))].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05) }

/** Recria `antigo` no matiz/saturação de `baseNova`, mantendo o degrau de L
 *  que ele tinha em relação a `baseAntiga`. */
function derivar(antigo, baseAntiga, baseNova) {
  const [, , lAnt] = rgb2hsl(rgb(antigo))
  const [, , lBaseAnt] = rgb2hsl(rgb(baseAntiga))
  const [hNova, sNova, lBaseNova] = rgb2hsl(rgb(baseNova))
  const [, sAnt] = rgb2hsl(rgb(antigo))
  const l = Math.max(0, Math.min(1, lBaseNova + (lAnt - lBaseAnt)))
  // saturação acompanha a proporção que a cor antiga tinha frente à base
  const [, sBaseAnt] = rgb2hsl(rgb(baseAntiga))
  const s = Math.max(0, Math.min(1, sNova * (sBaseAnt ? sAnt / sBaseAnt : 1)))
  return hex(hsl2rgb([hNova, s, l]))
}

/** Escurece/clareia até bater a razão de contraste pedida contra `fundo`. */
function ajustarPara(cor, fundo, alvo, direcao) {
  let [h, s, l] = rgb2hsl(rgb(cor))
  for (let i = 0; i < 400; i++) {
    const c = hex(hsl2rgb([h, s, l]))
    if (raz(c, fundo) >= alvo) return c
    l += direcao * 0.0025
    if (l <= 0 || l >= 1) break
  }
  return hex(hsl2rgb([h, s, Math.max(0, Math.min(1, l))]))
}

const derivados = {
  '--color-main': derivar('#180525', INK_ANTIGO, ROXO),
  '--color-dark': derivar('#180525', INK_ANTIGO, ROXO),
  '--color-card': derivar('#260b45', INK_ANTIGO, ROXO),
  '--color-muted': derivar('#806f92', INK_ANTIGO, ROXO),
  // Os quase-brancos saem do PAPEL, não do roxo. Derivados do roxo eles vinham
  // rosados (#f3daf9) — a identidade nova não tem branco arroxeado: tem Papel,
  // um off-white quente, e é ele que aparece no kit sobre o roxo.
  '--color-lavanda': derivar('#f4efff', BONE_ANTIGO, PAPEL),
  '--color-cyan': derivar('#e8deff', BONE_ANTIGO, PAPEL),
  '--color-bone-2': derivar('#eadfff', BONE_ANTIGO, PAPEL),
  '--color-stage-deep': derivar('#12062b', INK_ANTIGO, ROXO),
  '--color-stage-mid': derivar('#1b0b3b', INK_ANTIGO, ROXO),
  '--color-stage-lift': derivar('#2a1358', INK_ANTIGO, ROXO),
  '--color-stage-card-ink': derivar('#1b0b3b', INK_ANTIGO, ROXO),
  '--color-stage-text': PAPEL, // é o próprio Papel do kit sobre o roxo
  '--color-stage-text-muted': derivar('#a79cc4', INK_ANTIGO, ROXO),
  '--color-stage-display': derivar('#ede6ff', BONE_ANTIGO, PAPEL),
  '--color-stage-card': derivar('#f4f1ea', BONE_ANTIGO, PAPEL),
  '--color-stage-accent': derivar('#f4655a', AZURE_ANTIGO, VERMELHO),
}

console.log('BASES OFICIAIS DO KIT')
console.log(`  --color-ink / stage base   ${ROXO}`)
console.log(`  --color-azure (acento)     ${VERMELHO}`)
console.log(`  --color-bone / paper       ${PAPEL}`)

console.log('\nDERIVADAS (matiz novo, mesmo degrau de luminosidade)')
for (const [k, v] of Object.entries(derivados)) console.log(`  ${k.padEnd(28)} ${v}`)

// Variantes de texto do acento, calculadas até bater o mínimo da WCAG
const headingSobrePapel = raz(VERMELHO, PAPEL) >= 3 ? VERMELHO : ajustarPara(VERMELHO, PAPEL, 3, -1)
const labelSobrePapel = ajustarPara(VERMELHO, PAPEL, 4.5, -1)
const acentoSobreEscuro = raz(VERMELHO, ROXO) >= 4.5 ? VERMELHO : ajustarPara(VERMELHO, ROXO, 4.5, +1)
const cardMuted = ajustarPara(derivados['--color-muted'], derivados['--color-stage-card'], 4.5, -1)

console.log('\nVARIANTES DE TEXTO (calculadas até passar na WCAG)')
console.log(`  --color-azure-heading        ${headingSobrePapel}  (${raz(headingSobrePapel, PAPEL).toFixed(2)}:1 sobre papel, precisa 3)`)
console.log(`  --color-azure-label          ${labelSobrePapel}  (${raz(labelSobrePapel, PAPEL).toFixed(2)}:1 sobre papel, precisa 4.5)`)
console.log(`  --color-azure-on-dark        ${acentoSobreEscuro}  (${raz(acentoSobreEscuro, ROXO).toFixed(2)}:1 sobre roxo, precisa 4.5)`)
console.log(`  --color-stage-card-muted     ${cardMuted}  (${raz(cardMuted, derivados['--color-stage-card']).toFixed(2)}:1 sobre o card)`)

console.log('\nCONFERÊNCIA DOS PARES QUE O SITE USA')
const pares = [
  ['texto do corpo', ROXO, PAPEL, 4.5],
  ['acento puro', VERMELHO, PAPEL, 3],
  ['papel sobre roxo', PAPEL, ROXO, 4.5],
  ['stage-text sobre stage-deep', derivados['--color-stage-text'], derivados['--color-stage-deep'], 4.5],
  ['stage-text-muted sobre stage-mid', derivados['--color-stage-text-muted'], derivados['--color-stage-mid'], 4.5],
  ['stage-display sobre stage-deep', derivados['--color-stage-display'], derivados['--color-stage-deep'], 4.5],
  ['card-ink sobre stage-card', derivados['--color-stage-card-ink'], derivados['--color-stage-card'], 4.5],
  // Os botões do site são `bg-azure` com `text-ink`. Com o coral antigo isso
  // passava; com o vermelho novo cai pra 3.65:1 e reprova em texto de 13px.
  // Por isso o rótulo do botão passa a ser branco.
  ['ink sobre acento (como está hoje)', ROXO, VERMELHO, 4.5],
  ['branco sobre acento (como vai ficar)', '#ffffff', VERMELHO, 4.5],
]
let falhas = 0
for (const [nome, a, b, min] of pares) {
  const r = raz(a, b)
  const ok = r >= min
  if (!ok) falhas++
  console.log(`  ${ok ? 'ok  ' : 'FALHA'} ${nome.padEnd(34)} ${r.toFixed(2)}:1 (min ${min})`)
}
console.log(falhas ? `\n${falhas} par(es) precisam de ajuste manual` : '\nTodos os pares passam.')
