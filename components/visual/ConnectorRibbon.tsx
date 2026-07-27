// A faint connector ribbon for the "one world, one scroll" serpent — the thread that
// stitches the sections together. Each section drops one in with a path that ENTERS
// where the previous section's ribbon exited and EXITS toward the next (alternating
// left/right seams). Deep in the background, faint. Drawn on scroll via DrawSVG
// (`connector-ribbon-path` hook) in each section's own (scoped) useGSAP.
export default function ConnectorRibbon({
  d,
  strokeWidth = 22,
  opacity = 0.3,
}: {
  d: string
  strokeWidth?: number
  opacity?: number
}) {
  return (
    <svg
      className="connector-ribbon pointer-events-none absolute inset-0 z-[1] size-full max-lg:hidden"
      viewBox="0 0 1440 810"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        className="connector-ribbon-path"
        fill="none"
        stroke="#ff665c"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d={d}
      />
    </svg>
  )
}
