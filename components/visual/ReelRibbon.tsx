// The ribbon — a thin wavy blue band that lives at the TOP of the reel section,
// decoupled from the card (separate zones). It DRAWS IN from the left (GSAP DrawSVG,
// driven by ReelLusion's timeline) and stays up top. `reel-ribbon-path` is the hook.
export default function ReelRibbon() {
  return (
    <svg
      className="reel-ribbon pointer-events-none absolute inset-0 z-[5] size-full"
      viewBox="0 0 1440 810"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="reel-ribbon-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5f86ff" />
          <stop offset="1" stopColor="#ff665c" />
        </linearGradient>
      </defs>
      <path
        className="reel-ribbon-path"
        fill="none"
        stroke="url(#reel-ribbon-grad)"
        strokeOpacity={0.5}
        strokeWidth={16}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M-60 110 C 200 60 400 96 540 168 C 690 244 706 444 612 556 C 520 664 312 700 196 654 C 60 600 6 470 78 374 C 142 290 372 286 528 340 C 712 404 900 360 1150 392 C 1330 415 1470 510 1560 600"
      />
    </svg>
  )
}
