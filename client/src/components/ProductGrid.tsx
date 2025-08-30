"use client"
import { ProductCard } from './ProductCard'
import { motion } from 'framer-motion'

export function ProductGrid({ products }: { products: any[] }) {
  return (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } }}}>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  )
}

