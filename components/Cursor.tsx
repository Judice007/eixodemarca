'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  useEffect(() => {
    document.body.classList.add('cursor-ready')

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    const onDown = () => ringRef.current?.classList.add('cursor-click')
    const onUp = () => ringRef.current?.classList.remove('cursor-click')

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('[data-cursor="card"]')) {
        document.body.dataset.cursor = 'card'
      } else if (t.closest('a, button, [data-cursor="link"]')) {
        document.body.dataset.cursor = 'link'
      }
    }
    const onLeave = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('[data-cursor="card"], a, button, [data-cursor="link"]')) {
        delete document.body.dataset.cursor
      }
    }

    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(rafId.current)
      document.body.classList.remove('cursor-ready')
      delete document.body.dataset.cursor
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8,
          background: '#fff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10001,
          marginLeft: -4, marginTop: -4,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 40, height: 40,
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          marginLeft: -20, marginTop: -20,
          willChange: 'transform',
          transition: 'width 0.3s, height 0.3s, margin 0.3s, background 0.3s, border-radius 0.3s, border-color 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <span
          className="font-syncopate text-white uppercase"
          style={{ fontSize: 9, letterSpacing: 2, opacity: 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
        >
          VER →
        </span>
      </div>

      <style>{`
        body[data-cursor="link"] .cursor-ring {
          width: 60px; height: 60px;
          margin-left: -30px; margin-top: -30px;
          background: rgba(255,255,255,0.08);
        }
        body[data-cursor="card"] .cursor-ring {
          width: 72px; height: 72px;
          margin-left: -36px; margin-top: -36px;
          border-radius: 36px;
          background: rgba(0,104,195,0.15);
          border-color: rgba(0,104,195,0.8);
        }
        body[data-cursor="card"] .cursor-ring span { opacity: 1; }
        .cursor-ring.cursor-click {
          width: 20px; height: 20px;
          margin-left: -10px; margin-top: -10px;
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </>
  )
}
