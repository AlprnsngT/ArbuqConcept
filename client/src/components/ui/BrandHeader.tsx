import Image from 'next/image'

export function BrandHeader() {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-3">
      {/* Logo placeholder - gerçek logo ile değiştirilebilir */}
      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white text-xl font-bold">A</span>
      </div>
      
      {/* Marka adı */}
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wider text-gray-900">
          ARBUQ<span className="text-amber-500">CONCEPT</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 mt-1 font-light">
          Luxury Handmade Candles
        </p>
      </div>
    </div>
  )
}
