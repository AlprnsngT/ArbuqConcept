"use client"
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { Product } from '../../data/products'

interface CampaignSliderProps {
  products: Product[]
}

export function CampaignSlider({ products }: CampaignSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 5 saniyede bir otomatik geçiş
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    }, 5000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [products.length])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length),
    onSwipedRight: () => setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length),
    trackMouse: true
  })

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
          <span className="animate-pulse">🔥</span>
          <span>KAMPANYA</span>
          <span className="animate-pulse">🔥</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Özel Fırsatlar
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sınırlı süre için özel fiyatlarla sunulan premium mumlarımızı keşfedin
        </p>
      </div>

      {/* Main Slider Container */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div 
          className="relative p-8 rounded-3xl overflow-hidden"
          {...swipeHandlers}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Current Product */}
              <div>
                <motion.div
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      %25 İNDİRİM
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={products[currentIndex].images[0]}
                      alt={products[currentIndex].name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                        {products[currentIndex].name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < Math.floor(products[currentIndex].avgRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {products[currentIndex].description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-amber-600">
                          ₺{products[currentIndex].price}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          ₺{Math.round(products[currentIndex].price * 1.33)}
                        </span>
                      </div>
                      <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-2">
                        <ShoppingCart size={16} />
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Next 2 Products */}
              {[1, 2].map((offset) => {
                const productIndex = (currentIndex + offset) % products.length
                const product = products[productIndex]
                
                return (
                  <motion.div
                    key={product.id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: offset * 0.1 }}
                  >
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        %20 İNDİRİM
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < Math.floor(product.avgRating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-amber-600">
                            ₺{product.price}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ₺{Math.round(product.price * 1.25)}
                          </span>
                        </div>
                        <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-2">
                          <ShoppingCart size={16} />
                          Sepete Ekle
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-amber-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
