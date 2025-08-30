import type { Metadata } from 'next'
import { ProductDetailClient } from '../../../components/ProductDetailClient'
import { getProductBySlug } from '../../../data/products'

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
    </>
  )
}

