'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/registerGsap'
import { prefersRichExperience } from '@/lib/capability'
import { onceNearViewport } from '@/lib/nearViewport'

// WebGL closer for the footer: a cloud of azure→cyan particles that ASSEMBLES into a
// glowing sphere as you scroll into the footer — a GSAP ScrollTrigger (scrub) drives
// the formation 0→1, then it rotates. Additive blending → it glows on the ink
// surface. A callback to the retired globe, now as the page's closing signature.
// Sits behind the footer content (-z-10); gated to the rich experience.
export default function FooterGL() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!prefersRichExperience()) return
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let disposed = false
    let cleanup = () => {}
    let st: ReturnType<typeof ScrollTrigger.create> | null = null
    const prog = { v: 0, target: 0 }

    // Init preguiçoso: criar o renderer + compilar shaders só quando o footer se
    // aproxima — fora da janela de load (antes subia no mount, travando o carregamento).
    const stopIO = onceNearViewport(canvas, () => {
    if (disposed) return

    // ScrollTrigger: a esfera se forma conforme o footer entra (scrub segue o scroll).
    // Sobe pelo próprio DOM (closest) em vez de re-consultar '#contato' — mesmo
    // elemento, sem depender de o seletor global já estar resolvível nesse instante.
    st = ScrollTrigger.create({
      trigger: canvas.closest('footer') ?? canvas,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        prog.target = self.progress
      },
    })

    import('three').then((THREE) => {
      if (disposed) return
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
      renderer.setClearColor(0x000000, 0)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
      camera.position.z = 5

      const size = () => {
        const w = canvas.clientWidth || window.innerWidth
        const h = canvas.clientHeight || window.innerHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      size()
      window.addEventListener('resize', size)

      // Cada partícula tem uma posição DISPERSA (volume amplo) e um ALVO na esfera
      // (espiral áurea). O scroll interpola disperso → alvo: a marca "se monta".
      const COUNT = 1800
      const R = 1.85
      const scattered = new Float32Array(COUNT * 3)
      const target = new Float32Array(COUNT * 3)
      const live = new Float32Array(COUNT * 3)
      const colors = new Float32Array(COUNT * 3)
      const cA = new THREE.Color('#ff665c')
      const cB = new THREE.Color('#e8deff')
      const golden = Math.PI * (3 - Math.sqrt(5))
      const rand = (a: number, b: number) => a + Math.random() * (b - a)
      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2
        const rr = Math.sqrt(Math.max(0, 1 - y * y))
        const th = golden * i
        target[i * 3] = Math.cos(th) * rr * R
        target[i * 3 + 1] = y * R
        target[i * 3 + 2] = Math.sin(th) * rr * R
        scattered[i * 3] = rand(-7, 7)
        scattered[i * 3 + 1] = rand(-5, 5)
        scattered[i * 3 + 2] = rand(-7, 3)
        live[i * 3] = scattered[i * 3]
        live[i * 3 + 1] = scattered[i * 3 + 1]
        live[i * 3 + 2] = scattered[i * 3 + 2]
        const c = cA.clone().lerp(cB, (y + 1) / 2)
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }
      const geo = new THREE.BufferGeometry()
      const posAttr = new THREE.BufferAttribute(live, 3)
      geo.setAttribute('position', posAttr)
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      const mat = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const points = new THREE.Points(geo, mat)
      points.position.set(1.7, -0.2, 0) // desloca pra direita → não fica atrás da copy
      scene.add(points)

      const easeIO = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
      let time = 0

      const tick = () => {
        raf = requestAnimationFrame(tick)
        // pausa quando o footer está fora da tela (economiza GPU)
        const rect = canvas.getBoundingClientRect()
        const vh = window.innerHeight || 1
        if (rect.bottom <= 0 || rect.top >= vh) return

        time += 0.016
        prog.v += (prog.target - prog.v) * 0.08
        const f = easeIO(clamp01(prog.v))
        for (let i = 0; i < COUNT * 3; i++) live[i] = lerp(scattered[i], target[i], f)
        posAttr.needsUpdate = true

        points.rotation.y = time * 0.06 + prog.v * Math.PI * 0.4
        points.rotation.x = 0.12
        points.scale.setScalar(0.7 + f * 0.4)
        mat.opacity = 0.9 * clamp01(prog.v * 1.4)

        renderer.render(scene, camera)
      }
      tick()

      cleanup = () => {
        window.removeEventListener('resize', size)
        geo.dispose()
        mat.dispose()
        renderer.dispose()
      }
    })
    })

    return () => {
      disposed = true
      stopIO()
      cancelAnimationFrame(raf)
      st?.kill()
      cleanup()
    }
  }, [])

  return (
    // Era h-full do <footer> inteiro: com nav + colunas + wordmark fantasma +
    // barra inferior, o footer ficou bem mais alto que o pensado pra esse
    // efeito — o canvas (e a esfera dentro dele) cresciam junto, ocupando a
    // seção quase inteira. Trava numa altura fixa, ancorada no topo (onde
    // fica o CTA que a esfera acompanha), do tamanho que já era o previsto.
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] w-full max-h-full"
    />
  )
}
