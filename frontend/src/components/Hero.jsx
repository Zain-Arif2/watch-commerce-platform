// src/components/Hero.jsx
import React from 'react'
import {m} from 'framer-motion'
import { Link } from 'react-router-dom'
import { Watch, ShieldCheck, Truck } from 'lucide-react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const stats = [
  { value: '15+', label: 'Years of Craft' },
  { value: '50K+', label: 'Happy Clients' },
  { value: '30+', label: 'Luxury Brands' },
]

const Hero = () => {
  return (
    <section className="relative bg-primary text-white overflow-hidden">
      {/* Decorative glow blobs — now pure CSS, off the JS thread */}
      <div className="animate-blob-1 absolute -top-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="animate-blob-2 absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <m.p
              variants={itemVariants}
              className="text-accent font-semibold tracking-[0.2em] sm:tracking-widest mb-3 sm:mb-4 text-xs sm:text-sm"
            >
              LUXURY TIMEPIECES
            </m.p>

            <m.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 sm:mb-6"
            >
              Timeless Elegance, <br />
              <span className="text-accent">Precision Crafted</span>
            </m.h1>

            <m.p
              variants={itemVariants}
              className="text-gray-400 text-base sm:text-lg mb-7 sm:mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Discover our exclusive collection of luxury watches, where tradition meets innovation and every second counts.
            </m.p>

            <m.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 sm:mb-12"
            >
              <Link
                to="/shop"
                className="block px-8 py-4 bg-accent text-primary font-bold tracking-wider hover:bg-white transition-colors text-center hover:scale-105 active:scale-95 transition-transform"
              >
                SHOP NOW
              </Link>
              <Link
                to="/about"
                className="block px-8 py-4 border-2 border-white text-white font-bold tracking-wider hover:bg-white hover:text-primary transition-colors text-center hover:scale-105 active:scale-95 transition-transform"
              >
                LEARN MORE
              </Link>
            </m.div>

            <m.div
              variants={itemVariants}
              className="flex justify-center lg:justify-start gap-8 sm:gap-12 mb-8 sm:mb-0"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-gray-500 text-[11px] sm:text-xs tracking-wide mt-1">{stat.label}</div>
                </div>
              ))}
            </m.div>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-first lg:order-last"
          >
            {/* Bobbing wrapper — CSS animation instead of framer-m loop */}
            <div className="animate-watch-bob relative z-10 mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full">
              <div className="w-full aspect-square bg-gradient-to-br from-accent/20 to-transparent rounded-full flex items-center justify-center">
                <div className="animate-glow w-4/5 aspect-square bg-gradient-to-br from-accent/30 to-transparent rounded-full flex items-center justify-center border border-accent/20">
                  <m.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: 'backOut' }}
                  >
                    <div className="animate-wobble">
                      <Watch size={72} className="text-accent mx-auto mb-3 sm:w-20 sm:h-20" strokeWidth={1} />
                    </div>
                    <div className="text-gray-400 tracking-widest text-xs sm:text-sm">SINCE 2010</div>
                  </m.div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>

      {/* Scroll indicator — CSS animation */}
      <m.div
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="animate-scroll flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em]">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-accent to-transparent" />
        </div>
      </m.div>
    </section>
  )
}

export default Hero