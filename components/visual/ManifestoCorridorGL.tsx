'use client'

import { useEffect, useRef } from 'react'
import type * as Three from 'three'
import { prefersRichExperience } from '@/lib/capability'
import { corridorState } from '@/lib/corridorState'

// "O Corredor" do Manifesto — capítulo WebGL imersivo (estilo lusion / zarpei, mas
// AO CONTRÁRIO: emerge do claro e MERGULHA no escuro). A câmera atravessa um tubo de
// partículas azure/cyan enquanto 7 "portholes" (sprite circular com a foto do serviço,
// recortada + anel com glow, sempre de frente pra câmera) orbitam o eixo do túnel — um
// por serviço — num anel inclinado. O canvas é transparente — quem escurece é a camada
// de fundo (bone → ink) em ManifestoLusion.
//
// Perf (mesmos cuidados do hero/reel/footer): gate por capacidade, DPR capado, pausa
// quando fora da tela, init preguiçoso ao se aproximar. Lê o progresso do scroll do
// rect do WRAPPER (a seção alta), porque o canvas em si fica sticky/pinado.

const START_Z = 12
const TRAVEL = 120
const COUNT = 2600 // tubo denso o suficiente pra imersão; ainda < zarpei (3600)

// —— órbita do hub: 7 corpos wireframe, um por serviço, num anel inclinado ——
// labels agora são um anel radial fixo (não seguem mais a projeção 3D), então a órbita
// não precisa de tanto raio só pra evitar colisão — pode ficar mais compacta/próxima.
const ORBIT_RADIUS = 6
const ORBIT_TILT = Math.PI / 8 // 22.5° — mais "redondo", menos achatado que 30°
const ORBIT_Z = -95 // a câmera já cruza essa profundidade perto do fim (START_Z-TRAVEL=-108)
const ORBIT_SWEEP = Math.PI * 1.6 // quanto o anel gira ao longo do scroll inteiro
const SPRITE_SCALE = 2.6 // tamanho (mundo) do porthole revelado por completo

