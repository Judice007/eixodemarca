'use client'

import { useEffect, useRef } from 'react'
import type * as Three from 'three'
import { reelState } from '@/lib/reelState'
import { isMobileViewport } from '@/lib/capability'
import { onceNearViewport } from '@/lib/nearViewport'

// The reel card rendered in WebGL: the project image with a real fluid-displacement
// shader (fbm-noise flow) + a luminance-based blue duotone — driven by `reelState`,
// which the GSAP scrub timeline animates. Fills its (rounded, clipped) DOM parent.
const IMG = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=90'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uTime, uDisp, uDuotone, uImgAspect, uPlaneAspect, uHasTex;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    // 4 oitavas (era 5): a 5ª tinha amplitude ~0.03, detalhe de alta-freq imperceptível.
    for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
  vec2 cover(vec2 uv){
    float r = uPlaneAspect / uImgAspect;
    if (r > 1.0) uv = vec2((uv.x - 0.5) / r + 0.5, uv.y);
    else         uv = vec2(uv.x, (uv.y - 0.5) * r + 0.5);
    return uv;
  }
  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.25;

    // --- vortex / whirlpool ("aquoso") around a slowly drifting centre ---
    vec2 c = vec2(0.6 + 0.05 * sin(uTime * 0.3), 0.5 + 0.04 * cos(uTime * 0.27));
    vec2 d = uv - c;
    float r = length(d);
    float ang = atan(d.y, d.x);
    float swirl = uDisp * (1.0 - smoothstep(0.0, 0.62, r)) * 3.4;       // tight near centre
    swirl += (fbm(uv * 2.5 + t) - 0.5) * uDisp * 1.3;                   // turbulent edges
    ang += swirl;
    uv = c + vec2(cos(ang), sin(ang)) * r;

    vec3 col = uHasTex > 0.5 ? texture2D(uTex, cover(clamp(uv, 0.0, 1.0))).rgb : vec3(0.07, 0.09, 0.16);

    // --- luminance-based blue duotone ---
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 duo = mix(vec3(0.03, 0.07, 0.40), vec3(0.62, 0.74, 1.0), pow(lum, 0.9));
    col = mix(col, duo, uDuotone);

    // --- floating shards (drifting bright-blue specks; live while cradled/blue) ---
    float sh = 0.0;
    for (int i = 0; i < 4; i++){
      float fi = float(i);
      vec2 sp = vec2(
        fract(sin(fi * 12.9) * 43758.5 + uTime * 0.03 * (0.5 + fract(fi * 0.37))),
        fract(cos(fi * 7.7) * 1234.5 - uTime * 0.025 * (0.4 + fract(fi * 0.21)))
      );
      float dd = length((uv - sp) * vec2(uPlaneAspect, 1.0));
      sh += smoothstep(0.028, 0.0, dd) * (0.4 + 0.6 * fract(fi * 0.53));
    }
    col += vec3(0.45, 0.6, 1.0) * sh * uDuotone * 0.6;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function ReelCardGL() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (isMobileViewport()) return // sem WebGL no mobile (o reel vira card estático)
    let raf = 0
    let disposed = false
    let cleanup = () => {}

    // Init preguiçoso: o shader fbm + renderer só sobem quando o reel se aproxima,
    // fora da janela de load (antes era criado no mount, travando o carregamento).
    const stopIO = onceNearViewport(canvas, () => {
    import('three').then((THREE) => {
      if (disposed) return
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0))
      const scene = new THREE.Scene()
      const camera = new THREE.Camera()

      const uniforms = {
        uTex: { value: null as Three.Texture | null },
        uHasTex: { value: 0 },
        uTime: { value: 0 },
        uDisp: { value: 0 },
        uDuotone: { value: 1 },
        uImgAspect: { value: 1.6 },
        uPlaneAspect: { value: 16 / 9 },
      }
      const geo = new THREE.PlaneGeometry(2, 2)
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
      scene.add(new THREE.Mesh(geo, mat))

      const loader = new THREE.TextureLoader()
      loader.setCrossOrigin('anonymous')
      loader.load(IMG, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        uniforms.uTex.value = tex
        uniforms.uImgAspect.value = tex.image.width / tex.image.height
        uniforms.uHasTex.value = 1
      })

      // O card anima width/height durante o scrub. Antes o setSize (realloc do buffer
      // da GPU) rodava a cada frame; agora só quando o tamanho muda além de um limiar —
      // corta a maioria dos reallocs sem perda de nitidez perceptível. uPlaneAspect
      // (uniform barato) segue exato todo frame, então o vórtice não distorce.
      // O card cresce até full-bleed durante o scrub e o shader fbm é fill-rate-bound:
      // renderizar 1:1 (ainda mais em DPR alto) custa caro. Renderizamos a 0.75x da área
      // (buffer menor; o CSS faz upscale — imperceptível numa imagem fluida/deslocada) e
      // só reescalamos quando muda além de um limiar (evita realloc de buffer por frame).
      const RENDER_SCALE = 0.75
      let lastW = 0
      let lastH = 0
      const SIZE_STEP = 24 // px (na escala de render)
      const syncSize = () => {
        const w = Math.round((canvas.clientWidth || 960) * RENDER_SCALE)
        const h = Math.round((canvas.clientHeight || 540) * RENDER_SCALE)
        uniforms.uPlaneAspect.value = w / h
        if (Math.abs(w - lastW) >= SIZE_STEP || Math.abs(h - lastH) >= SIZE_STEP) {
          renderer.setSize(w, h, false)
          lastW = w
          lastH = h
        }
      }

      let time = 0
      const tick = () => {
        raf = requestAnimationFrame(tick)
        // pausa quando o card está fora da tela (economiza GPU/CPU — o shader fbm é
        // caro e rodava todo frame mesmo invisível). Mesmo guard de FooterGL/HeroParticles.
        const rect = canvas.getBoundingClientRect()
        const vh = window.innerHeight || 1
        if (rect.bottom <= 0 || rect.top >= vh) return
        syncSize()
        time += 0.016
        uniforms.uTime.value = time
        uniforms.uDisp.value = reelState.disp
        uniforms.uDuotone.value = reelState.duotone
        renderer.render(scene, camera)
      }
      tick()

      cleanup = () => {
        geo.dispose()
        mat.dispose()
        uniforms.uTex.value?.dispose()
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
  }, [])

  return <canvas ref={ref} className="absolute inset-0 size-full" />
}
