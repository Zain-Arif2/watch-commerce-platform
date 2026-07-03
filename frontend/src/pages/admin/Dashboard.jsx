import React from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'
import AdminLayout from './AdminLayout'
import StatCard from '../../components/admin/StatCard'
import ActivityFeed from '../../components/admin/ActivityFeed'
import RevenueTrendChart from '../../components/admin/RevenueTrendChart'
import TopProducts from '../../components/admin/TopProducts'
import { useGetProductsQuery } from '../../features/products/productsApiSlice'
import { useGetAdminOrdersQuery } from '../../features/orders/ordersApiSlice'
import { useGetCustomersQuery } from '../../features/users/usersApiSlice'

// ─── Section wrapper ──────────────────────────────────────────────────────────
const SectionCard = ({ title, children, action }) => (
  <div className="bg-white border border-[#c8a45c]/20">
    <div className="flex items-center justify-between px-6 py-5 border-b border-[#c8a45c]/20">
      <h3 className="text-xl font-serif text-[#0b0b0c]">{title}</h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
)

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({ limit: 200 })
  const { data: ordersData,   isLoading: loadingOrders   } = useGetAdminOrdersQuery()
  const { data: customersData } = useGetCustomersQuery()

  const products  = productsData?.data?.products || []
  const orders    = ordersData?.data             || []
  const customers = customersData?.data          || []

  const totalRevenue  = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  const pendingOrders = orders.filter((o) =>
    ['pending', 'processing'].includes(o.orderStatus)
  ).length

  const isLoadingAll = loadingProducts || loadingOrders

  return (
    <AdminLayout>
      <div className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3">
            ADMIN OVERVIEW
          </p>
          <h2 className="text-4xl font-serif mb-3">Dashboard</h2>
          <p className="text-[#0b0b0c]/60 max-w-2xl">
            High-level snapshot of your ChronoLux store — revenue, orders, and
            customer activity at a glance.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            label="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={DollarSign}
          />
          <StatCard
            label="Total Orders"
            value={orders.length}
            icon={ShoppingBag}
          />
          <StatCard
            label="Products"
            value={products.length}
            icon={Package}
          />
          <StatCard
            label="Customers"
            value={customers.length}
            icon={Users}
          />
        </div>

        {/* Pending orders alert — only shown when there are pending orders */}
        {pendingOrders > 0 && (
          <div className="flex items-center justify-between bg-[#a6813f]/5 border border-[#a6813f]/25 px-5 py-4 mb-8">
            <p className="text-sm text-[#0b0b0c]">
              <span className="font-semibold text-[#a6813f]">{pendingOrders}</span>{' '}
              {pendingOrders === 1 ? 'order requires' : 'orders require'} your attention
            </p>
            <Link
              to="/admin/orders"
              className="text-xs border border-[#a6813f] text-[#a6813f] hover:bg-[#a6813f] hover:text-white transition-all px-4 py-2 tracking-wider"
            >
              VIEW ORDERS
            </Link>
          </div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Revenue Chart — 2/3 width */}
          <div className="lg:col-span-2">
            <SectionCard
              title="Revenue (Last 7 Days)"
              action={
                <span className="text-xs text-[#0b0b0c]/40 uppercase tracking-widest">
                  Daily trend
                </span>
              }
            >
              {isLoadingAll ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-pulse text-[#c8a45c]/40 text-sm">Loading chart…</div>
                </div>
              ) : (
                <RevenueTrendChart orders={orders} />
              )}
            </SectionCard>
          </div>

          {/* Top Products — 1/3 width */}
          <div>
            <SectionCard
              title="Top Selling"
              action={
                <span className="text-xs text-[#0b0b0c]/40 uppercase tracking-widest">
                  By units
                </span>
              }
            >
              {isLoadingAll ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#c8a45c]/10 rounded flex-shrink-0" />
                      <div className="flex-1 h-3 bg-[#c8a45c]/10 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <TopProducts orders={orders} />
              )}
            </SectionCard>
          </div>
        </div>

        {/* Activity Feed */}
        <SectionCard
          title="Recent Activity"
          action={
            <Link
              to="/admin/orders"
              className="text-xs text-[#a6813f] hover:underline underline-offset-2 transition-colors"
            >
              View all orders →
            </Link>
          }
        >
          <ActivityFeed orders={orders} customers={customers} />
        </SectionCard>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard