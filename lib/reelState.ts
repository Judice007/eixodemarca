// Scroll-driven state for the Reel. The GSAP ScrollTrigger timeline tweens these;
// the WebGL card and the SVG ribbon read them every frame.
export const reelState = {
  p: 0, // overall section progress 0..1 — drives the ribbon (cradle -> open)
  disp: 0, // 0 = sharp, 1 = peak liquid distortion
  duotone: 1, // 1 = full blue duotone (cradled), 0 = full colour (centred)
}
