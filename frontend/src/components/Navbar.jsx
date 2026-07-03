import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Search, Menu, X, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useGetCartQuery } from '../features/cart/cartApiSlice'
import { useLogoutMutation } from '../features/auth/authApiSlice'
import { logout } from '../features/auth/authSlice'

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'SHOP', path: '/shop' },
  { label: 'BRANDS', path: '/brands' },
  { label: 'ABOUT', path: '/about' },
  { label: 'CONTACT', path: '/contact' },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const guestCartItems = useSelector((state) => state.cart.items)
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const [logoutApi] = useLogoutMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItemsCount = isAuthenticated
    ? cartData?.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
    : guestCartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // close mobile menu automatically if screen resized to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
      dispatch(logout())
      navigate('/')
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0b0b0c]/85 backdrop-blur-xl border-b border-[#c8a45c]/20 shadow-[0_4px_30px_rgba(0,0,0,0.25)]'
          : 'bg-[#0b0b0c] border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="group relative flex flex-col items-start shrink-0">
            <span className="text-lg sm:text-xl lg:text-2xl font-serif tracking-[0.2em] sm:tracking-[0.25em] text-[#f5f1e8]">
              CHRONO<span className="text-[#c8a45c]">LUX</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-[13px] font-medium tracking-[0.15em] text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300 group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-[#c8a45c] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
            </button>

            <Link
              to="/wishlist"
              className="hidden sm:block text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.5} />
            </Link>

            <Link
              to="/cart"
              className="relative text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300"
              aria-label="Cart"
            >
              <ShoppingCart size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-[#c8a45c] text-[#0b0b0c] text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300"
                >
                  <User size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
                  <ChevronDown
                    size={13}
                    className={`hidden sm:block transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-3 w-48 sm:w-52 bg-[#141416] border border-[#c8a45c]/20 rounded-sm shadow-2xl py-2 overflow-hidden"
                    >
                      <Link
                        to="/account"
                        className="block px-4 sm:px-5 py-2.5 text-[13px] tracking-wide text-[#f5f1e8]/85 hover:bg-[#c8a45c]/10 hover:text-[#c8a45c] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 sm:px-5 py-2.5 text-[13px] tracking-wide text-[#f5f1e8]/85 hover:bg-[#c8a45c]/10 hover:text-[#c8a45c] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="h-px bg-[#c8a45c]/10 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 sm:px-5 py-2.5 text-[13px] tracking-wide text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300">
                <User size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
              </Link>
            )}

            <button
              className="md:hidden text-[#f5f1e8]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-[#c8a45c]/15 bg-[#0b0b0c] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
              <div className="flex items-center border-b border-[#c8a45c]/30 pb-2">
                <Search size={17} strokeWidth={1.5} className="text-[#c8a45c] mr-3 sm:w-[18px] sm:h-[18px]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search timepieces, brands..."
                  className="flex-1 bg-transparent text-[#f5f1e8] placeholder-[#f5f1e8]/40 text-sm tracking-wide outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#0b0b0c] border-t border-[#c8a45c]/15 overflow-hidden"
          >
            <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="block text-sm font-medium tracking-[0.15em] text-[#f5f1e8]/85 hover:text-[#c8a45c] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="h-px bg-[#c8a45c]/10" />
              <Link
                to="/wishlist"
                className="flex items-center space-x-2 text-sm text-[#f5f1e8]/85 hover:text-[#c8a45c] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={16} strokeWidth={1.5} />
                <span>Wishlist</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar