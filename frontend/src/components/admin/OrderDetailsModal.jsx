import React, { useEffect } from 'react'
import { X, Package, MapPin, CreditCard, Clock } from 'lucide-react'

/**
 * Order Details Modal
 *
 * Props:
 *  - order   {object|null}  — the order object, or null to hide
 *  - onClose {function}     — called when user dismisses the modal
 */
const OrderDetailsModal = ({ order, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!order) return null

  const formatCurrency = (val) => `$${(val || 0).toFixed(2)}`
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—'

  const shortId = order._id?.slice(-8).toUpperCase()

  const STATUS_COLORS = {
    pending:    'border-yellow-300 text-yellow-700 bg-yellow-50',
    processing: 'border-blue-300 text-blue-700 bg-blue-50',
    shipped:    'border-indigo-300 text-indigo-700 bg-indigo-50',
    delivered:  'border-green-300 text-green-700 bg-green-50',
    cancelled:  'border-red-300 text-red-600 bg-red-50',
  }

  const addr = order.shippingAddress || {}

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0c]/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="bg-[#faf9f6] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#c8a45c]/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#c8a45c]/20 bg-white sticky top-0 z-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#a6813f] font-semibold mb-1">
              Order Details
            </p>
            <h2 className="text-2xl font-serif text-[#0b0b0c]">#{shortId}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border border-[#c8a45c]/20 hover:border-[#a6813f] hover:text-[#a6813f] transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Customer + Status */}
          <div className="flex flex-wrap gap-4 items-start">
            <div className="flex-1 min-w-48">
              <p className="text-xs uppercase tracking-widest text-[#0b0b0c]/50 mb-1">Customer</p>
              <p className="font-semibold text-[#0b0b0c]">
                {order.user?.name || order.guestName || 'Guest'}
              </p>
              <p className="text-sm text-[#0b0b0c]/60">
                {order.user?.email || order.guestEmail || order.guestPhone || 'No contact'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0b0b0c]/50 mb-1">Status</p>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border capitalize ${
                  STATUS_COLORS[order.orderStatus] ||
                  'border-[#c8a45c]/30 text-[#a6813f] bg-[#c8a45c]/5'
                }`}
              >
                <Clock size={12} />
                {order.orderStatus}
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0b0b0c]/50 mb-1">Placed</p>
              <p className="text-sm text-[#0b0b0c]/70">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package size={15} className="text-[#a6813f]" />
              <p className="text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                Items Ordered
              </p>
            </div>

            {order.orderItems?.length > 0 ? (
              <div className="bg-white border border-[#c8a45c]/20 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#faf9f6] border-b border-[#c8a45c]/10">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#0b0b0c]/50">
                        Product
                      </th>
                      <th className="text-center px-4 py-3 text-xs uppercase tracking-widest text-[#0b0b0c]/50">
                        Qty
                      </th>
                      <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-[#0b0b0c]/50">
                        Price
                      </th>
                      <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-[#0b0b0c]/50">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, idx) => (
                      <tr
                        key={item._id || idx}
                        className="border-b border-[#c8a45c]/10 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover border border-[#c8a45c]/20 flex-shrink-0"
                              />
                            )}
                            <span className="font-medium text-[#0b0b0c]">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-[#0b0b0c]/70">
                          {item.quantity || item.qty || 1}
                        </td>
                        <td className="px-4 py-4 text-right text-[#0b0b0c]/70">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-[#0b0b0c]">
                          {formatCurrency(
                            (item.price || 0) * (item.quantity || item.qty || 1)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="px-4 py-4 border-t border-[#c8a45c]/20 bg-[#faf9f6] flex justify-end">
                  <div className="space-y-1 text-sm min-w-44">
                    {order.taxPrice > 0 && (
                      <div className="flex justify-between text-[#0b0b0c]/60">
                        <span>Tax</span>
                        <span>{formatCurrency(order.taxPrice)}</span>
                      </div>
                    )}
                    {order.shippingPrice >= 0 && (
                      <div className="flex justify-between text-[#0b0b0c]/60">
                        <span>Shipping</span>
                        <span>
                          {order.shippingPrice === 0
                            ? 'Free'
                            : formatCurrency(order.shippingPrice)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-[#0b0b0c] border-t border-[#c8a45c]/20 pt-1 mt-1">
                      <span>Total</span>
                      <span>{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[#0b0b0c]/50 text-sm">No item data available.</p>
            )}
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={15} className="text-[#a6813f]" />
              <p className="text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                Shipping Address
              </p>
            </div>

            {addr.address || addr.street ? (
              <div className="bg-white border border-[#c8a45c]/20 p-5 text-sm text-[#0b0b0c]/80 leading-7">
                <p>{addr.address || addr.street}</p>
                {addr.city && (
                  <p>
                    {addr.city}
                    {addr.postalCode ? `, ${addr.postalCode}` : ''}
                  </p>
                )}
                {addr.country && <p>{addr.country}</p>}
              </div>
            ) : (
              <p className="text-[#0b0b0c]/50 text-sm">No shipping address recorded.</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={15} className="text-[#a6813f]" />
              <p className="text-xs uppercase tracking-widest text-[#0b0b0c]/50 font-semibold">
                Payment
              </p>
            </div>
            <div className="bg-white border border-[#c8a45c]/20 p-5 flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-[#0b0b0c]/50 mb-0.5">Method</p>
                <p className="font-semibold capitalize">
                  {order.paymentMethod || '—'}
                </p>
              </div>
              <div>
                <p className="text-[#0b0b0c]/50 mb-0.5">Payment Status</p>
                <span
                  className={`inline-block px-2 py-0.5 text-xs border capitalize ${
                    order.isPaid
                      ? 'border-green-300 text-green-700'
                      : 'border-yellow-300 text-yellow-700'
                  }`}
                >
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-[#0b0b0c]/50 mb-0.5">Paid At</p>
                  <p className="font-medium">{formatDate(order.paidAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
