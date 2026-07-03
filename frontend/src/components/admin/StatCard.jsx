import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * Reusable stat card used across Dashboard, Orders, and Customers pages.
 *
 * Props:
 *  - label     {string}          — metric label
 *  - value     {string|number}   — primary displayed value
 *  - icon      {React.Component} — lucide-react icon component
 *  - trend     {string}          — optional trend string e.g. "+12%" or "−3%"
 *  - trendUp   {boolean}         — true = green, false = red
 */
const StatCard = ({ label, value, icon: Icon, trend, trendUp }) => {
  return (
    <div className="bg-white border border-[#c8a45c]/20 p-6 hover:border-[#a6813f]/50 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className="w-10 h-10 flex items-center justify-center border border-[#c8a45c]/20 group-hover:border-[#a6813f]/50 transition-colors">
            <Icon size={18} className="text-[#a6813f]" strokeWidth={1.5} />
          </div>
        )}
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 ${
              trendUp
                ? 'text-green-700 bg-green-50'
                : 'text-red-600 bg-red-50'
            }`}
          >
            {trendUp ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}
            {trend}
          </span>
        )}
      </div>

      <p className="text-3xl font-serif text-[#0b0b0c] leading-none mb-2">
        {value}
      </p>
      <p className="text-sm text-[#0b0b0c]/60 uppercase tracking-widest">
        {label}
      </p>
    </div>
  )
}

export default StatCard
