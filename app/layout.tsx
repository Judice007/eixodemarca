import type { Metadata } from 'next'
import { Inter, Cal_Sans } from 'next/font/google'
import './globals.css'
import { contactInfo } from '@/lib/data'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

// Fonte principal da marca.
const calSans = Cal_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cal-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
})

// Itálico à parte e sem preload: só um rótulo curto do celular usa. Antes ia
// junto, pré-carregado em todas as páginas (51KB).
const interItalic = Inter({
  subsets: ['latin'],
  style: 'italic',
  preload: false,
  variable: '--font-inter-italic',
  display: 'swap',
})

const HOME_TITLE = `${SITE_NAME} | Social media, design e vídeo em Angra dos Reis`

export function generateMetadata(): Metadata {
  const socialImage = `${SITE_URL}/og.jpg`

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: HOME_TITLE, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    icons: {
      icon: '/eixo-icon.png',
      apple: '/eixo-icon.png',
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      url: '/',
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
      images: [{ url: socialImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
      images: [socialImage],
    },
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/eixo-symbol.png`,
  image: `${SITE_URL}/og.jpg`,
  description: SITE_DESCRIPTION,
  telephone: `+${contactInfo.phone}`,
  email: contactInfo.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Angra dos Reis',
    addressRegion: 'RJ',
    addressCountry: 'BR',
  },
  areaServed: 'Angra dos Reis',
  sameAs: [contactInfo.instagram],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${calSans.variable} ${inter.variable} ${interItalic.variable}`}>
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
