"use client"
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { RatingStars } from './RatingStars'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import { addMockReview, getReviewsForProduct, Product } from '../data/products'

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [ratingFilter, setRatingFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)

  const allReviews = useMemo(() => getReviewsForProduct(product.id), [product.id])
  const breakdown = useMemo(() => {
    const map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1|2|3|4|5, number>
    allReviews.forEach(r => { map[r.rating as 1|2|3|4|5]++ })
    return map
  }, [allReviews])

  const reviews = useMemo(() => {
    let r = allReviews
    if (ratingFilter !== 'all') r = r.filter(rv => rv.rating === ratingFilter)
    if (sort === 'highest') return [...r].sort((a,b)=>b.rating-a.rating)
    if (sort === 'lowest') return [...r].sort((a,b)=>a.rating-b.rating)
    return [...r].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
  }, [allReviews, sort, ratingFilter])

  const submitReview = () => {
    if (!user) return
    if (!text.trim()) return
    addMockReview({ productId: product.id, rating, text, userId: user.id })
    setText('')
  }

  const total = allReviews.length || 1
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

        <section className="pt-8 border-t space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-medium">Reviews</h2>
            <div className="flex items-center gap-3">
              <label className="text-sm">Filter:</label>
              <select value={ratingFilter} onChange={e=>setRatingFilter((e.target.value==='all'?'all':Number(e.target.value)) as any)} className="border rounded-md px-3 py-2 bg-white">
                <option value="all">All</option>
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
              </select>
              <label className="text-sm">Sort:</label>
              <select value={sort} onChange={e=>setSort(e.target.value as any)} className="border rounded-md px-3 py-2 bg-white">
                <option value="newest">Newest</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="text-sm text-neutral-600">Rating breakdown</div>
              <div className="mt-3 space-y-2">
                {[5,4,3,2,1].map(star => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-8 text-sm">{star}★</span>
                    <div className="h-2 flex-1 bg-sand rounded">
                      <div className="h-2 bg-gold rounded" style={{ width: `${(breakdown[star as 1|2|3|4|5] / total)*100}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm">{breakdown[star as 1|2|3|4|5]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <RatingStars value={r.rating} />
                      <span className="text-xs text-neutral-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-neutral-800">{r.text}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-sm text-neutral-600">No reviews found for the selected filters.</div>
                )}
              </div>

              <div className="mt-6 card p-4">
                <h3 className="font-medium mb-2">Add a review</h3>
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm">Rating:</span>
                      <input aria-label="Rating" type="range" min={1} max={5} value={rating} onChange={e=>setRating(Number(e.target.value))} />
                      <span>{rating}</span>
                    </div>
                    <textarea aria-label="Review text" value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded-md p-3" rows={3} placeholder="Share your thoughts..." />
                    <div className="mt-3 flex justify-end">
                      <button onClick={submitReview} className="btn btn-primary">Submit</button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-neutral-700">Please <a className="underline" href="/sign-in">sign in</a> to leave a review.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

