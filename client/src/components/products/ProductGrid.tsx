"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '../../data/products'
import { useCart } from '../CartContext'
import { useState, useMemo } from 'react'

interface ProductGridProps {
  products: Product[]
  showViewAllButton?: boolean
}

type SortOption = 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc' | 'name-asc' | 'name-desc'

export function ProductGrid({ products, showViewAllButton = true }: ProductGridProps) {
  const { addToCart, items } = useCart()
  const [addedProductId, setAddedProductId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [showPerPage, setShowPerPage] = useState<number>(9)

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    setAddedProductId(product.id)
    
    // 2 saniye sonra başarı mesajını kaldır
    setTimeout(() => {
      setAddedProductId(null)
    }, 2000)
  }

  const getProductQuantity = (productId: string) => {
    const item = items.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  // Sıralama fonksiyonu
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating-asc':
          return a.avgRating - b.avgRating
        case 'rating-desc':
          return b.avgRating - a.avgRating
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })
  }, [products, sortBy])

  // Gösterilecek ürünleri sınırla
  const displayProducts = showViewAllButton 
    ? sortedProducts.slice(0, 6) 
    : sortedProducts.slice(0, showPerPage)

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'price-asc': return 'Fiyat (Düşükten Yükseğe)'
      case 'price-desc': return 'Fiyat (Yüksekten Düşüğe)'
      case 'rating-asc': return 'Puan (Düşükten Yükseğe)'
      case 'rating-desc': return 'Puan (Yüksekten Düşüğe)'
      case 'name-asc': return 'İsim (A-Z)'
      case 'name-desc': return 'İsim (Z-A)'
      default: return 'Sırala'
    }
  }

  return (
    <div className="w-full">
      {showViewAllButton && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kampanyalı Ürünler
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sınırlı süre için özel fiyatlarla sunulan premium mumlarımızı keşfedin
          </p>
        </div>
      )}

      {/* Sıralama ve Gösterim Seçenekleri - Sadece ürünler sayfasında göster */}
      {!showViewAllButton && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            {/* Sıralama Seçeneği */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="name-asc">İsim (A-Z)</option>
                <option value="name-desc">İsim (Z-A)</option>
                <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                <option value="rating-desc">Puan (Yüksekten Düşüğe)</option>
                <option value="rating-asc">Puan (Düşükten Yükseğe)</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Gösterim Sayısı */}
            <div className="relative">
              <select
                value={showPerPage}
                onChange={(e) => setShowPerPage(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value={9}>9 Ürün</option>
                <option value={12}>12 Ürün</option>
                <option value={products.length}>Tümü</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Toplam Ürün Sayısı */}
          <div className="text-sm text-gray-600">
            {displayProducts.length} ürün gösteriliyor
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayProducts.map((product, index) => {
          const quantity = getProductQuantity(product.id)
          const isAdded = addedProductId === product.id
          
          return (
            <motion.div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  %20 İNDİRİM
                </div>
              </div>

              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
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
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
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
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-600">
                      ₺{product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₺{Math.round(product.price * 1.25)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {quantity > 0 && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {quantity} adet
                      </span>
                    )}
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                        isAdded
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                      }`}
                    >
                      <ShoppingCart size={16} />
                      {isAdded ? 'Eklendi!' : 'Ekle'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* View All Products Button - Sadece ana sayfada göster */}
      {showViewAllButton && (
        <div className="text-center">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 font-semibold text-lg"
          >
            Tüm Ürünleri Göster
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
