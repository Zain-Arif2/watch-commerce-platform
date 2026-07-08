import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const SEO_DATA = {
  title: 'About Us | CHRONOLUX — Curated Luxury Watches',
  description:
    "Discover the story behind CHRONOLUX. We curate certified-authentic luxury timepieces from the world's most prestigious watch brands, backed by expert horologists and dedicated concierge service.",
  canonical: 'https://www.chronolux.com/about',
  image: 'https://www.chronolux.com/og/about.jpg',
}

/**
 * Sets/updates a <meta> tag by name or property.
 * Creates the tag if it doesn't exist yet, otherwise updates it in place.
 */
const setMetaTag = (attr, key, content) => {
  let tag = document.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const setLinkTag = (rel, href) => {
  let tag = document.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

const setJsonLd = (id, data) => {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

const About = () => {
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const prevTitle = document.title
    document.title = SEO_DATA.title

    setMetaTag('name', 'description', SEO_DATA.description)
    setLinkTag('canonical', SEO_DATA.canonical)

    // Open Graph
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:title', SEO_DATA.title)
    setMetaTag('property', 'og:description', SEO_DATA.description)
    setMetaTag('property', 'og:url', SEO_DATA.canonical)
    setMetaTag('property', 'og:site_name', 'CHRONOLUX')
    setMetaTag('property', 'og:image', SEO_DATA.image)

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', SEO_DATA.title)
    setMetaTag('name', 'twitter:description', SEO_DATA.description)
    setMetaTag('name', 'twitter:image', SEO_DATA.image)

    // JSON-LD structured data — AboutPage + Organization
    setJsonLd('about-page-schema', {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: SEO_DATA.title,
      description: SEO_DATA.description,
      url: SEO_DATA.canonical,
      mainEntity: {
        '@type': 'Organization',
        name: 'CHRONOLUX',
        url: 'https://www.chronolux.com',
        foundingDate: '2010',
        description:
          "CHRONOLUX curates certified-authentic luxury watches from the world's finest brands, with expert authentication and dedicated collector support.",
        address: {
          '@type': 'PostalAddress',
          streetAddress: '12 Rue de la Paix',
          addressLocality: 'Geneva',
          addressCountry: 'CH',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'concierge@chronolux.com',
          contactType: 'customer service',
        },
      },
    })

    // JSON-LD structured data — FAQPage (can earn rich snippets in search results)
    setJsonLd('about-faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Are the watches sold by CHRONOLUX genuine?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Every timepiece sold on CHRONOLUX is verified for authenticity by our in-house horologists and comes with complete documentation, including original papers and box where available.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which luxury watch brands does CHRONOLUX carry?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our curated collection includes prestigious Swiss and international watchmakers such as Rolex, Patek Philippe, Audemars Piguet, Omega, and Cartier, sourced through vetted dealers and private collections.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does CHRONOLUX offer a warranty on pre-owned watches?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every purchase includes a CHRONOLUX authenticity guarantee and warranty coverage, giving collectors added confidence when buying pre-owned luxury timepieces.',
          },
        },
      ],
    })

    // Restore previous title when leaving this page
    return () => {
      document.title = prevTitle
    }
  }, [])

  const pillars = [
    {
      number: '01',
      title: 'Authenticity Guaranteed',
      body: 'Every timepiece is certified authentic with complete documentation.',
    },
    {
      number: '02',
      title: 'Expert Curators',
      body: 'Our team of horologists ensures only the finest pieces make it to our collection.',
    },
    {
      number: '03',
      title: 'Exceptional Service',
      body: 'Dedicated support from our knowledgeable team throughout your journey.',
    },
  ]

  const stats = [
    { value: '15+', label: 'Years Curating Luxury Watches' },
    { value: '2,000+', label: 'Timepieces Authenticated' },
    { value: '30+', label: 'Prestigious Brands Sourced' },
    { value: '98%', label: 'Collector Satisfaction Rate' },
  ]

  const brands = [
    'Rolex',
    'Patek Philippe',
    'Audemars Piguet',
    'Omega',
    'Cartier',
    'Vacheron Constantin',
    'IWC Schaffhausen',
    'Jaeger-LeCoultre',
  ]

  const faqs = [
    {
      question: 'Are the watches sold by CHRONOLUX genuine?',
      answer:
        'Yes. Every timepiece sold on CHRONOLUX is verified for authenticity by our in-house horologists and comes with complete documentation, including original papers and box where available.',
    },
    {
      question: 'Which luxury watch brands does CHRONOLUX carry?',
      answer:
        'Our curated collection includes prestigious Swiss and international watchmakers such as Rolex, Patek Philippe, Audemars Piguet, Omega, and Cartier, sourced through vetted dealers and private collections.',
    },
    {
      question: 'Does CHRONOLUX offer a warranty on pre-owned watches?',
      answer:
        'Every purchase includes a CHRONOLUX authenticity guarantee and warranty coverage, giving collectors added confidence when buying pre-owned luxury timepieces.',
    },
  ]

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero */}
        <header className="text-center mb-20">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#a6813f] mb-4">
            OUR STORY
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif tracking-wide mb-6">
            About CHRONOLUX
          </h1>
          <p className="text-lg text-[#0b0b0c]/60 max-w-3xl mx-auto leading-relaxed">
            Where time meets elegance. We curate the finest luxury watches
            from the world's most prestigious brands.
          </p>
        </header>

        {/* Brand story */}
        <section aria-labelledby="our-history" className="max-w-3xl mx-auto mb-24 text-center">
          <h2 id="our-history" className="text-3xl font-serif mb-6">
            Our History
          </h2>
          <p className="text-[#0b0b0c]/65 leading-relaxed mb-4">
            Founded in Geneva in 2014, CHRONOLUX began as a small atelier
            connecting discerning collectors with rare Swiss timepieces. Over
            the past decade, we have grown into a trusted destination for
            luxury watch buyers and sellers around the world, working
            directly with authorized dealers, private collectors, and
            certified horologists to source pieces that meet our exacting
            standards.
          </p>
          <p className="text-[#0b0b0c]/65 leading-relaxed">
            Today, CHRONOLUX specializes in buying and selling pre-owned and
            new luxury watches from iconic maisons including Rolex, Patek
            Philippe, Audemars Piguet, and Omega. Every watch that enters our
            collection passes through a rigorous multi-point authentication
            process before it reaches a collector's wrist.
          </p>
        </section>

        {/* Stats */}
        <section aria-labelledby="chronolux-in-numbers" className="mb-24">
          <h2 id="chronolux-in-numbers" className="sr-only">
            CHRONOLUX in numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-[#c8a45c]/20 py-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-serif text-[#a6813f] mb-2">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-[#0b0b0c]/55 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section aria-labelledby="why-chronolux" className="mb-24">
          <h2 id="why-chronolux" className="text-3xl font-serif text-center mb-12">
            Why Collectors Choose CHRONOLUX
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pillars.map((pillar) => (
              <article key={pillar.number} className="text-center">
                <div className="w-20 h-20 border border-[#c8a45c]/40 bg-[#c8a45c]/[0.06] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#a6813f] font-serif text-2xl">
                    {pillar.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
                <p className="text-[#0b0b0c]/60 leading-relaxed">{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Brands we carry */}
        <section aria-labelledby="brands-we-carry" className="mb-24 text-center">
          <h2 id="brands-we-carry" className="text-3xl font-serif mb-4">
            Luxury Watch Brands We Carry
          </h2>
          <p className="text-[#0b0b0c]/60 max-w-2xl mx-auto leading-relaxed mb-10">
            From heritage Swiss watchmakers to modern icons, our collection
            spans the brands most sought after by serious collectors.
          </p>
          <ul className="flex flex-wrap justify-center gap-3">
            {brands.map((brand) => (
              <li
                key={brand}
                className="px-5 py-2 border border-[#c8a45c]/30 rounded-full text-sm text-[#0b0b0c]/70 bg-white"
              >
                {brand}
              </li>
            ))}
          </ul>
        </section>

        {/* Mission */}
        <section
          aria-labelledby="our-mission"
          className="bg-white border border-[#c8a45c]/25 rounded-sm p-12 text-center shadow-[0_2px_20px_rgba(0,0,0,0.04)] mb-24"
        >
          <h2 id="our-mission" className="text-3xl font-serif mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-[#0b0b0c]/60 max-w-3xl mx-auto leading-relaxed">
            To make luxury watch ownership accessible, transparent, and
            truly special. Whether you're a collector or buying your first
            luxury timepiece, we're here to guide you every second of the
            way.
          </p>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="max-w-3xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#a6813f] text-center mb-3">
            GOT QUESTIONS
          </p>
          <h2 id="faq-heading" className="text-3xl font-serif text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <article
                  key={faq.question}
                  className={`border rounded-sm bg-white transition-colors duration-300 ${
                    isOpen ? 'border-[#c8a45c]/50' : 'border-[#c8a45c]/15'
                  }`}
                >
                  <h3 className="m-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                    >
                      <span className="text-base sm:text-lg font-semibold text-[#0b0b0c]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        strokeWidth={1.75}
                        className={`shrink-0 text-[#a6813f] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-[#0b0b0c]/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default About