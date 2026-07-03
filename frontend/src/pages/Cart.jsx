import React, { useEffect, useState } from "react";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../features/cart/cartApiSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../features/cart/cartSlice";
import { useCreateCheckoutSessionMutation } from "../features/payments/paymentsApiSlice";
import { useSearchParams } from "react-router-dom";
import { optimizeImageUrl } from "../utils/imageUrl";

const Cart = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const guestItems = useSelector((state) => state.cart.items);
  const { data, isLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [removeFromCart, { isLoading: removingItem }] =
    useRemoveFromCartMutation();
  const [clearCart, { isLoading: clearingCart }] = useClearCartMutation();
  const [createCheckoutSession, { isLoading: creatingCheckout }] =
    useCreateCheckoutSessionMutation();

  // Guest contact info — required before checkout
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [contactError, setContactError] = useState(false)

  useEffect(() => {
    if (searchParams.get("payment") === "cancelled") {
      toast.error("Payment was cancelled");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (isAuthenticated && isLoading) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a6813f]"></div>
      </main>
    );
  }

  const cart = data?.data || {};
  const items = isAuthenticated ? cart.items || [] : guestItems || [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleRemove = async (productId) => {
    if (!isAuthenticated) {
      const updatedItems = items.filter((item) => item.product?._id !== productId);
      localStorage.setItem("guest_cart_items", JSON.stringify(updatedItems));
      dispatch(setCart({ items: updatedItems }));
      toast.success("Item removed from cart");
      return;
    }

    try {
      await removeFromCart(productId).unwrap();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated) {
      localStorage.setItem("guest_cart_items", JSON.stringify([]));
      dispatch(setCart({ items: [] }));
      toast.success("Cart cleared");
      return;
    }

    try {
      await clearCart().unwrap();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Guest checkout — require at least email or phone
    if (!isAuthenticated) {
      const hasContact = guestEmail.trim() || guestPhone.trim()
      if (!hasContact) {
        setContactError(true)
        toast.error('Please provide an email or phone number')
        return
      }
      setContactError(false)
    }

    try {
      const response = await createCheckoutSession({ items }).unwrap();
      const checkoutUrl = response?.data?.url;

      if (!checkoutUrl) {
        toast.error("Checkout session URL not found");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      const message = error?.data?.message || "Failed to start checkout";
      toast.error(message);
    }
  };

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-14">

          <div>
            <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3">
              YOUR SELECTION
            </p>

            <h1 className="text-5xl font-serif">
              Shopping Cart
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearingCart}
              className="px-6 py-2 border border-[#c8a45c]/30 text-[#a6813f] hover:border-[#a6813f] transition-all disabled:opacity-40"
            >
              {clearingCart ? "Clearing..." : "Clear Cart"}
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white border border-[#c8a45c]/20 p-12 text-center">
            <p className="text-[#0b0b0c]/60 mb-6">
              Your cart is currently empty.
            </p>

            <Link
              to="/shop"
              className="inline-block bg-[#0b0b0c] hover:bg-[#a6813f] transition-all text-white px-6 py-3 tracking-wide"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">

            {/* ITEMS */}
            <div className="space-y-6">

              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white border border-[#c8a45c]/20 p-6 hover:shadow-md transition-all"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-[#faf9f6] border border-[#c8a45c]/10 overflow-hidden">
                    {item.product?.images?.[0] && (
                      <img
                        src={optimizeImageUrl(item.product.images[0].url, { width: 192 })}
                        alt={item.product.name}
                        loading="lazy"
                        decoding="async"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg mb-1">
                      {item.product?.name}
                    </h3>

                    <p className="text-[#0b0b0c]/60">
                      ${item.product?.price}
                    </p>

                    <p className="text-sm text-[#0b0b0c]/40 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* Price + Remove */}
                  <div className="sm:text-right flex sm:block items-center justify-between gap-4">
                    <p className="font-semibold text-[#0b0b0c]">
                      $
                      {(
                        (item.product?.price || 0) * item.quantity
                      ).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleRemove(item.product?._id)}
                      disabled={removingItem}
                      className="mt-2 text-sm text-[#a6813f] hover:underline disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white border border-[#c8a45c]/20 p-8 h-fit">

              <h2 className="text-2xl font-serif mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 text-[#0b0b0c]/70">

                <div className="flex justify-between">
                  <span>Items</span>
                  <span>
                    {items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-[#c8a45c]/20 mt-6 pt-6 flex justify-between font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Guest contact info — shown only for unauthenticated users */}
              {!isAuthenticated && (
                <div className={`mt-6 border p-5 ${
                  contactError
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-[#c8a45c]/20 bg-[#faf9f6]'
                }`}>
                  <p className="text-xs uppercase tracking-widest text-[#0b0b0c]/60 mb-1 font-semibold">
                    Guest Contact Info
                  </p>
                  <p className="text-xs text-[#0b0b0c]/50 mb-4">
                    We need at least one way to reach you about your order.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value)
                        if (e.target.value.trim()) setContactError(false)
                      }}
                      className={`w-full px-4 py-2.5 text-sm border bg-white focus:outline-none transition-colors ${
                        contactError && !guestEmail.trim()
                          ? 'border-orange-300 focus:border-orange-400'
                          : 'border-[#c8a45c]/20 focus:border-[#a6813f]'
                      }`}
                    />
                    <div className="flex items-center gap-2 text-xs text-[#0b0b0c]/40">
                      <div className="flex-1 h-px bg-[#c8a45c]/20" />
                      <span>or</span>
                      <div className="flex-1 h-px bg-[#c8a45c]/20" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={guestPhone}
                      onChange={(e) => {
                        setGuestPhone(e.target.value)
                        if (e.target.value.trim()) setContactError(false)
                      }}
                      className={`w-full px-4 py-2.5 text-sm border bg-white focus:outline-none transition-colors ${
                        contactError && !guestPhone.trim()
                          ? 'border-orange-300 focus:border-orange-400'
                          : 'border-[#c8a45c]/20 focus:border-[#a6813f]'
                      }`}
                    />
                  </div>
                  {contactError && (
                    <p className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                      ⚠ Please enter an email or phone number to continue
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={creatingCheckout}
                className="w-full mt-8 bg-[#0b0b0c] hover:bg-[#a6813f] transition-all text-white py-3 tracking-wide disabled:opacity-50"
              >
                {creatingCheckout ? "REDIRECTING..." : "PROCEED TO CHECKOUT"}
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;