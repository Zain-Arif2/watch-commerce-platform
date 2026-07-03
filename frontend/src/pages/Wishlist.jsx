import React from "react";
import { useGetWishlistQuery } from "../features/wishlist/wishlistApiSlice";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";

const Wishlist = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const guestProducts = useSelector((state) => state.wishlist.products);
  const { data, isLoading } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isAuthenticated && isLoading) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a6813f]" />
      </main>
    );
  }

  const wishlist = data?.data || {};
  const products = isAuthenticated ? wishlist.products || [] : guestProducts || [];

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-4">
            SAVED COLLECTION
          </p>

          <h1 className="text-5xl font-serif mb-6">
            Your Wishlist
          </h1>

          <p className="text-[#0b0b0c]/60 max-w-2xl mx-auto">
            All your selected luxury timepieces saved in one place.
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white border border-[#c8a45c]/20 p-12 text-center">
            <p className="text-[#0b0b0c]/60 mb-6">
              Your wishlist is currently empty.
            </p>

            <p className="text-sm text-[#0b0b0c]/40">
              Save your favorite watches to build your collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;