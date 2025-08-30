import type { Metadata } from 'next'
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import { Providers } from '../components/Providers'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'ArbuqConcept — Luxury Handmade Candles',
  description: 'A luxury, modern, and elegant e-commerce for handmade candles.',
  keywords: ['candles', 'handmade', 'luxury', 'scented', 'unscented', 'premium'],
  openGraph: {
    title: 'ArbuqConcept — Luxury Handmade Candles',
    description: 'Premium handmade candles for modern interiors.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArbuqConcept — Luxury Handmade Candles',
    description: 'Premium handmade candles for modern interiors.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="container-max py-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

