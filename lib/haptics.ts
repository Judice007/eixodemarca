// lib/haptics.ts
// Feedback tátil (Vibration API). Android-only na prática — iOS/Safari não expõe
// navigator.vibrate; aqui vira no-op silencioso, e todo uso DEVE ter feedback
// visual equivalente (o settle/spring da própria animação). Política da Fase 1:
// 'tick' só em assentamentos físicos, 'confirm' só na conversão (abrir WhatsApp).
export type HapticKind = 'tick' | 'confirm'

const PATTERNS: Record<HapticKind, number[]> = {
  tick: [20],
  confirm: [50, 30, 50],
}

export function haptic(kind: HapticKind): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  try {
    navigator.vibrate(PATTERNS[kind])
  } catch {
    // permissão/estado do device pode negar — silencioso por design
  }
}
