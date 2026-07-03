import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetBrandBySlugQuery } from "../features/brands/brandsApiSlice";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeleton";

const BrandProducts = () => {
  const { slug } = useParams();

  const { data: brandData, isLoading: brandLoading } =
    useGetBrandBySlugQuery(slug);

  const brand = brandData?.data;

  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery(
      { brand: brand?._id, limit: 100 },
      { skip: !brand?._id }
    );

  if (brandLoading || productsLoading) {
    return (
      <main className="bg-[#faf9f6] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-serif text-[#0b0b0c] mb-4">
            Brand Not Found
          </h1>

          <p className="text-[#0b0b0c]/60 mb-8">
            The brand you are looking for doesn’t exist or has been removed.
          </p>

          <Link
            to="/brands"
            className="inline-block text-[#a6813f] font-semibold hover:underline"
          >
            ← Back to Brands
          </Link>
        </div>
      </main>
    );
  }

  const products = productsData?.data?.products || [];

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header */}
        <div className="mb-16">

          <Link
            to="/brands"
            className="text-[#a6813f] font-semibold hover:underline"
          >
            ← Back to Brands
          </Link>

          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mt-6 mb-3">
            BRAND COLLECTION
          </p>

          <h1 className="text-5xl font-serif mb-5">
            {brand.name}
          </h1>

          <p className="text-[#0b0b0c]/60 max-w-2xl leading-relaxed">
            {brand.description ||
              `Explore ${brand.name} watches and add them directly to your cart.`}
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white border border-[#c8a45c]/20 p-10 text-center text-[#0b0b0c]/60">
            No watches found for this brand.
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

export default BrandProducts;