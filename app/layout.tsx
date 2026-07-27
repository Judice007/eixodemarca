import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Schibsted_Grotesk, Inter, Instrument_Serif, Syncopate } from 'next/font/google'
import './globals.css'

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-schibsted',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-syncopate',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? 'eixo-de-marca-studio.judice007.chatgpt.site'
  const protocol = requestHeaders.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https')
  const origin = `${protocol}://${host}`
  const socialImage = `${origin}/og.png`

  return {
    metadataBase: new URL(origin),
    title: 'Eixo de Marca — Estratégia & Criatividade',
    description: 'Direção estratégica, identidade, conteúdo, performance e tecnologia para marcas que querem ser lembradas.',
    icons: {
      icon: '/eixo-icon.png',
      apple: '/eixo-icon.png',
    },
    openGraph: {
      title: 'Eixo de Marca — Estratégia & Criatividade',
      description: 'Direção estratégica, identidade, conteúdo, performance e tecnologia para marcas que querem ser lembradas.',
      type: 'website',
      locale: 'pt_BR',
      images: [{ url: socialImage, width: 1200, height: 630, alt: 'Eixo de Marca' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Eixo de Marca — Estratégia & Criatividade',
      description: 'Direção estratégica para marcas que querem ser lembradas.',
      images: [socialImage],
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${schibsted.variable} ${inter.variable} ${instrument.variable} ${syncopate.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
