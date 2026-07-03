import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import { PageSkeleton } from "../components/Skeleton";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const mensCategory = categories.find(
    (category) => category.slug === "mens-watches"
  );

  const womensCategory = categories.find(
    (category) => category.slug === "womens-watches"
  );

  const activeCategoryId =
    selectedCategory === "mens-watches"
      ? mensCategory?._id
      : selectedCategory === "womens-watches"
      ? womensCategory?._id
      : null;

  const filters = activeCategoryId ? { category: activeCategoryId } : {};

  const { data, isLoading } = useGetProductsQuery(filters);

  const products = data?.data?.products || [];

  const filterButtons = [
    { label: "All Watches", value: "all" },
    {
      label: "Men's Watches",
      value: "mens-watches",
      disabled: !mensCategory,
    },
    {
      label: "Women's Watches",
      value: "womens-watches",
      disabled: !womensCategory,
    },
  ];

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-4">
            CURATED SELECTION
          </p>

          <h1 className="text-5xl font-serif mb-6">
            Shop Luxury Watches
          </h1>

          <p className="text-[#0b0b0c]/60 max-w-2xl mx-auto leading-relaxed">
            Explore our handpicked collection of timeless luxury watches,
            carefully selected for elegance and precision.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {filterButtons.map((button) => (
            <button
              key={button.value}
              type="button"
              onClick={() => setSelectedCategory(button.value)}
              disabled={button.disabled}
              className={`
                px-6 py-2 text-sm tracking-wide border transition-all duration-300
                ${
                  selectedCategory === button.value
                    ? "bg-[#0b0b0c] text-white border-[#0b0b0c]"
                    : "bg-white text-[#0b0b0c] border-[#c8a45c]/30 hover:border-[#a6813f]"
                }
                disabled:opacity-40 disabled:cursor-not-allowed
              `}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <PageSkeleton />
        ) : products.length === 0 ? (
          <div className="bg-white border border-[#c8a45c]/20 p-12 text-center text-[#0b0b0c]/60">
            No watches found for this category.
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

export default Shop;