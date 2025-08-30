"use client"
import { useCart } from '../../components/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart()
  const total = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="card p-6 text-center">
          <p>Your cart is empty.</p>
          <Link className="btn btn-primary mt-4 inline-block" href="/products">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="card p-4 flex items-center gap-4">
                <div className="relative w-20 h-20 overflow-hidden rounded-md">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-neutral-600">${product.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn" onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button className="btn" onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                </div>
                <button className="btn btn-outline" onClick={() => removeFromCart(product.id)}>Remove</button>
              </div>
            ))}
            <Link href="/products" className="btn btn-outline w-max">Continue Shopping</Link>
          </div>
          <div className="card p-6 h-max">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full mt-4 text-center">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
}

