"use client"
import { createContext, useContext, useMemo, useState } from 'react'

type Product = any

type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(it => it.product.id === product.id)
      if (existing) {
        return prev.map(it => it.product.id === product.id ? { ...it, quantity: Math.max(1, it.quantity + quantity) } : it)
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => setItems(prev => prev.filter(it => it.product.id !== productId))

  const updateQuantity = (productId: string, quantity: number) => setItems(prev => prev.map(it => it.product.id === productId ? { ...it, quantity: Math.max(1, quantity) } : it))

  const value = useMemo(() => ({ items, addToCart, removeFromCart, updateQuantity }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

