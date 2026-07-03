import React, { useMemo } from 'react'
import { Award, TrendingUp } from 'lucide-react'

/**
 * TopProducts
 *
 * Derives top 5 selling products by units sold from orders[].orderItems.
 *
 * Props:
 *  - orders {Array} — from useGetAdminOrdersQuery
 */

const TopProducts = ({ orders = [] }) => {
  const topProducts = useMemo(() => {
    const productMap = {}

    orders.forEach((order) => {
      ;(order.orderItems || []).forEach((item) => {
        const key = item.product || item._id || item.name
        if (!key) return
        if (!productMap[key]) {
          productMap[key] = {
            name: item.name || 'Unknown Product',
            image: item.image || null,
            units: 0,
            revenue: 0,
          }
        }
        const qty = item.quantity || item.qty || 1
        productMap[key].units += qty
        productMap[key].revenue += (item.price || 0) * qty
      })
    })

    return Object.values(productMap)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5)
  }, [orders])

  if (topProducts.length === 0) {
    return (
      <div className="py-10 text-center">
        <TrendingUp size={28} className="mx-auto mb-3 text-[#c8a45c]/30" strokeWidth={1} />
        <p className="text-[#0b0b0c]/50 text-sm">No sales data yet.</p>
      </div>
    )
  }

  const maxUnits = topProducts[0]?.units || 1

  return (
    <div className="space-y-4">
      {topProducts.map((product, idx) => (
        <div key={product.name + idx} className="flex items-center gap-4">
          {/* Rank */}
          <div
            className={`w-7 h-7 flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
              idx === 0
                ? 'bg-[#a6813f] text-white'
                : 'bg-[#faf9f6] border border-[#c8a45c]/20 text-[#0b0b0c]/50'
            }`}
          >
            {idx === 0 ? <Award size={13} /> : idx + 1}
          </div>

          {/* Thumbnail */}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-9 h-9 object-cover border border-[#c8a45c]/20 flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 bg-[#c8a45c]/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={14} className="text-[#c8a45c]/50" />
            </div>
          )}

          {/* Name + bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-[#0b0b0c] truncate pr-2">{product.name}</p>
              <span className="text-xs text-[#0b0b0c]/50 whitespace-nowrap">
                {product.units} sold
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-[#c8a45c]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B0915B] rounded-full transition-all duration-700"
                style={{ width: `${(product.units / maxUnits) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#0b0b0c]/40 mt-1">
              ${product.revenue.toFixed(2)} revenue
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TopProducts
