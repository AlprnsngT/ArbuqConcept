export function Footer() {
  return (
    <footer className="mt-20 border-t border-sand">
      <div className="container-max py-10 text-sm text-neutral-600 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-display text-lg tracking-wide text-ink">ARBUQ<span className="text-gold">CONCEPT</span></div>
          <p className="mt-2">Premium handmade candles for modern interiors.</p>
          <p className="mt-4">© {new Date().getFullYear()} ArbuqConcept. All rights reserved.</p>
        </div>
        <div>
          <div className="font-medium text-ink mb-2">Company</div>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-ink mb-2">Policies</div>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

