// Estado compartilhado do corredor do Manifesto: a timeline pinada (ScrollTrigger) em
// ManifestoLusion seta `progress` (0→1) no scrub; o ManifestoCorridorGL lê pra mover a
// câmera. Mesmo padrão do reelState — evita ler rect (o canvas fica pinado/imóvel).
export const corridorState = { progress: 0 }
