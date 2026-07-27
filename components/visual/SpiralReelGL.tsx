'use client'

import { useEffect, useRef } from 'react'
import type * as Three from 'three'
import { onceNearViewport } from '@/lib/nearViewport'
import { spiralReelState } from '@/lib/spiralReelState'
import { cardState, CARD_COUNT, CARD_W, CARD_H, GRID_SCALE, SPIRAL_ROUNDED, GRID_ROUNDED, SPIRAL_BEND, SPIRAL } from '@/lib/spiralReel'

// Default placeholder mockups (used by the /lab page). Production callers pass
// their own `images` (e.g. WorkLusion passes the real project covers).
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
]

// Bend the card's WIDTH around a vertical axis so it curves to follow the coil
// (trionn-style fold) instead of staying a flat rectangle. uBend 0 = flat, 1 =
// curved to uBendRadius (the helix radius); the edges recede toward the coil axis.
// The plane needs several width segments for a smooth curve (set on the geometry).
const VERT = `
  uniform float uBend;
  uniform float uBendRadius;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float ang = p.x / uBendRadius;              // angle this vertex subtends on the coil
    float bx = uBendRadius * sin(ang);          // arc-projected x
    float bz = -uBendRadius * (1.0 - cos(ang)); // edges pull inward (−z = toward axis)
    p.x = mix(p.x, bx, uBend);
    p.z = mix(p.z, bz, uBend);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

// Rounded-rect card: a signed-distance mask feathers the corners so each plane
// reads as a rounded card, not a hard rectangle. Texture is converted sRGB→linear
// here (the renderer re-encodes to sRGB on output) since a raw ShaderMaterial
// bypasses three's automatic colour management.
const FRAG = `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uAspect;
  uniform float uRadius;
  uniform float uHasMap;
  varying vec2 vUv;
  float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + vec2(r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    vec2 b = vec2(0.5 * uAspect, 0.5);
    float d = sdRoundedBox(p, b, uRadius);
    float alpha = 1.0 - smoothstep(-0.006, 0.006, d);
    vec4 tex = texture2D(uMap, vUv);
    vec3 lin = pow(tex.rgb, vec3(2.2));
    gl_FragColor = vec4(lin, alpha * uOpacity * uHasMap);
  }
