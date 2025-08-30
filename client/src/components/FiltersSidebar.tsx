"use client"
import { useState } from 'react'

type Filters = {
  quantity: 'any' | 'lt5' | 'gte5'
  color: 'any' | 'black' | 'white' | 'amber' | 'clear'
  scented: 'any' | 'scented' | 'unscented'
}

export function FiltersSidebar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const [open, setOpen] = useState(true)
  return (
    <aside className="card p-4 h-max sticky top-24 space-y-4">
      <button className="flex w-full items-center justify-between" onClick={()=>setOpen(o=>!o)}>
        <h3 className="font-medium">Filters</h3>
        <span className="text-sm">{open ? 'Hide' : 'Show'}</span>
      </button>
      <div className={`space-y-2 overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <label className="block text-sm">Quantity</label>
        <select className="w-full border rounded-md px-3 py-2" value={filters.quantity} onChange={e=>onChange({ ...filters, quantity: e.target.value as Filters['quantity'] })}>
          <option value="any">Any</option>
          <option value="lt5">Less than 5</option>
          <option value="gte5">5 or more</option>
        </select>
      </div>
      <div className={`space-y-2 overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <label className="block text-sm">Color</label>
        <select className="w-full border rounded-md px-3 py-2" value={filters.color} onChange={e=>onChange({ ...filters, color: e.target.value as Filters['color'] })}>
          <option value="any">Any</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="amber">Amber</option>
          <option value="clear">Clear</option>
        </select>
      </div>
      <div className={`space-y-2 overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <label className="block text-sm">Scent</label>
        <select className="w-full border rounded-md px-3 py-2" value={filters.scented} onChange={e=>onChange({ ...filters, scented: e.target.value as Filters['scented'] })}>
          <option value="any">Any</option>
          <option value="scented">Scented</option>
          <option value="unscented">Unscented</option>
        </select>
      </div>
    </aside>
  )
}

