import type { Metadata } from 'next'
import { Inter, Instrument_Serif, Montserrat, Syncopate } from 'next/font/google'
import './globals.css'

const SITE_URL = 'https://eixodemarca.vercel.app'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
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

export function generateMetadata(): Metadata {
  const socialImage = `${SITE_URL}/og.jpg`

  return {
    metadataBase: new URL(SITE_URL),
    title: 'Eixo de Marca — Social Media, Design & Gestão',
    description: 'Social media, design, identidade visual, edição de vídeo, gestão de projetos, landing pages e tráfego pago para marcas que querem crescer.',
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: '/eixo-icon.png',
      apple: '/eixo-icon.png',
    },
    openGraph: {
      title: 'Eixo de Marca — Social Media, Design & Gestão',
      description: 'Social media, design, identidade visual, edição de vídeo, gestão de projetos, landing pages e tráfego pago para marcas que querem crescer.',
      type: 'website',
      locale: 'pt_BR',
      images: [{ url: socialImage, width: 1200, height: 630, alt: 'Eixo de Marca' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Eixo de Marca — Social Media, Design & Gestão',
      description: 'Conteúdo, design, vídeo e gestão para marcas que querem crescer.',
      images: [socialImage],
    },
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Eixo de Marca',
  url: SITE_URL,
  logo: `${SITE_URL}/eixo-symbol.png`,
  description: 'Social media, design, identidade visual, edição de vídeo, gestão de projetos, landing pages e tráfego pago para marcas que querem crescer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${inter.variable} ${instrument.variable} ${syncopate.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
