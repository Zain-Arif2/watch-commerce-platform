import React from "react";
import { useGetBrandsQuery } from "../features/brands/brandsApiSlice";
import { Link } from "react-router-dom";

const Brands = () => {
  const { data: brandsData, isLoading } = useGetBrandsQuery();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-[#faf9f6]">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a6813f]"></div>
        </div>
      </div>
    );
  }

  const brands = brandsData?.data || [];

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-4">
            CURATED COLLECTION
          </p>

          <h1 className="text-5xl font-serif mb-6">
            Luxury Watch Brands
          </h1>

          <p className="text-[#0b0b0c]/60 max-w-2xl mx-auto leading-relaxed">
            Select a brand to explore its exclusive timepieces and continue
            your journey toward the perfect watch.
          </p>
        </div>

        {/* Empty State */}
        {brands.length === 0 ? (
          <div className="bg-white border border-[#c8a45c]/20 rounded-sm p-10 text-center text-[#0b0b0c]/60">
            No brands available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/brands/${brand.slug}`}
                className="group bg-white border border-[#c8a45c]/20 p-10 text-center transition-all duration-300 hover:border-[#a6813f] hover:shadow-lg hover:-translate-y-1"
              >
                <h2 className="text-2xl font-serif text-[#0b0b0c] mb-3 group-hover:text-[#a6813f] transition-colors">
                  {brand.name}
                </h2>

                <p className="text-[#0b0b0c]/60 leading-relaxed">
                  {brand.description || "View all watches from this brand"}
                </p>

                {/* subtle gold underline effect */}
                <div className="mt-6 mx-auto w-12 h-[1px] bg-[#c8a45c]/40 group-hover:bg-[#a6813f] transition-all" />
              </Link>
            ))}

          </div>
        )}
      </div>
    </main>
  );
};

export default Brands;