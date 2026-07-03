import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useVerifyCheckoutSessionQuery } from '../features/payments/paymentsApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../features/cart/cartSlice'
import { useClearCartMutation } from '../features/cart/cartApiSlice'

const OrderSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [clearCart] = useClearCartMutation()

  const { data, isLoading, isError } = useVerifyCheckoutSessionQuery(sessionId, {
    skip: !sessionId,
  })

  useEffect(() => {
    if (!data?.success) return

    localStorage.setItem('guest_cart_items', JSON.stringify([]))
    dispatch(setCart({ items: [] }))

    if (isAuthenticated) {
      clearCart()
    }
  }, [data, dispatch, isAuthenticated, clearCart])

  if (!sessionId) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">Invalid order session</h1>
          <Link to="/cart" className="text-[#a6813f] hover:underline">
            Back to cart
          </Link>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a6813f] mx-auto mb-4" />
          <p className="text-[#0b0b0c]/60 tracking-wide">Confirming your order...</p>
        </div>
      </main>
    )
  }

  if (isError || !data?.success) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-[#c8a45c]/20 p-10 text-center max-w-md">
          <h1 className="text-3xl font-serif mb-4">Order verification failed</h1>
          <p className="text-[#0b0b0c]/60 mb-6">
            We could not verify your payment. Please contact support if you were charged.
          </p>
          <Link
            to="/cart"
            className="inline-block bg-[#0b0b0c] hover:bg-[#a6813f] text-white px-6 py-3 tracking-wide transition-colors"
          >
            RETURN TO CART
          </Link>
        </div>
      </main>
    )
  }

  const order = data.data
  const shortOrderId = order.orderId?.toString().slice(-8).toUpperCase()

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <div className="bg-white border border-[#c8a45c]/20 overflow-hidden">
          <div className="bg-[#0b0b0c] text-white px-8 py-10 text-center">
            <CheckCircle className="mx-auto mb-4 text-[#c8a45c]" size={48} />
            <p className="text-[11px] tracking-[0.25em] font-semibold text-[#c8a45c] uppercase mb-3">
              ORDER CONFIRMED
            </p>
            <h1 className="text-4xl font-serif mb-2">Thank You For Your Purchase</h1>
            <p className="text-white/60">
              Order #{shortOrderId}
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <p className="text-[#0b0b0c]/70 mb-8 leading-relaxed text-center">
              Your payment was successful.
              {order.confirmationEmailSent
                ? ` A confirmation email has been sent to ${order.email}.`
                : order.email
                  ? ` We will send a confirmation to ${order.email} shortly.`
                  : ' You will receive a confirmation email shortly.'}
            </p>

            <div className="border border-[#c8a45c]/20 mb-8">
              <div className="px-6 py-4 border-b border-[#c8a45c]/20 bg-[#faf9f6]">
                <h2 className="font-serif text-xl">Order Items</h2>
              </div>
              <div className="divide-y divide-[#c8a45c]/15">
                {(order.orderItems || []).map((item) => (
                  <div
                    key={`${item.product}-${item.name}`}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover border border-[#c8a45c]/15"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[#0b0b0c]/50">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="border border-[#c8a45c]/20 p-6">
                <h3 className="text-sm tracking-widest text-[#a6813f] uppercase mb-3">
                  Shipping To
                </h3>
                <p className="text-[#0b0b0c]/70 leading-relaxed">
                  {order.shippingAddress?.address}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                  <br />
                  {order.shippingAddress?.country}
                </p>
              </div>

              <div className="border border-[#c8a45c]/20 p-6">
                <h3 className="text-sm tracking-widest text-[#a6813f] uppercase mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-[#0b0b0c]/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${Number(order.itemsPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${Number(order.shippingPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#0b0b0c] pt-2 border-t border-[#c8a45c]/20">
                    <span>Total Paid</span>
                    <span>${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="text-center bg-[#0b0b0c] hover:bg-[#a6813f] text-white px-8 py-3 tracking-wide transition-colors"
              >
                CONTINUE SHOPPING
              </Link>
              {isAuthenticated && (
                <Link
                  to="/account/orders"
                  className="text-center border border-[#c8a45c]/30 hover:border-[#a6813f] px-8 py-3 tracking-wide transition-colors"
                >
                  VIEW MY ORDERS
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default OrderSuccess
