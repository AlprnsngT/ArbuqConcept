"use client"
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const companyImages = [
  { id: 1, title: 'Üretim Tesisi', description: 'Modern üretim hatlarımız' },
  { id: 2, title: 'Kalite Kontrol', description: 'Detaylı kalite kontrol süreçleri' },
  { id: 3, title: 'Paketleme', description: 'Özenli paketleme ve sevkiyat' }
]

export function CompanySlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 4 saniyede bir otomatik geçiş
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % companyImages.length)
    }, 4000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Mock Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Overlay Text */}
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">
              {companyImages[currentIndex].title}
            </h3>
            <p className="text-lg md:text-xl opacity-90">
              {companyImages[currentIndex].description}
            </p>
          </div>

          {/* Company Logo Overlay */}
          <div className="absolute top-8 right-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 right-8 flex gap-2">
        {companyImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
