'use client'

import dynamic from 'next/dynamic'
import { useIsMobile } from '@/hooks/useIsMobile'

const Cursor = dynamic(() => import('./Cursor'), { ssr: false })

export default function IntroWrapper() {
  const isMobile = useIsMobile()
  // Overlay de intro (contagem 00–05) removido a pedido. Mantém só o cursor
  // custom no desktop (no toque ele não faz sentido).
  return <>{!isMobile && <Cursor />}</>
}
