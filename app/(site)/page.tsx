import type { Metadata } from 'next'
import EixoEditorialSite from '@/components/EixoEditorialSite'

// Só a home declara canonical '/': as outras páginas definem o próprio via
// pageMeta, e nenhuma herda "eu sou a home".
export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function Home() {
  return <EixoEditorialSite />
}
