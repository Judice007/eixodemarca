// Scroll/progress math shared by the WebGL stage and the DOM.
export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const readScrollY = () => (typeof window === 'undefined' ? 0 : window.scrollY)
export const rangeProgress = (y: number, start: number, end: number) => {
  const span = end - start
  return span <= 0 ? 0 : clamp01((y - start) / span)
}
