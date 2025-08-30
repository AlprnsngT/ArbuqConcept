import { Star } from 'lucide-react'

export function RatingStars({ value = 0 }: { value?: number }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={i < full ? '' : 'opacity-30'} size={18} fill="currentColor" />
      ))}
    </div>
  )
}

