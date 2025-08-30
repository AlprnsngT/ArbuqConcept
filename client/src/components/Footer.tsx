export function Footer() {
  return (
    <footer className="mt-20 border-t border-sand">
      <div className="container-max py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} ArbuqConcept. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href="/products" className="hover:underline">Shop</a>
          <a href="/sign-in" className="hover:underline">Account</a>
          <a href="/checkout" className="hover:underline">Checkout</a>
        </div>
      </div>
    </footer>
  )
}

