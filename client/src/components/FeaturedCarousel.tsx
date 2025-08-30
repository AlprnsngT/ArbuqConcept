"use client"
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function FeaturedCarousel({ products }: { products: any[] }) {
  const [index, setIndex] = useState(0)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timer.current && clearInterval(timer.current)
    timer.current = setInterval(() => setIndex((i) => (i + 1) % products.length), 4000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [products.length])

  const prev = () => setIndex((i) => (i - 1 + products.length) % products.length)
  const next = () => setIndex((i) => (i + 1) % products.length)

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-luxe">
      <AnimatePresence mode="wait">
        {products.map((p, i) => i === index && (
          <motion.div key={p.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <Link href={`/products/${p.slug}`} className="absolute inset-0">
              <Image src={p.images[0]} alt={p.name} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/0" />
              <div className="absolute left-6 bottom-6 text-white">
                <div className="font-display text-2xl tracking-[0.3em]">ARBUQ<span className="text-gold">CONCEPT</span></div>
                <div className="mt-1 text-sm opacity-90">{p.name}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur rounded-full p-2"><ChevronLeft /></button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur rounded-full p-2"><ChevronRight /></button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {products.map((_, i) => (
          <span key={i} className={`h-1.5 w-5 rounded-full ${i===index ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  )
}

