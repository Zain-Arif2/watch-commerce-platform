import React from 'react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Testimonials from '../components/Testimonials'
import { ProductCardSkeleton } from '../components/Skeleton'
import { useGetProductsQuery } from '../features/products/productsApiSlice'
import { motion } from 'framer-motion'

const Home = () => {
  const { data: featuredData, isLoading: featuredLoading } = useGetProductsQuery({ isFeatured: true, limit: 4 })
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useGetProductsQuery({ isNewArrival: true, limit: 4 })
  const { data: limitedData, isLoading: limitedLoading } = useGetProductsQuery({ isLimitedEdition: true, limit: 4 })

  const featuredProducts = featuredData?.data?.products || []
  const newArrivals = newArrivalsData?.data?.products || []
  const limitedEdition = limitedData?.data?.products || []

  return (
    <div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredLoading ? (
              [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-[#c8a45c]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#a6813f] mb-4">NEW ARRIVALS</p>
            <h2 className="text-5xl font-serif text-[#0b0b0c]">Latest Additions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivalsLoading ? (
              [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0b0b0c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#a6813f] mb-4">EXCLUSIVE</p>
            <h2 className="text-5xl font-serif  ">Limited Edition</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {limitedLoading ? (
              [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              limitedEdition.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: .3 }}
              className="bg-white border border-[#c8a45c]/20 p-10"
            >
              <div className="text-6xl font-serif text-[#a6813f] mb-5">
                01
              </div>
              <h3 className="text-2xl font-serif mb-4">
                Authentic Guarantee
              </h3>
              <p className="text-[#0b0b0c]/60 leading-relaxed">
                Every timepiece is 100% authentic and comes with a certificate of authenticity.
              </p>            </motion.div>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: .3 }}
              className="bg-white border border-[#c8a45c]/20 p-10"
            >
              <div className="text-6xl font-serif text-[#a6813f] mb-5">
                02
              </div>
              <h3 className="text-2xl font-serif mb-4">Worldwide Shipping</h3>
              <p className="text-[#0b0b0c]/60 leading-relaxed">Secure and insured shipping to destinations worldwide with tracking.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: .3 }}
              className="bg-white border border-[#c8a45c]/20 p-10"
            >
              <div className="text-6xl font-serif text-[#a6813f] mb-5">
                03
              </div>
              <h3 className="text-2xl font-serif mb-4">2-Year Warranty</h3>
              <p className="text-[#0b0b0c]/60 leading-relaxed">Comprehensive warranty coverage on all our luxury timepieces.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
