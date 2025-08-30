import type { Metadata } from 'next'
import { ProductDetailClient } from '../../../components/ProductDetailClient'
import { getProductBySlug, getAllProducts } from '../../../data/products'
import Link from 'next/link'

type PageProps = { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  const title = `${product.name} — ArbuqConcept`
  const description = product.description
  const image = product.images[0]
  return {
    title,
    description,
    keywords: ['candle', product.color, product.scented ? 'scented' : 'unscented', 'handmade'],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug)
  const related = getAllProducts().filter(p => p.id !== product.id).slice(0,4)
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images[0],
    sku: product.id,
    brand: { '@type': 'Brand', name: 'ArbuqConcept' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.avgRating,
      reviewCount: product.reviewCount,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={product} />
      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map(r => (
            <Link key={r.id} href={`/products/${r.slug}`} className="card overflow-hidden block">
              <div className="relative aspect-square w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.images[0]} alt={r.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm">{r.name}</span>
                <span className="text-sm">${r.price.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

