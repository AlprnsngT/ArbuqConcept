"use client"
import Link from 'next/link'
import { ShoppingBag, User, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCart } from './CartContext'

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const { items } = useCart()
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <header className="sticky top-0 z-40 bg-bone/70 backdrop-blur border-b border-sand">
      <div className="container-max h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-[0.2em]">
          ARBUQ<span className="text-gold">CONCEPT</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/sign-in" className="hover:underline">Sign In</Link>
          <Link href="/sign-up" className="hover:underline">Sign Up</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative inline-flex">
            <ShoppingBag />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-ink text-bone rounded-full px-1.5 py-0.5">{count}</span>
            )}
          </Link>
          <Link href="/sign-in"><User /></Link>
          <button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>
    </header>
  )
}

