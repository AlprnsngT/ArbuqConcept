"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingCart, LogOut } from 'lucide-react'
import { useCart } from '../CartContext'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('Ahmet Yılmaz')
  const [searchQuery, setSearchQuery] = useState('')
  const { items } = useCart()

  // Toplam ürün sayısını hesapla (quantity'leri topla)
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ARBUQ<span className="text-amber-500">CONCEPT</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* User Menu & Cart */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="relative">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                    <User size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{userName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    title="Çıkış Yap"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">Giriş Yap</span>
                </button>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-amber-500 transition-colors relative">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
