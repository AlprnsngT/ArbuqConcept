"use client"
import { useMemo, useState } from 'react'
import { getProductBySlug, getReviewsForProduct, addMockReview } from '../../../data/products'
import { RatingStars } from '../../../components/RatingStars'
import Image from 'next/image'
import { useCart } from '../../../components/CartContext'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  const { addToCart } = useCart()
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)

  const reviews = useMemo(() => {
    const r = getReviewsForProduct(product.id)
    if (sort === 'highest') return [...r].sort((a,b)=>b.rating-a.rating)
    if (sort === 'lowest') return [...r].sort((a,b)=>a.rating-b.rating)
    return [...r].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
  }, [product.id, sort])

  const submitReview = () => {
    if (!text.trim()) return
    addMockReview({ productId: product.id, rating, text, userId: 'u_demo' })
    setText('')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="card p-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars value={product.avgRating} />
            <span className="text-sm text-neutral-600">{product.reviewCount} reviews</span>
          </div>
        </div>
        <p className="text-xl">${product.price.toFixed(2)}</p>
        <p className="text-neutral-700 leading-relaxed">{product.description}</p>
        <div className="text-sm text-neutral-600">Stock: {product.stock}</div>
        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={() => addToCart(product, 1)}>Add to Cart</button>
          <a className="btn btn-outline" href="/cart">Go to Cart</a>
        </div>
        <div className="pt-8 border-t">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Reviews</h2>
            <select value={sort} onChange={e=>setSort(e.target.value as any)} className="border rounded-md px-3 py-2 bg-white">
              <option value="newest">Newest</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>
          <div className="mt-4 space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <RatingStars value={r.rating} />
                  <span className="text-xs text-neutral-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-neutral-800">{r.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 card p-4">
            <h3 className="font-medium mb-2">Add a review</h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm">Rating:</span>
              <input type="range" min={1} max={5} value={rating} onChange={e=>setRating(Number(e.target.value))} />
              <span>{rating}</span>
            </div>
            <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded-md p-3" rows={3} placeholder="Share your thoughts..." />
            <div className="mt-3 flex justify-end">
              <button onClick={submitReview} className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

