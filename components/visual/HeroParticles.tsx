'use client'

import { useEffect, useRef } from 'react'
import type * as THREE from 'three'
import { prefersRichExperience } from '@/lib/capability'
import { whenIdleAfterLoad } from '@/lib/whenIdle'

// Ambient WebGL layer behind the hero — a faint depth field of azure particles + a
// few floating wireframe solids drifting over the bone. Stays in the BACKGROUND
// (low opacity, gentle motion) and BUILDS IN gradually on load: the field
// materialises particle-by-particle over ~2.6s (growing draw range) and the
// floaters fade in one after another — so nothing pops in all at once. Reacts to
// the scroll subtly (soft camera dolly, small velocity kick/lean, layer parallax)
// and fades out as the hero leaves.
//
// Transparent canvas (composites over bg-bone); lives inside #hero, behind content
// (grid is z-10, this is z-0). Self-contained — scroll position + velocity come
// from the canvas's own rect, so it stays synced to GSAP ScrollSmoother. Gated to
// the rich experience; otherwise the hero stays clean editorial.
export default function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!prefersRichExperience()) return
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let disposed = false
    let cleanup = () => {}

    // Adia o parse do Three.js (706KB) pra DEPOIS do load + idle: tira o maior long
    // task do caminho do first paint. As partículas já entram com fade gradual
    // (~2.6s), então começar uma fração de segundo depois é imperceptível.
    const stopIdle = whenIdleAfterLoad(() => {
    import('three').then((THREE) => {
      if (disposed) return
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0))
      renderer.setClearColor(0x000000, 0) // transparente → o bone aparece atrás

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
      camera.position.z = 6

      const size = () => {
        const w = canvas.clientWidth || window.innerWidth
        const h = canvas.clientHeight || window.innerHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      size()
      window.addEventListener('resize', size)

      // --- campo de partículas (volume com profundidade; ordem aleatória no buffer
      // → crescer o drawRange revela pontos espalhados, não um bloco) ---
      const COUNT = 1100
      const positions = new Float32Array(COUNT * 3)
      const colors = new Float32Array(COUNT * 3)
      const cA = new THREE.Color('#ff665c')
      const cB = new THREE.Color('#9ab8ff')
      const rand = (a: number, b: number) => a + Math.random() * (b - a)
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = rand(-8, 8)
        positions[i * 3 + 1] = rand(-5, 5)
        positions[i * 3 + 2] = rand(-7, 2)
        const c = cA.clone().lerp(cB, Math.random())
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geo.setDrawRange(0, 0) // começa vazio → preenche aos poucos no tick
      const mat = new THREE.PointsMaterial({
        size: 0.038,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
        depthWrite: false,
      })
      const points = new THREE.Points(geo, mat)
      scene.add(points)

      // --- elementos flutuantes (wireframe azure/cyan, fracos; entram um a um) ---
      const floaters = new THREE.Group()
      scene.add(floaters)
      const azure = 0xff665c
      const cyan = 0xe8deff
      const makeMat = (color: number, opacity: number, wireframe: boolean) =>
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, wireframe, depthWrite: false })

      type Floater = { mesh: THREE.Mesh; sx: number; sy: number; base: number; birth: number }
      const shapes: Floater[] = []
      const addShape = (
        geom: THREE.BufferGeometry,
        opacity: number,
        color: number,
        wireframe: boolean,
        pos: [number, number, number],
        sx: number,
        sy: number,
        birth: number
      ) => {
        const m = new THREE.Mesh(geom, makeMat(color, opacity, wireframe))
        m.position.set(pos[0], pos[1], pos[2])
        floaters.add(m)
        shapes.push({ mesh: m, sx, sy, base: opacity, birth })
        return m
      }
      // anel-assinatura (toro fino) → depois icosaedro → octaedro → barra
      const ring = addShape(new THREE.TorusGeometry(0.95, 0.012, 8, 140), 0.42, azure, false, [-2.3, 1.35, -0.4], 0.0009, 0.0016, 0.9)
      ring.rotation.set(1.1, 0.3, 0)
      addShape(new THREE.IcosahedronGeometry(0.5, 0), 0.32, azure, true, [-2.7, -1.5, 0.2], 0.0016, 0.0011, 1.3)
      addShape(new THREE.OctahedronGeometry(0.42, 0), 0.3, cyan, true, [2.5, -1.7, -0.8], -0.0013, 0.0018, 1.7)
      addShape(new THREE.BoxGeometry(1.1, 0.05, 0.05), 0.38, azure, false, [2.1, 1.7, -1.1], 0.0007, -0.0012, 2.1)

      // --- parallax de mouse ---
      let tmx = 0
      let tmy = 0
      let mx = 0
      let my = 0
      const onMove = (e: MouseEvent) => {
        tmx = e.clientX / window.innerWidth - 0.5
        tmy = e.clientY / window.innerHeight - 0.5
      }
      window.addEventListener('mousemove', onMove)

      const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
      const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
      const REVEAL = 2.6 // duração do "aos poucos" (t ~ segundos)
      let t = 0
      let prevScroll = 0
      let vel = 0 // velocidade de scroll suavizada (px/frame)
      let lean = 0 // inclinação do rig (mola)

      const tick = () => {
        raf = requestAnimationFrame(tick)
        // Posição/velocidade de scroll vindas do rect PINTADO da canvas → sincroniza
        // com o ScrollSmoother. rect.top: 0 no topo, -vh conforme a hero sobe.
        const rect = canvas.getBoundingClientRect()
        const vh = window.innerHeight || 1
        if (rect.bottom <= 0 || rect.top >= vh) {
          prevScroll = -rect.top
          return // fora da tela → pula o render
        }
        const scroll = -rect.top
        const progress = clamp01(scroll / vh)
        const rawVel = scroll - prevScroll
        prevScroll = scroll
        vel += (rawVel - vel) * 0.15
        const fade = clamp01(1 - scroll / (vh * 0.78))

        t += 0.016
        mx += (tmx - mx) * 0.04
        my += (tmy - my) * 0.04

        // REVEAL "aos poucos": cresce o nº de pontos desenhados (intro, uma vez)
        const reveal = easeOut(clamp01(t / REVEAL))
        geo.setDrawRange(0, Math.floor(reveal * COUNT))

        // câmera atravessa o campo conforme rola (flythrough suave) + leve subida
        camera.position.z = 6 - progress * 1.1
        camera.position.y = progress * 0.32 + my * 0.2
        camera.position.x = mx * 0.4
        camera.lookAt(0, 0, 0)

        // inclinação do rig pela velocidade de scroll (mola: volta ao repouso)
        const targetLean = Math.max(-0.32, Math.min(0.32, vel * 0.02))
        lean += (targetLean - lean) * 0.08

        // campo de partículas: giro base + kick leve por velocidade; parallax suave
        points.rotation.y += 0.0005 + Math.abs(vel) * 0.0004
        points.rotation.z = lean * 0.35
        points.position.y = Math.sin(t * 0.3) * 0.05 + scroll * 0.0008
        mat.opacity = 0.5 * fade * (0.85 + Math.sin(t * 0.6) * 0.15)

        // flutuantes: parallax + tumble próprio; cada um entra no seu "birth"
        floaters.rotation.y += 0.0009 + Math.abs(vel) * 0.0008
        floaters.rotation.z = lean * 0.8
        floaters.position.y = Math.sin(t * 0.25) * 0.08 + scroll * 0.002
        for (const s of shapes) {
          s.mesh.rotation.x += s.sx + Math.abs(vel) * 0.0009
          s.mesh.rotation.y += s.sy
          const intro = clamp01((t - s.birth) / 0.8) // fade-in escalonado
          ;(s.mesh.material as THREE.MeshBasicMaterial).opacity = s.base * fade * intro
        }

        renderer.render(scene, camera)
      }
      tick()

      cleanup = () => {
        window.removeEventListener('resize', size)
        window.removeEventListener('mousemove', onMove)
        geo.dispose()
        mat.dispose()
        floaters.traverse((o) => {
          const m = o as THREE.Mesh
          if (m.geometry) m.geometry.dispose()
          if (m.material) (m.material as THREE.Material).dispose()
        })
        renderer.dispose()
      }
    })
    })

    return () => {
      disposed = true
      stopIdle()
      cancelAnimationFrame(raf)
      cleanup()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  )
}
