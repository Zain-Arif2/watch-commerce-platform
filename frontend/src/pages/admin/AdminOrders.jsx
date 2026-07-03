import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Clock,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import StatCard from '../../components/admin/StatCard'
import OrderDetailsModal from '../../components/admin/OrderDetailsModal'
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from '../../features/orders/ordersApiSlice'
import toast from 'react-hot-toast'

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10

/** Statuses that require admin attention — shown in "Awaiting Fulfillment" stat */
const AWAITING_STATUSES = ['pending', 'processing']

const ALL_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES = {
  pending:    'border-yellow-300 text-yellow-700 bg-yellow-50',
  processing: 'border-blue-300 text-blue-700 bg-blue-50',
  shipped:    'border-indigo-300 text-indigo-700 bg-indigo-50',
  delivered:  'border-green-300 text-green-700 bg-green-50',
  cancelled:  'border-red-300 text-red-600 bg-red-50',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (val) => `$${(val || 0).toFixed(2)}`

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—'

const shortId = (id = '') => `#${id.slice(-8).toUpperCase()}`

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Status badge */
const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-3 py-1 text-xs border capitalize whitespace-nowrap ${
      STATUS_STYLES[status] || 'border-[#c8a45c]/30 text-[#a6813f] bg-[#c8a45c]/5'
    }`}
  >
    {status || 'unknown'}
  </span>
)

/** Status update dropdown — per-row */
const StatusDropdown = ({ orderId, currentStatus, onUpdate, isUpdating }) => {
  const handleChange = async (e) => {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return
    try {
      await onUpdate({ id: orderId, status: newStatus })
      toast.success(`Status updated to "${newStatus}"`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isUpdating}
      className="text-xs border border-[#c8a45c]/30 bg-white text-[#0b0b0c] px-2 py-1.5 focus:outline-none focus:border-[#a6813f] transition-colors disabled:opacity-50 capitalize cursor-pointer"
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s} className="capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  )
}

/** Pagination controls */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[#c8a45c]/20">
      <p className="text-sm text-[#0b0b0c]/50">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center border border-[#c8a45c]/20 hover:border-[#a6813f] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
          )
          .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1)
              acc.push('ellipsis-' + p)
            acc.push(p)
            return acc
          }, [])
          .map((p) =>
            typeof p === 'string' ? (
              <span key={p} className="text-[#0b0b0c]/30 px-1 text-sm">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 text-sm border transition-colors ${
                  p === page
                    ? 'bg-[#0b0b0c] text-white border-[#0b0b0c]'
                    : 'border-[#c8a45c]/20 hover:border-[#a6813f] text-[#0b0b0c]'
                }`}
              >
                {p}
              </button>
            )
          )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center border border-[#c8a45c]/20 hover:border-[#a6813f] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}


// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminOrders = () => {
  const { data, isLoading, isError } = useGetAdminOrdersQuery()
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()

  const orders = data?.data || []

  // Local UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ── Derived stats ──
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  const awaitingCount = orders.filter((o) =>
    AWAITING_STATUSES.includes(o.orderStatus)
  ).length

  // ── Filtering ──
  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) => {
      const name = (o.user?.name || o.guestName || 'guest').toLowerCase()
      const id = (o._id || '').toLowerCase()
      return name.includes(q) || id.includes(q)
    })
  }, [orders, searchQuery])

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#a6813f] mb-3">
            ORDER MANAGEMENT
          </p>
          <h2 className="text-4xl font-serif mb-3">Orders</h2>
          <p className="text-[#0b0b0c]/60 max-w-2xl">
            Monitor customer orders, update fulfilment status, and review order
            details from a single view.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Total Orders"
            value={orders.length}
            icon={ShoppingBag}
          />
          <StatCard
            label="Awaiting Fulfilment"
            value={awaitingCount}
            icon={Clock}
          />
          <StatCard
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
          />
        </div>

        {/* Orders Table Card */}
        <div className="bg-white border border-[#c8a45c]/20 overflow-hidden shadow-sm">

          {/* Table Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-[#c8a45c]/20">
            <h3 className="text-2xl font-serif">All Orders</h3>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0b0b0c]/30"
              />
              <input
                type="text"
                placeholder="Search by name or order ID…"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#c8a45c]/20 bg-[#faf9f6] focus:outline-none focus:border-[#a6813f] transition-colors placeholder-[#0b0b0c]/30"
              />
            </div>
          </div>

          {/* Body */}
          {isLoading ? (
            /* Loading skeleton */
            <div className="divide-y divide-[#c8a45c]/10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5 animate-pulse">
                  <div className="h-4 bg-[#c8a45c]/10 rounded w-20" />
                  <div className="h-4 bg-[#c8a45c]/10 rounded flex-1" />
                  <div className="h-4 bg-[#c8a45c]/10 rounded w-24" />
                  <div className="h-4 bg-[#c8a45c]/10 rounded w-16" />
                </div>
              ))}
            </div>

          ) : isError ? (
            /* Error state */
            <div className="py-20 text-center">
              <AlertCircle size={32} className="mx-auto mb-4 text-red-400" />
              <p className="text-[#0b0b0c]/60">Failed to load orders. Please try refreshing.</p>
            </div>

          ) : orders.length === 0 ? (
            /* Empty state — zero orders in system */
            <div className="py-20 text-center">
              <ShoppingBag size={40} className="mx-auto mb-4 text-[#c8a45c]/30" strokeWidth={1} />
              <p className="text-[#0b0b0c]/60 mb-6 text-lg">No orders yet.</p>
              <p className="text-[#0b0b0c]/40 text-sm mb-8">
                Orders will appear here once customers start purchasing.
              </p>
              <Link
                to="/admin/products"
                className="inline-block bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white px-6 py-3 tracking-wider text-sm"
              >
                MANAGE PRODUCTS
              </Link>
            </div>

          ) : filteredOrders.length === 0 ? (
            /* Empty state — search returned nothing */
            <div className="py-16 text-center">
              <Search size={32} className="mx-auto mb-4 text-[#c8a45c]/30" strokeWidth={1} />
              <p className="text-[#0b0b0c]/60">
                No orders match <span className="font-semibold">"{searchQuery}"</span>.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[#a6813f] text-sm underline underline-offset-2"
              >
                Clear search
              </button>
            </div>

          ) : (
            /* Orders table */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#faf9f6] border-b border-[#c8a45c]/20">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold whitespace-nowrap">
                      Order ID
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                      Items
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                      Total
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                      Update
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#c8a45c]/10">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-[#faf9f6] transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 font-mono text-xs text-[#a6813f] whitespace-nowrap">
                        {shortId(order._id)}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#0b0b0c] leading-tight">
                          {order.user?.name || order.guestName || 'Guest'}
                        </p>
                        <p className="text-xs text-[#0b0b0c]/50 mt-0.5">
                          {order.user?.email ||
                            order.guestEmail ||
                            order.guestPhone ||
                            <span className="text-orange-500 flex items-center gap-1">
                              <AlertCircle size={10} /> No contact
                            </span>}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-[#0b0b0c]/60 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Items count */}
                      <td className="px-6 py-4 text-[#0b0b0c]/70">
                        {order.orderItems?.length || 0}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-semibold text-[#0b0b0c] whitespace-nowrap">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      {/* Status update dropdown */}
                      <td className="px-6 py-4">
                        <StatusDropdown
                          orderId={order._id}
                          currentStatus={order.orderStatus}
                          onUpdate={updateOrderStatus}
                          isUpdating={isUpdating}
                        />
                      </td>

                      {/* View Details */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 text-xs border border-[#c8a45c]/30 hover:border-[#a6813f] hover:text-[#a6813f] transition-all px-3 py-1.5"
                        >
                          <Eye size={12} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredOrders.length > PAGE_SIZE && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Result count footer */}
          {!isLoading && filteredOrders.length > 0 && (
            <div className="px-6 py-3 border-t border-[#c8a45c]/10 text-xs text-[#0b0b0c]/40">
              Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filteredOrders.length)}–
              {Math.min(safePage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} orders
              {searchQuery && ` (filtered from ${orders.length} total)`}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </main>
    </AdminLayout>
  )
}

export default AdminOrders