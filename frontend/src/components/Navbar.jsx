import React, { memo, useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Search, Menu, X, User, ChevronDown } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useGetCartQuery } from '../features/cart/cartApiSlice'
import { useLogoutMutation } from '../features/auth/authApiSlice'
import { logout } from '../features/auth/authSlice'
import { prefetchOnHover } from '../utils/prefetch'

const navLinks = [
  { label: 'HOME', path: '/', prefetch: () => import('../pages/Home') },
  { label: 'SHOP', path: '/shop', prefetch: () => import('../pages/Shop') },
  { label: 'BRANDS', path: '/brands', prefetch: () => import('../pages/Brands') },
  { label: 'ABOUT', path: '/about', prefetch: () => import('../pages/About') },
  { label: 'CONTACT', path: '/contact', prefetch: () => import('../pages/Contact') },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // holds current search input value
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const guestCartItems = useSelector((state) => state.cart.items)
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const [logoutApi] = useLogoutMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItemsCount = useMemo(
    () =>
      isAuthenticated
        ? cartData?.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
        : guestCartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [isAuthenticated, cartData, guestCartItems]
  )

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi().unwrap()
      dispatch(logout())
      navigate('/')
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [dispatch, logoutApi, navigate])

  // Handles the search form submission: navigates to /shop with the search query
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const trimmed = searchQuery.trim()
      if (!trimmed) return
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    },
    [searchQuery, navigate]
  )

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
          <Link to="/" className="group relative flex flex-col items-start shrink-0">
            <span className="text-lg sm:text-xl lg:text-2xl font-serif tracking-[0.2em] sm:tracking-[0.25em] text-[#f5f1e8]">
              CHRONO<span className="text-[#c8a45c]">LUX</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                {...prefetchOnHover(link.prefetch)}
                className="relative text-[13px] font-medium tracking-[0.15em] text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300 group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-[#c8a45c] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300"
              aria-label="Search"
              aria-expanded={isSearchOpen}
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
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c8a45c] text-[#0b0b0c] text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] flex items-center justify-center animate-scale-in">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-[#f5f1e8]/80 hover:text-[#c8a45c] transition-colors duration-300"
                  aria-expanded={isUserMenuOpen}
                >
                  <User size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
                  <ChevronDown
                    size={13}
                    className={`hidden sm:block transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 sm:w-52 bg-[#141416] border border-[#c8a45c]/20 rounded-sm shadow-2xl py-2 overflow-hidden animate-fade-in-down">
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
                  </div>
                )}
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
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`border-t border-[#c8a45c]/15 bg-[#0b0b0c] overflow-hidden transition-all duration-250 ${
          isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[#c8a45c]/30 pb-2">
            <Search size={17} strokeWidth={1.5} className="text-[#c8a45c] mr-3 sm:w-[18px] sm:h-[18px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, brands..."
              autoFocus={isSearchOpen}
              className="flex-1 bg-transparent text-[#f5f1e8] placeholder-[#f5f1e8]/40 text-sm tracking-wide outline-none"
            />
          </form>
        </div>
      </div>

      <div
        className={`md:hidden bg-[#0b0b0c] border-t border-[#c8a45c]/15 overflow-hidden transition-all duration-250 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-sm font-medium tracking-[0.15em] text-[#f5f1e8]/85 hover:text-[#c8a45c] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
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
      </div>
    </nav>
  )
}

export default memo(Navbar)