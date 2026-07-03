import React from 'react'
import { Clock, ShoppingBag, UserPlus, Package } from 'lucide-react'

/**
 * ActivityFeed
 *
 * Derives real activity events from orders and customers arrays.
 * Shows the 10 most recent events sorted by createdAt, with relative timestamps.
 *
 * Props:
 *  - orders    {Array} — from useGetAdminOrdersQuery
 *  - customers {Array} — from useGetCustomersQuery
 */

const relativeTime = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const shortId = (id = '') => id.slice(-6).toUpperCase()

const FEED_ICONS = {
  order:    { Icon: ShoppingBag, color: 'text-[#a6813f]', bg: 'bg-[#c8a45c]/10' },
  customer: { Icon: UserPlus,    color: 'text-blue-500',   bg: 'bg-blue-50'       },
  shipped:  { Icon: Package,     color: 'text-indigo-500', bg: 'bg-indigo-50'     },
  delivered:{ Icon: Package,     color: 'text-green-600',  bg: 'bg-green-50'      },
}

const getOrderEvent = (order) => {
  const status = order.orderStatus
  if (status === 'shipped')    return { type: 'shipped',   label: `Order #${shortId(order._id)} shipped` }
  if (status === 'delivered')  return { type: 'delivered', label: `Order #${shortId(order._id)} delivered` }
  return { type: 'order', label: `Order #${shortId(order._id)} placed` }
}

const ActivityFeed = ({ orders = [], customers = [] }) => {
  // Build unified event list
  const events = [
    ...orders.map((o) => ({
      ...getOrderEvent(o),
      date: o.updatedAt || o.createdAt,
      id: 'ord-' + o._id,
    })),
    ...customers.map((c) => ({
      type: 'customer',
      label: `${c.name || 'New customer'} registered`,
      date: c.createdAt,
      id: 'cus-' + c._id,
    })),
  ]
    .filter((e) => e.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 12)

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <Clock size={32} className="mx-auto mb-3 text-[#c8a45c]/30" strokeWidth={1} />
        <p className="text-[#0b0b0c]/50 text-sm">No recent activity yet.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-[#c8a45c]/10">
      {events.map((event) => {
        const { Icon, color, bg } = FEED_ICONS[event.type] || FEED_ICONS.order
        return (
          <li
            key={event.id}
            className="flex items-center gap-4 py-3.5 px-1 hover:bg-[#faf9f6] -mx-1 px-1 rounded transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={14} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0b0b0c] truncate">{event.label}</p>
            </div>
            <span className="text-xs text-[#0b0b0c]/40 whitespace-nowrap flex-shrink-0">
              {relativeTime(event.date)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default ActivityFeed
