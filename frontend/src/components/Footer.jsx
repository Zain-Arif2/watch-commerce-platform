import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, ArrowRight, MapPin, Mail, Phone } from 'lucide-react'
import { useSubscribeNewsletterMutation } from '../features/newsletter/newsletterApiSlice'
import toast from 'react-hot-toast'
const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation()

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      const res = await subscribeNewsletter(email).unwrap()
      if (res.alreadySubscribed) {
        toast('You are already subscribed!')
      } else {
        setSubscribed(true)
        toast.success(res.message)
        setTimeout(() => setSubscribed(false), 3000)
      }
      setEmail('')
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <footer className="bg-[#0b0b0c] text-[#f5f1e8] border-t border-[#c8a45c]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-4 sm:col-span-2 lg:col-span-4">
            <h3 className="text-2xl font-serif tracking-[0.25em] mb-4">
              CHRONO<span className="text-[#c8a45c]">LUX</span>
            </h3>
            <p className="text-[#f5f1e8]/50 text-sm leading-relaxed mb-6 max-w-sm">
              Timeless elegance meets exceptional craftsmanship — a curated
              collection of the world's finest timepieces.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center space-x-3 text-[#f5f1e8]/50 text-xs sm:text-sm">
                <MapPin size={15} strokeWidth={1.5} className="text-[#c8a45c] shrink-0" />
                <span>12 Rue de la Paix, Geneva, Switzerland</span>
              </div>
              <div className="flex items-center space-x-3 text-[#f5f1e8]/50 text-xs sm:text-sm">
                <Mail size={15} strokeWidth={1.5} className="text-[#c8a45c] shrink-0" />
                <span>concierge@chronolux.com</span>
              </div>
              <div className="flex items-center space-x-3 text-[#f5f1e8]/50 text-xs sm:text-sm">
                <Phone size={15} strokeWidth={1.5} className="text-[#c8a45c] shrink-0" />
                <span>+41 22 000 0000</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-[11px] font-semibold tracking-[0.2em] text-[#c8a45c] mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Shop All', to: '/shop' },
                { label: 'Brands', to: '/brands' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-[#f5f1e8]/55 hover:text-[#c8a45c] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#c8a45c] mr-0 group-hover:mr-2 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold tracking-[0.2em] text-[#c8a45c] mb-4">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'FAQ', to: '/faq' },
                { label: 'Shipping & Returns', to: '/shipping' },
                { label: 'Warranty', to: '/warranty' },
                { label: 'Terms & Conditions', to: '/terms' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-[#f5f1e8]/55 hover:text-[#c8a45c] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#c8a45c] mr-0 group-hover:mr-2 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 sm:col-span-2 lg:col-span-3">
            <h4 className="text-[11px] font-semibold tracking-[0.2em] text-[#c8a45c] mb-4">
              NEWSLETTER
            </h4>
            <p className="text-[#f5f1e8]/50 text-sm mb-4 leading-relaxed">
              Subscribe for early access to new arrivals and private collector offers.
            </p>
            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <input
                type="email"
                id="newsletter-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full pl-4 pr-12 py-2.5 bg-white/[0.03] border border-[#c8a45c]/25 text-[#f5f1e8] placeholder-[#f5f1e8]/35 text-sm outline-none focus:border-[#c8a45c] transition-colors rounded-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                aria-label="Subscribe"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#c8a45c] text-[#0b0b0c] hover:bg-[#e0bd76] transition-colors rounded-sm flex items-center justify-center disabled:opacity-50"
              >
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </form>
            <p
              className={`text-xs text-[#c8a45c] mt-2 h-4 transition-opacity duration-300 ${subscribed ? 'opacity-100' : 'opacity-0'
                }`}
            >
              Thank you — you're on the list.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#c8a45c]/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#f5f1e8]/35 text-xs tracking-wide text-center sm:text-left order-2 sm:order-1">
            © 2026 CHRONOLUX. All rights reserved.
          </p>

          <div className="flex space-x-4 order-1 sm:order-2">
            {[
              { icon: Instagram, label: 'Instagram', href: '#' },
              { icon: Facebook, label: 'Facebook', href: '#' },
              { icon: Twitter, label: 'Twitter', href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center border border-[#c8a45c]/20 rounded-full text-[#f5f1e8]/60 hover:text-[#c8a45c] hover:border-[#c8a45c] transition-colors duration-300"
              >
                <Icon size={14} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer