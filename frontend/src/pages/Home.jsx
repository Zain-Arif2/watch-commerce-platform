import React, { memo, useMemo, Suspense, lazy } from 'react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import { ProductCardSkeleton } from '../components/Skeleton'
import { useGetHomeFeedQuery } from '../features/products/productsApiSlice'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../config/site'

const Testimonials = lazy(() => import('../components/Testimonials'))

const ProductGrid = memo(({ products, isLoading, priorityFirstRow = false }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
    {isLoading
      ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
      : products.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            priority={priorityFirstRow && index < 4}
          />
        ))}
  </div>
))

ProductGrid.displayName = 'ProductGrid'

const Home = () => {
  const { data, isLoading } = useGetHomeFeedQuery(4)

  const featuredProducts = data?.data?.featured || []
  const newArrivals = data?.data?.newArrivals || []
  const limitedEdition = data?.data?.limitedEdition || []

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/shop?keyword={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
    []
  )

  return (
    <>
      <Seo path="/" jsonLd={jsonLd} />

      <Hero />

      <section className="py-24 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#a6813f] mb-4">
              FEATURED
            </p>
            <h2 className="text-5xl font-serif text-[#0b0b0c]">
              Featured Collection
            </h2>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} priorityFirstRow />
        </div>
      </section>

      <section className="py-24 bg-white border-y border-[#c8a45c]/10 content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#a6813f] mb-4">NEW ARRIVALS</p>
            <h2 className="text-5xl font-serif text-[#0b0b0c]">Latest Additions</h2>
          </div>
          <ProductGrid products={newArrivals} isLoading={isLoading} />
        </div>
      </section>

      <section className="py-24 bg-[#0b0b0c] text-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#a6813f] mb-4">EXCLUSIVE</p>
            <h2 className="text-5xl font-serif">Limited Edition</h2>
          </div>
          <ProductGrid products={limitedEdition} isLoading={isLoading} />
        </div>
      </section>

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      <section className="py-24 bg-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="bg-white border border-[#c8a45c]/20 p-10 transition-transform duration-300 hover:-translate-y-1.5">
              <div className="text-6xl font-serif text-[#a6813f] mb-5">01</div>
              <h3 className="text-2xl font-serif mb-4">Authentic Guarantee</h3>
              <p className="text-[#0b0b0c]/60 leading-relaxed">
                Every timepiece is 100% authentic and comes with a certificate of authenticity.
              </p>
            </div>
            <div className="bg-white border border-[#c8a45c]/20 p-10 transition-transform duration-300 hover:-translate-y-1.5">
              <div className="text-6xl font-serif text-[#a6813f] mb-5">02</div>
              <h3 className="text-2xl font-serif mb-4">Worldwide Shipping</h3>
              <p className="text-[#0b0b0c]/60 leading-relaxed">
                Secure and insured shipping to destinations worldwide with tracking.
              </p>
            </div>
            <div className="bg-white border border-[#c8a45c]/20 p-10 transition-transform duration-300 hover:-translate-y-1.5">
              <div className="text-6xl font-serif text-[#a6813f] mb-5">03</div>
              <h3 className="text-2xl font-serif mb-4">2-Year Warranty</h3>
              <p className="text-[#0b0b0c]/60 leading-relaxed">
                Comprehensive warranty coverage on all our luxury timepieces.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
