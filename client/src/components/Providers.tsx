"use client"
import { CartProvider } from './CartContext'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

