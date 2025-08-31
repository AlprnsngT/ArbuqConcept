export type Review = {
  id: string
  productId: string
  userId: string
  rating: number
  text: string
  createdAt: string
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  stock: number
  color: 'black' | 'white' | 'amber' | 'clear'
  scented: boolean
  images: string[]
  avgRating: number
  reviewCount: number
}

// Mock data - 10 kampanyalı ürün
let products: Product[] = [
  {
    id: 'p1',
    slug: 'noir-amber-12oz',
    name: 'Noir Amber 12oz',
    description: 'Hand-poured soy wax candle with notes of amber, sandalwood, and smoked cedar. Housed in a matte black vessel.',
    price: 42,
    stock: 12,
    color: 'black',
    scented: true,
    images: ['/images/noir-amber.svg'],
    avgRating: 4.6,
    reviewCount: 18,
  },
  {
    id: 'p2',
    slug: 'linen-rose-8oz',
    name: 'Linen Rose 8oz',
    description: 'Light and airy with rose petals and fresh linen. Minimal glass vessel for every interior.',
    price: 28,
    stock: 7,
    color: 'clear',
    scented: true,
    images: ['/images/linen-rose.svg'],
    avgRating: 4.4,
    reviewCount: 9,
  },
  {
    id: 'p3',
    slug: 'unscented-pillar-4in',
    name: 'Unscented Pillar 4in',
    description: 'Pure unscented pillar for table settings and mindful rituals.',
    price: 16,
    stock: 30,
    color: 'white',
    scented: false,
    images: ['/images/pillar-white.svg'],
    avgRating: 4.2,
    reviewCount: 6,
  },
  {
    id: 'p4',
    slug: 'smoked-oak-16oz',
    name: 'Smoked Oak 16oz',
    description: 'Deep, resinous, and complex. Smoked oak and black pepper in an amber glass.',
    price: 54,
    stock: 3,
    color: 'amber',
    scented: true,
    images: ['/images/smoked-oak.svg'],
    avgRating: 4.8,
    reviewCount: 24,
  },
  {
    id: 'p5',
    slug: 'midnight-fig-10oz',
    name: 'Midnight Fig 10oz',
    description: 'Ripe fig, violet leaf, and cassis. Elegant and modern profile.',
    price: 36,
    stock: 10,
    color: 'black',
    scented: true,
    images: ['/images/midnight-fig.svg'],
    avgRating: 4.5,
    reviewCount: 11,
  },
  {
    id: 'p6',
    slug: 'studio-taper-pair',
    name: 'Studio Taper Pair',
    description: 'Hand-dipped taper candles for dining. Subtle off-white tone.',
    price: 22,
    stock: 25,
    color: 'white',
    scented: false,
    images: ['/images/taper-pair.svg'],
    avgRating: 4.1,
    reviewCount: 5,
  },
  {
    id: 'p7',
    slug: 'vanilla-bean-14oz',
    name: 'Vanilla Bean 14oz',
    description: 'Rich and creamy vanilla with hints of caramel. Perfect for cozy evenings.',
    price: 38,
    stock: 15,
    color: 'white',
    scented: true,
    images: ['/images/pillar-white.svg'],
    avgRating: 4.7,
    reviewCount: 32,
  },
  {
    id: 'p8',
    slug: 'lavender-fields-6oz',
    name: 'Lavender Fields 6oz',
    description: 'Soothing lavender with fresh herbs. Ideal for relaxation and meditation.',
    price: 24,
    stock: 20,
    color: 'clear',
    scented: true,
    images: ['/images/linen-rose.svg'],
    avgRating: 4.3,
    reviewCount: 14,
  },
  {
    id: 'p9',
    slug: 'cinnamon-spice-20oz',
    name: 'Cinnamon Spice 20oz',
    description: 'Warm cinnamon with clove and nutmeg. Creates a festive atmosphere.',
    price: 48,
    stock: 8,
    color: 'amber',
    scented: true,
    images: ['/images/smoked-oak.svg'],
    avgRating: 4.9,
    reviewCount: 28,
  },
  {
    id: 'p10',
    slug: 'ocean-breeze-9oz',
    name: 'Ocean Breeze 9oz',
    description: 'Fresh sea salt with citrus notes. Brings the ocean to your home.',
    price: 32,
    stock: 18,
    color: 'clear',
    scented: true,
    images: ['/images/linen-rose.svg'],
    avgRating: 4.4,
    reviewCount: 16,
  },
]

let reviews: Review[] = [
  { id: 'r1', productId: 'p1', userId: 'u1', rating: 5, text: 'Luxurious scent that fills the room.', createdAt: new Date().toISOString() },
  { id: 'r2', productId: 'p2', userId: 'u2', rating: 4, text: 'Light and pleasant.', createdAt: new Date(Date.now()-86400000).toISOString() },
  { id: 'r3', productId: 'p4', userId: 'u1', rating: 5, text: 'Incredible depth.', createdAt: new Date(Date.now()-172800000).toISOString() },
]

export function getAllProducts(): Product[] {
  return products
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 6)
}

export function getCampaignProducts(): Product[] {
  return products // Tüm 10 ürün kampanyalı
}

export function getProductBySlug(slug: string): Product {
  const found = products.find(p => p.slug === slug)
  if (!found) throw new Error('Product not found')
  return found
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter(r => r.productId === productId)
}

export function addMockReview({ productId, userId, rating, text }: { productId: string; userId: string; rating: number; text: string }) {
  const id = `r_${Math.random().toString(36).slice(2,8)}`
  reviews = [{ id, productId, userId, rating, text, createdAt: new Date().toISOString() }, ...reviews]
}

