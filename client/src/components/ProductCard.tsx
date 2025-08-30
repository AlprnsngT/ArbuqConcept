"use client"
import Link from 'next/link'
import Image from 'next/image'
import { RatingStars } from './RatingStars'
import { motion } from 'framer-motion'

export function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block" aria-label={product.name}>
      <motion.div className="card overflow-hidden" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
        <div className="relative aspect-square w-full">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{product.name}</h3>
            <span className="text-sm">${product.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <div className="flex items-center gap-2"><RatingStars value={product.avgRating} /><span className="ml-1">({product.reviewCount})</span></div>
            <span>Stock: {product.stock}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