`

// The snake-climbs-then-settles-into-a-grid reel (trionn.com treatment), in raw
// Three.js — mirrors ReelCardGL's lazy-init + visibility-guard pattern. Each
// frame we read cardState() (spiral target + grid target + morph) and blend:
// SLERP the orientation between the two frames and LERP the position, so the
// snake unrolls cleanly into a flat 3×2 grid. Driven by spiralReelState.progress,
// which the host section's scrubbed ScrollTrigger writes each frame.
//
// `images` must be a STABLE reference (module-level const) — it's a useEffect dep,
// so a new array each render would re-init the whole WebGL context.
export default function SpiralReelGL({ images = DEFAULT_IMAGES }: { images?: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let disposed = false
    let cleanup = () => {}

    const stopIO = onceNearViewport(canvas, () => {
      import('three').then((THREE) => {
        if (disposed) return

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
        camera.position.set(0, 0, SPIRAL.cameraZ)
        camera.lookAt(0, 0, 0)

        const loader = new THREE.TextureLoader()
        loader.setCrossOrigin('anonymous')
        // 1×1 transparent default so the sampler is always bound (uHasMap gates it)
        const dummy = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1)
        dummy.needsUpdate = true

        const cards = Array.from({ length: CARD_COUNT }, (_, i) => {
          const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, 32, 1) // 32 width segments → smooth bend
          const mat = new THREE.ShaderMaterial({
            uniforms: {
              uMap: { value: dummy },
              uOpacity: { value: 0 },
              uAspect: { value: CARD_W / CARD_H },
              uRadius: { value: SPIRAL_ROUNDED * 0.5 }, // set per-frame; 0..1 roundness → 0..0.5 radius
              uBend: { value: SPIRAL_BEND }, // set per-frame: SPIRAL_BEND on the coil → 0 in the grid
              uBendRadius: { value: SPIRAL.radius }, // curve the card to the coil's radius
              uHasMap: { value: 0 },
            },
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthWrite: false, // painter-sorted transparency (renderOrder set per frame)
            side: THREE.DoubleSide,
          })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.matrixAutoUpdate = false // we drive mesh.matrix directly from blended frames
          scene.add(mesh)
          loader.load(images[i % images.length], (tex) => {
            mat.uniforms.uMap.value = tex // sRGB→linear handled in the shader
            mat.uniforms.uHasMap.value = 1
          })
          return mesh
        })

        // reused scratch (no per-frame allocation)
        const vR = new THREE.Vector3()
        const vU = new THREE.Vector3()
        const vN = new THREE.Vector3()
        const posA = new THREE.Vector3()
        const posB = new THREE.Vector3()
        const posOut = new THREE.Vector3()
        const qA = new THREE.Quaternion()
        const qB = new THREE.Quaternion()
        const qOut = new THREE.Quaternion()
        const basis = new THREE.Matrix4()
        const scaleVec = new THREE.Vector3()

        const quatFrom = (r: number[], u: number[], n: number[], out: Three.Quaternion) => {
          vR.set(r[0], r[1], r[2])
          vU.set(u[0], u[1], u[2])
          vN.set(n[0], n[1], n[2])
          basis.makeBasis(vR, vU, vN)
          out.setFromRotationMatrix(basis)
        }

        const syncSize = () => {
          const w = canvas.clientWidth || 960
          const h = canvas.clientHeight || 540
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h, false)
        }
        syncSize()
        window.addEventListener('resize', syncSize)

        const tick = () => {
          raf = requestAnimationFrame(tick)
          const rect = canvas.getBoundingClientRect()
          const vh = window.innerHeight || 1
          if (rect.bottom <= 0 || rect.top >= vh) return

          const p = spiralReelState.progress
          cards.forEach((mesh, i) => {
            const s = cardState(p, i)
            quatFrom(s.spiralRight, s.spiralUp, s.spiralNormal, qA)
            quatFrom(s.gridRight, s.gridUp, s.gridNormal, qB)
            qOut.copy(qA).slerp(qB, s.morph)
            posA.set(s.spiralPos[0], s.spiralPos[1], s.spiralPos[2])
            posB.set(s.gridPos[0], s.gridPos[1], s.gridPos[2])
            posOut.lerpVectors(posA, posB, s.morph)
            // Mirror the whole animation across the vertical axis so it rises to the
            // RIGHT (cards enter from the right). Reflecting a camera-facing card is a
            // proper rotation — negate pos.x and the quaternion's y,z — so textures are
            // NOT flipped (a basis-vector mirror would break the quaternion instead).
            posOut.x = -posOut.x
            qOut.y = -qOut.y
            qOut.z = -qOut.z
            // full size on the spiral (big + near as it passes); shrink to GRID_SCALE as it
            // morphs into the grid so the (independent) grid card size is reached
            scaleVec.setScalar(1 - (1 - GRID_SCALE) * s.morph)
            mesh.matrix.compose(posOut, qOut, scaleVec)
            mesh.renderOrder = posOut.z // nearer camera → drawn later
            const u = (mesh.material as Three.ShaderMaterial).uniforms
            u.uOpacity.value = s.opacity
            // corner roundness morphs from the spiral value to the grid value (0..1 → 0..0.5 radius)
            u.uRadius.value = (SPIRAL_ROUNDED + (GRID_ROUNDED - SPIRAL_ROUNDED) * s.morph) * 0.5
            // bend: curved to the coil on the spiral, flattening to a rigid tile in the grid
            u.uBend.value = SPIRAL_BEND * (1 - s.morph)
          })

          renderer.render(scene, camera)
        }
        tick()

        cleanup = () => {
          window.removeEventListener('resize', syncSize)
          dummy.dispose()
          cards.forEach((mesh) => {
            mesh.geometry.dispose()
            const mat = mesh.material as Three.ShaderMaterial
            ;(mat.uniforms.uMap.value as Three.Texture | null)?.dispose?.()
            mat.dispose()
          })
          renderer.dispose()
        }
      })
    })

    return () => {
      disposed = true
      stopIO()
      cancelAnimationFrame(raf)
      cleanup()
    }
  }, [images])

  return <canvas ref={ref} className="absolute inset-0 size-full" />
}
