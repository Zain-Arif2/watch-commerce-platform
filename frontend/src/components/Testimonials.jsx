import React, { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: 'Alexander Reed',
    role: 'Collector, New York',
    rating: 5,
    quote:
      'The craftsmanship exceeded every expectation. From unboxing to wearing, CHRONOLUX delivered a truly premium experience.',
  },
  {
    name: 'Sofia Laurent',
    role: 'Entrepreneur, Paris',
    rating: 5,
    quote:
      'I purchased a limited edition piece and the attention to detail was remarkable. Fast shipping and authentic certification.',
  },
  {
    name: 'James Whitmore',
    role: 'Watch Enthusiast, London',
    rating: 5,
    quote:
      'Excellent curation and customer support. The team helped me choose the perfect timepiece for my collection.',
  },
  {
    name: 'Elena Marchetti',
    role: 'Fashion Director, Milan',
    rating: 5,
    quote:
      'CHRONOLUX understands luxury. Every piece feels curated, not just sold. The packaging alone felt like an event.',
  },
  {
    name: 'Michael Chen',
    role: 'Investor, Singapore',
    rating: 5,
    quote:
      'Bought three pieces over the past year — each one authenticated and delivered on time. Trust matters, and they earned it.',
  },
  {
    name: 'Isabella Cruz',
    role: 'Interior Designer, Dubai',
    rating: 5,
    quote:
      'The concierge team walked me through every detail before I purchased. It felt personal, not transactional.',
  },
]

const SLIDES_TO_SHOW = 3
const AUTO_PLAY_INTERVAL = 5000

const Testimonials = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const totalSlides = Math.ceil(testimonials.length / SLIDES_TO_SHOW)

  const goNext = () => {
    setDirection(1)
    setIndex((prev) => (prev + 1) % totalSlides)
  }

  const goPrev = () => {
    setDirection(-1)
    setIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  useEffect(() => {
    const timer = setInterval(goNext, AUTO_PLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [index])

  const currentGroup = testimonials.slice(
    index * SLIDES_TO_SHOW,
    index * SLIDES_TO_SHOW + SLIDES_TO_SHOW
  )

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  return (
    <section className="py-24 bg-[#0b0b0c] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#c8a45c] uppercase mb-4">
            TESTIMONIALS
          </p>
          <h2 className="text-4xl md:text-5xl font-serif">
            Trusted by Connoisseurs Worldwide
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-4 leading-relaxed">
            Discover why collectors and luxury watch lovers choose CHRONOLUX for
            authenticity, service, and timeless elegance.
          </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <m.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {currentGroup.map((item) => (
                <div
                  key={item.name}
                  className="relative bg-[#141416] border border-[#c8a45c]/20 p-8"
                >
                  <Quote className="text-[#c8a45c] mb-4" size={28} />

                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-[#c8a45c] text-[#c8a45c]"
                      />
                    ))}
                  </div>

                  <p className="text-white/80 leading-relaxed mb-8">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="border-t border-[#c8a45c]/15 pt-5">
                    <p className="font-semibold tracking-wide">{item.name}</p>
                    <p className="text-sm text-white/50 mt-1">{item.role}</p>
                  </div>
                </div>
              ))}
            </m.div>
          </AnimatePresence>

          {/* Nav Arrows */}
          <button
            onClick={goPrev}
            aria-label="Previous testimonials"
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-[#c8a45c]/30 text-[#c8a45c] hover:bg-[#c8a45c] hover:text-black transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            aria-label="Next testimonials"
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-[#c8a45c]/30 text-[#c8a45c] hover:bg-[#c8a45c] hover:text-black transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
  {Array.from({ length: totalSlides }).map((_, i) => (
    <button
      key={i}
      onClick={() => {
        setDirection(i > index ? 1 : -1)
        setIndex(i)
      }}
      aria-label={`Go to slide ${i + 1}`}
      className={`h-1.5 w-8 origin-left rounded-full transition-transform duration-300 ease-out ${
        i === index ? 'scale-x-100 bg-[#c8a45c]' : 'scale-x-[0.1875] bg-white/20'
      }`}
    />
  ))}
</div>
      </div>
    </section>
  )
}

export default Testimonials