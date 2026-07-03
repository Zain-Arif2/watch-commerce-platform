import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

/**
 * RevenueTrendChart
 *
 * Shows a bar chart of daily revenue for the last 7 days, derived from orders.
 *
 * Props:
 *  - orders {Array} — from useGetAdminOrdersQuery
 */

const formatShortDate = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0b0b0c] text-white px-4 py-3 text-xs shadow-xl">
      <p className="text-[#c8a45c] font-semibold mb-1">{label}</p>
      <p>${payload[0].value.toFixed(2)}</p>
    </div>
  )
}

const RevenueTrendChart = ({ orders = [] }) => {
  const chartData = useMemo(() => {
    // Build last-7-days date buckets
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - (6 - i))
      return d
    })

    return days.map((day) => {
      const nextDay = new Date(day)
      nextDay.setDate(nextDay.getDate() + 1)

      const revenue = orders
        .filter((o) => {
          const created = new Date(o.createdAt)
          return created >= day && created < nextDay
        })
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0)

      return {
        date: formatShortDate(day),
        revenue: parseFloat(revenue.toFixed(2)),
      }
    })
  }, [orders])

  const hasData = chartData.some((d) => d.revenue > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-[#0b0b0c]/40 text-sm">
        No revenue data for the last 7 days.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        barSize={28}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#c8a45c"
          strokeOpacity={0.12}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#0b0b0c', opacity: 0.45 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#0b0b0c', opacity: 0.45 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#c8a45c', fillOpacity: 0.08 }} />
        <Bar
          dataKey="revenue"
          fill="#B0915B"
          radius={[2, 2, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RevenueTrendChart
