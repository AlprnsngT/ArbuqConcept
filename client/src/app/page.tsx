import { FeaturedCarousel } from '../components/FeaturedCarousel'
import { ProductGrid } from '../components/ProductGrid'
import { getFeaturedProducts } from '../data/products'

export default function HomePage() {
  const products = getFeaturedProducts()
  return (
    <div className="space-y-14">
      <section>
        <FeaturedCarousel products={products} />
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Featured Candles</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  )
}

