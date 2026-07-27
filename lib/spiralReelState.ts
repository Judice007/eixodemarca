// Mutable bridge between the GSAP scrub timeline and the spiral WebGL render
// loop — same pattern as lib/reelState.ts / lib/curveReelState.ts (avoids a
// React re-render on every scroll tick).
export const spiralReelState = { progress: 0 }
