'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Intro({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('intro-seen')) {
      onComplete()
      return
    }

    const steps = 5
    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= steps) {
          clearInterval(interval)
          setExiting(true)
          setTimeout(() => {
            sessionStorage.setItem('intro-seen', '1')
            onComplete()
          }, 950)
          return c
        }
        return c + 1
      })
    }, 260)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className={`intro-screen${exiting ? ' exit' : ''}`}>
      <span
        className="font-syncopate text-white tabular-nums"
        style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
      >
        {String(count).padStart(2, '0')}
      </span>
      <Image
        src="/eixo-wordmark.png"
        alt="Eixo de Marca"
        width={1515}
        height={573}
        priority
        className="h-[20px] w-auto opacity-80"
      />
      <div
        className="intro-progress"
        style={{ width: `${(count / 5) * 100}%` }}
      />
    </div>
  )
}
