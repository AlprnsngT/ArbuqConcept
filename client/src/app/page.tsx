import { Header, CompanySlider, ProductGrid, Footer } from '../components'
import { getCampaignProducts } from '../data/products'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ArbuqConcept — Luxury Handmade Candles',
  description: 'Discover featured luxury handmade candles with premium scents and elegant design.',
}

export default function HomePage() {
  const campaignProducts = getCampaignProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Company Slider Section */}
        <section className="mb-16">
          <CompanySlider />
        </section>

        {/* Campaign Products Section */}
        <section className="mb-16">
          <ProductGrid products={campaignProducts} />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

