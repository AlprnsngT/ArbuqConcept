"use client"
import { useMemo, useState } from 'react'
import { Header, Footer, ProductGrid, FiltersSidebar } from '../../components'
import { getAllProducts } from '../../data/products'

export default function ProductsPage() {
  const all = getAllProducts()
  const [filters, setFilters] = useState({
    quantity: 'any' as 'any' | 'lt5' | 'gte5',
    color: 'any' as 'any' | 'black' | 'white' | 'amber' | 'clear',
    scented: 'any' as 'any' | 'scented' | 'unscented',
  })

  const filtered = useMemo(() => {
    return all.filter(p => {
      if (filters.quantity === 'lt5' && p.stock >= 5) return false
      if (filters.quantity === 'gte5' && p.stock < 5) return false
      if (filters.color !== 'any' && p.color !== filters.color) return false
      if (filters.scented === 'scented' && !p.scented) return false
      if (filters.scented === 'unscented' && p.scented) return false
      return true
    })
  }, [all, filters])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          <FiltersSidebar filters={filters} onChange={setFilters} />
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Tüm Ürünler</h1>
            <ProductGrid products={filtered} showViewAllButton={false} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