const SERVICES: { label: string; color: number; photo: string }[] = [
  { label: 'Social Media', color: 0xff665c, photo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=200&q=80' },
  { label: 'Design', color: 0xe8deff, photo: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=200&q=80' },
  { label: 'Identidade', color: 0xff665c, photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80' },
  { label: 'Vídeo', color: 0xe8deff, photo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80' },
  { label: 'Gestão', color: 0xff665c, photo: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=200&q=80' },
  { label: 'Landing Pages', color: 0xe8deff, photo: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=200&q=80' },
  { label: 'Tráfego Pago', color: 0xff665c, photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80' },
]

type OrbitShape = {
  sprite: Three.Sprite
  label: HTMLSpanElement
  lineNear: SVGLineElement
  lineFar: SVGLineElement
  baseAngle: number
  spin: number
  revealA: number
  revealB: number
  labelX: number
  labelY: number
}

// janelas de revelação em `corridorState.progress` (0→1) — sequencial, com leve
// sobreposição; uma vez revelado o corpo fica visível (não volta a esconder).
// Começa logo depois do beat de abertura (~0.18) e termina bem antes do finale (~0.7),
// pra órbita não competir com o pouso do hub.
const REVEAL_START = 0.2
const REVEAL_WIDTH = 0.14
const REVEAL_SPAN = 0.46
function revealWindow(i: number, count: number) {
  const step = (REVEAL_SPAN - REVEAL_WIDTH) / (count - 1)
  const a = REVEAL_START + i * step
  return { a, b: a + REVEAL_WIDTH }
}

function smoothstep01(n: number) {
  const t = n < 0 ? 0 : n > 1 ? 1 : n
  return t * t * (3 - 2 * t)
}

function revealFactor(progress: number, a: number, b: number) {
  return smoothstep01((progress - a) / (b - a))
}

// "holofote": depois que um corpo termina de revelar (b), ele recua pra um brilho de
// base em vez de ficar no máximo pra sempre — só o mais recente fica em destaque total,
// os anteriores continuam presentes mas discretos. Evita que os 6 acendam juntos no
// máximo e fiquem "gritando" ao mesmo tempo.
const RECEDE_WIDTH = 0.09
const SPOTLIGHT_BASELINE = 0.4
function spotlightFactor(progress: number, revealB: number) {
  const t = smoothstep01((progress - revealB) / RECEDE_WIDTH)
  return 1 - t * (1 - SPOTLIGHT_BASELINE)
}

export default function ManifestoCorridorGL() {
  const ref = useRef<HTMLCanvasElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (!prefersRichExperience()) return // mobile/GPU fraca/reduced-motion → fallback CSS

    const wrap = canvas.closest('section') as HTMLElement | null
    if (!wrap) return
    const labelsEl = labelsRef.current
    if (!labelsEl) return
    const linesEl = linesRef.current
    if (!linesEl) return

    let disposed = false
    let teardown: (() => void) | null = null

    const init = () => {
      if (teardown || disposed) return
      import('three').then(async (THREE) => {
        if (disposed) return
        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(0x06060a, 0.009)
        const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 400)
        camera.position.set(0, 0, START_Z)

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4))
        renderer.setClearColor(0x000000, 0)

        // —— tubo de partículas (azure/cyan/branco gelo) ——
        const pos = new Float32Array(COUNT * 3)
        const col = new Float32Array(COUNT * 3)
        const scl = new Float32Array(COUNT)
        const azure = new THREE.Color(0xff665c)
        const cyan = new THREE.Color(0xe8deff)
        const ice = new THREE.Color(0xdbe6ff)
        for (let i = 0; i < COUNT; i++) {
          const radius = 1.1 + Math.random() * 6.6
          const a = Math.random() * Math.PI * 2
          pos[i * 3] = Math.cos(a) * radius
          pos[i * 3 + 1] = Math.sin(a) * radius
          pos[i * 3 + 2] = 9 - Math.random() * (TRAVEL + 28)
          const t = Math.random()
          const c = t < 0.6 ? azure : t < 0.85 ? cyan : ice
          col[i * 3] = c.r
          col[i * 3 + 1] = c.g
          col[i * 3 + 2] = c.b
          scl[i] = 0.6 + Math.random()
        }
        const pgeo = new THREE.BufferGeometry()
        pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        pgeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
        pgeo.setAttribute('aScale', new THREE.BufferAttribute(scl, 1))
        const pUniforms = {
          uSize: { value: 27 },
          uReveal: { value: 0 },
          uDpr: { value: Math.min(window.devicePixelRatio, 1.4) },
        }
        const pmat = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: pUniforms,
          vertexShader: `
            attribute vec3 aColor; attribute float aScale;
            uniform float uSize; uniform float uDpr;
            varying vec3 vColor; varying float vFade;
            void main(){
              vColor = aColor;
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              float dist = -mv.z;
              vFade = smoothstep(0.5, 3.0, dist) * (1.0 - smoothstep(74.0, 104.0, dist));
              gl_PointSize = clamp(uSize * aScale * uDpr / max(dist, 1.0), 1.0, 12.0 * uDpr);
              gl_Position = projectionMatrix * mv;
            }`,
          fragmentShader: `
            uniform float uReveal;
            varying vec3 vColor; varying float vFade;
            void main(){
              float r = length(gl_PointCoord - 0.5);
              if (r > 0.5) discard;
              float core = 1.0 - smoothstep(0.0, 0.34, r);
              float halo = (1.0 - smoothstep(0.16, 0.5, r)) * 0.28;
              float a = (core + halo) * vFade * uReveal;
              if (a < 0.01) discard;
              gl_FragColor = vec4(vColor, a);
            }`,
        })
        const particles = new THREE.Points(pgeo, pmat)
        scene.add(particles)

        // —— órbita do hub: 6 "portholes" com a foto do serviço, um por corpo ——
        const orbitGroup = new THREE.Group()
        scene.add(orbitGroup)

        // recorta a foto num círculo + desenha um anel com glow direto no canvas —
        // vira a textura de um Sprite, que SEMPRE fica de frente pra câmera (billboard),
        // então a foto nunca aparece "de lado" ou ilegível conforme a órbita gira.
        const loadPorthole = (svc: (typeof SERVICES)[number]) =>
          new Promise<Three.Sprite>((resolve) => {
            const finish = (map?: Three.CanvasTexture) => {
              const material = new THREE.SpriteMaterial({ map, transparent: true, opacity: 0 })
              resolve(new THREE.Sprite(material))
            }
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              const size = 256
              const canvas = document.createElement('canvas')
              canvas.width = size
              canvas.height = size
              const ctx = canvas.getContext('2d')
              if (!ctx) return finish()
              const ringWidth = 6
              const r = size / 2 - ringWidth - 2
              ctx.save()
              ctx.beginPath()
              ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
              ctx.closePath()
              ctx.clip()
              ctx.filter = 'grayscale(1) contrast(1.15) brightness(0.95)'
              const s = Math.max(size / img.naturalWidth, size / img.naturalHeight)
              const iw = img.naturalWidth * s
              const ih = img.naturalHeight * s
              ctx.drawImage(img, (size - iw) / 2, (size - ih) / 2, iw, ih)
              ctx.restore()
              const ringColor = `#${svc.color.toString(16).padStart(6, '0')}`
              ctx.beginPath()
              ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
              ctx.lineWidth = ringWidth
              ctx.strokeStyle = ringColor
              ctx.shadowColor = ringColor
              ctx.shadowBlur = 14
              ctx.stroke()
              finish(new THREE.CanvasTexture(canvas))
            }
            img.onerror = () => finish()
            img.src = svc.photo
          })

        const sprites = await Promise.all(SERVICES.map((svc) => loadPorthole(svc)))
        if (disposed) return // pode ter desmontado enquanto as fotos carregavam

        // span externo (filho direto) = âncora fixa; span interno = alvo da animação
        // por frame (opacidade + deslize), assim a animação nunca sobrescreve a âncora.
        const labelAnchorEls = Array.from(labelsEl.children) as HTMLSpanElement[]
        const labelEls = labelAnchorEls.map((el) => el.firstElementChild as HTMLSpanElement)
        // 2 <line> por serviço (perto da forma / perto da label) — não uma linha inteira
        // atravessando a tela, que cruzava com as outras conforme a órbita girava.
        const lineEls = Array.from(linesEl.children) as unknown as SVGLineElement[]
        const orbitShapes: OrbitShape[] = SERVICES.map((svc, i) => {
          const sprite = sprites[i]
          orbitGroup.add(sprite)
          const { a, b } = revealWindow(i, SERVICES.length)
          return {
            sprite,
            label: labelEls[i],
            lineNear: lineEls[i * 2],
            lineFar: lineEls[i * 2 + 1],
            baseAngle: (i / SERVICES.length) * Math.PI * 2,
            spin: 0.0006 + Math.random() * 0.0006,
            revealA: a,
            revealB: b,
            labelX: 0,
            labelY: 0,
          }
        })
        const tiltCos = Math.cos(ORBIT_TILT)
        const tiltSin = Math.sin(ORBIT_TILT)

        const project = (v: Three.Vector3, w: number, h: number) => {
          const p = v.clone().project(camera)
          return { x: (p.x * 0.5 + 0.5) * w, y: (1 - (p.y * 0.5 + 0.5)) * h }
        }

        // posição das labels na lista é medida uma vez (+ no resize), NUNCA por frame —
        // getBoundingClientRect() força reflow síncrono; chamar isso no loop de animação
        // (6x por frame) travava o scroll inteiro.
        const measureLabels = () => {
          const wrapRect = wrap.getBoundingClientRect()
          orbitShapes.forEach((s, i) => {
            const anchorRect = labelAnchorEls[i].getBoundingClientRect()
            s.labelX = anchorRect.left - wrapRect.left + anchorRect.width / 2
            s.labelY = anchorRect.top - wrapRect.top + anchorRect.height / 2
          })
        }

        const onResize = () => {
          const w = wrap.clientWidth || window.innerWidth
          const h = window.innerHeight
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          measureLabels()
        }
        onResize()
        window.addEventListener('resize', onResize)

        const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
        let raf = 0
        let visible = true
        let lastScrolled = 0
        let vel = 0

        const tick = () => {
          if (!visible) {
            raf = 0
            return
          }
          raf = requestAnimationFrame(tick)
          // progresso vem da timeline pinada (ScrollTrigger), via corridorState
          const scrolled = clamp01(corridorState.progress)
          const reveal = clamp01(scrolled / 0.1) // partículas surgem no começo da viagem

          // velocidade do scroll (proxy via delta do progresso) → partículas pulsam
          const dv = scrolled - lastScrolled
          lastScrolled = scrolled
          vel += (Math.abs(dv) - vel) * 0.12
          const speed = clamp01(vel * 70)

          // câmera MERGULHA (acelera na descida) + serpenteia
          const dive = Math.pow(scrolled, 1.15)
          camera.position.z = START_Z - dive * TRAVEL
          camera.position.x = Math.sin(scrolled * Math.PI * 2.4) * 1.5
          camera.position.y = Math.cos(scrolled * Math.PI * 1.7) * 0.9
          camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, camera.position.z - 28)

          // tamanho cresce com a velocidade E quanto mais fundo (streak do mergulho)
          pUniforms.uSize.value = 22 + speed * 30 + scrolled * 12
          particles.rotation.z = scrolled * 0.9 + speed * 0.3
          pUniforms.uReveal.value = reveal

          // órbita: posição é função de `scrolled` (não do tempo) pra rebobinar certo
          const w = wrap.clientWidth || window.innerWidth
          const h = window.innerHeight
          for (const s of orbitShapes) {
            const angle = s.baseAngle + scrolled * ORBIT_SWEEP
            const ringX = Math.cos(angle) * ORBIT_RADIUS
            const ringY = Math.sin(angle) * ORBIT_RADIUS
            s.sprite.position.set(ringX, ringY * tiltCos, ORBIT_Z + ringY * tiltSin)
            ;(s.sprite.material as Three.SpriteMaterial).rotation += s.spin + speed * 0.008

            const rv = revealFactor(scrolled, s.revealA, s.revealB)
            const prom = rv * spotlightFactor(scrolled, s.revealB) // 1 = em destaque, recua com o tempo
            ;(s.sprite.material as Three.SpriteMaterial).opacity = prom
            s.sprite.scale.setScalar(SPRITE_SCALE * (0.55 + prom * 0.45))

            // label NÃO segue a projeção 3D (ficava espalhado/colidindo) — é ancorada
            // num ponto fixo; só desliza+acende em sincronia com a revelação da forma,
            // e recua de brilho junto com o holofote depois de revelada.
            s.label.style.opacity = String(prom)
            s.label.style.transform = `translateX(${(1 - rv) * 22}px)`

            // leader line vira 2 "tocos" curtos (perto da forma / perto da label), não
            // uma linha inteira — evita a teia de linhas se cruzando conforme a órbita
            // continua girando depois que a label já tem posição fixa.
            const proj = project(s.sprite.position, w, h)
            const dx = s.labelX - proj.x
            const dy = s.labelY - proj.y
            const dist = Math.hypot(dx, dy) || 1
            const ux = dx / dist
            const uy = dy / dist
            const stub = Math.min(30, dist * 0.32)
            const lineOpacity = String(prom > 0.03 ? prom * 0.55 : 0)

            s.lineNear.setAttribute('x1', String(proj.x))
            s.lineNear.setAttribute('y1', String(proj.y))
            s.lineNear.setAttribute('x2', String(proj.x + ux * stub))
            s.lineNear.setAttribute('y2', String(proj.y + uy * stub))
            s.lineNear.style.strokeDasharray = String(stub)
            s.lineNear.style.strokeDashoffset = String(stub * (1 - rv))
            s.lineNear.style.opacity = lineOpacity

            s.lineFar.setAttribute('x1', String(s.labelX - ux * stub))
            s.lineFar.setAttribute('y1', String(s.labelY - uy * stub))
            s.lineFar.setAttribute('x2', String(s.labelX))
            s.lineFar.setAttribute('y2', String(s.labelY))
            s.lineFar.style.strokeDasharray = String(stub)
            s.lineFar.style.strokeDashoffset = String(stub * (1 - rv))
            s.lineFar.style.opacity = lineOpacity
          }

          renderer.render(scene, camera)
        }

        const io = new IntersectionObserver(
          ([e]) => {
            visible = !!e?.isIntersecting
            if (visible && raf === 0) raf = requestAnimationFrame(tick)
          },
          { threshold: 0 }
        )
        io.observe(wrap)
        raf = requestAnimationFrame(tick)

        teardown = () => {
          cancelAnimationFrame(raf)
          io.disconnect()
          window.removeEventListener('resize', onResize)
          pgeo.dispose()
          pmat.dispose()
          orbitGroup.traverse((o) => {
            const sp = o as Three.Sprite
            const mat = sp.material as Three.SpriteMaterial
            mat.map?.dispose()
            mat.dispose()
          })
          renderer.dispose()
        }
      })
    }

    // init preguiçoso: só monta o WebGL quando a seção se aproxima (fora do caminho do LCP)
    const lazyIO = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          init()
          lazyIO.disconnect()
        }
      },
      { rootMargin: '0px 0px 10% 0px', threshold: 0 }
    )
    lazyIO.observe(wrap)

    return () => {
      disposed = true
      lazyIO.disconnect()
      teardown?.()
    }
  }, [])

  return (
    <>
      <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full" />
      {/* 2 <line> por serviço, filhos diretos do <svg> (não agrupados em <g>) — o JS
          indexa linesEl.children pareado [0,1]=serviço 0, [2,3]=serviço 1... */}
      <svg ref={linesRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible">
        {SERVICES.flatMap((s) => [
          <line key={`${s.label}-near`} stroke="#e8deff" strokeWidth={1.25} opacity={0} style={{ filter: 'drop-shadow(0 0 4px rgba(232,222,255,0.65))' }} />,
          <line key={`${s.label}-far`} stroke="#e8deff" strokeWidth={1.25} opacity={0} style={{ filter: 'drop-shadow(0 0 4px rgba(232,222,255,0.65))' }} />,
        ])}
      </svg>
      {/* labels num anel radial ao redor do centro — ecoa a forma da órbita, em vez de
          uma lista reta na lateral que destoava do movimento circular. Span externo =
          âncora fixa (nunca tocada por JS); span interno = o que a animação por frame
          controla (opacidade + deslize), pra não pisar na âncora de posição. */}
      <div ref={labelsRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]">
        {SERVICES.map((s, i) => {
          const angle = -Math.PI / 2 + (i / SERVICES.length) * Math.PI * 2
          const cx = Math.cos(angle)
          const cy = Math.sin(angle)
          const horiz = cx > 0.2 ? 'right' : cx < -0.2 ? 'left' : 'center'
          const vert = cy < -0.4 ? 'top' : cy > 0.4 ? 'bottom' : 'middle'
          const anchorX = horiz === 'right' ? '0%' : horiz === 'left' ? '-100%' : '-50%'
          const anchorY = vert === 'top' ? '0%' : vert === 'bottom' ? '-100%' : '-50%'
          const gapClass =
            horiz === 'right' ? 'ml-[10px]' : horiz === 'left' ? 'mr-[10px]' : vert === 'top' ? 'mt-[10px]' : 'mb-[10px]'
          return (
            <span
              key={s.label}
              className="absolute"
              style={{ left: `${50 + cx * 30}%`, top: `${50 + cy * 26}%`, transform: `translate(${anchorX}, ${anchorY})` }}
            >
              <span className={`flex items-baseline gap-[0.45em] whitespace-nowrap opacity-0 ${gapClass}`}>
                <span className="font-display text-[13px] font-semibold tabular-nums text-[#e8deff]/70">0{i + 1}</span>
                <span aria-hidden="true" className="font-display text-[16px] font-light leading-none text-azure">—</span>
                <span className="font-display text-[17px] font-bold uppercase tracking-[0.12em] text-[#fff8f2] [text-shadow:0_0_16px_rgba(232,222,255,0.55)]">
                  {s.label}
                </span>
              </span>
            </span>
          )
        })}
      </div>
    </>
  )
}
