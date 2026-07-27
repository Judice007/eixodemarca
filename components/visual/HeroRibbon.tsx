// The connective serpent — a blue ribbon deep in the HERO background. It emerges
// behind the gallery (upper-right) almost invisible, weaves down, and BUILDS up in
// weight/opacity as it nears its lower-LEFT exit — meeting the reel's bold top ribbon
// (which draws in from the left) so the two read as ONE continuous line. The gradient
// ramps the alpha along the path (faint emergence -> solid at the seam). Drawn on
// scroll via DrawSVG in HeroLusion.
export default function HeroRibbon() {
  return (
    <svg
      className="hero-ribbon pointer-events-none absolute inset-0 z-[1] size-full max-lg:hidden"
      viewBox="0 0 1440 810"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* alpha ramps from faint (top-right emergence) to solid (lower-left seam) */}
        <linearGradient id="hero-ribbon-grad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#82a3ff" stopOpacity="0.12" />
          <stop offset="0.5" stopColor="#4f7bff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#ff665c" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        className="hero-ribbon-path"
        fill="none"
        stroke="url(#hero-ribbon-grad)"
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1130 84 C 1216 252 1000 330 858 402 C 690 486 762 604 560 654 C 382 698 320 566 190 652 C 82 724 28 776 -130 756"
      />
    </svg>
  )
}
