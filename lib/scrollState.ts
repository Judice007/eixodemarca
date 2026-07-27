// Single source of truth for scroll-driven progress — the "one scroll" that the
// "one world" (the WebGL Stage) reads every frame. ScrollTrigger writes here.
export const scrollState = {
  hero: 0, // 0 = globe at rest, 1 = fully expanded
  page: 0, // 0..1 over the whole document — drives the ribbon reveal
}
