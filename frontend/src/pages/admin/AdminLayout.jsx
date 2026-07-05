import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApiSlice'
import toast from 'react-hot-toast'

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/admin',           label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products',  label: 'Products',  icon: Package          },
  { path: '/admin/orders',    label: 'Orders',    icon: ShoppingBag      },
  { path: '/admin/customers', label: 'Customers', icon: Users            },
]

// ─── Breadcrumb map ───────────────────────────────────────────────────────────
const BREADCRUMB_MAP = {
  '/admin':           [{ label: 'Admin' }, { label: 'Dashboard' }],
  '/admin/products':  [{ label: 'Admin', to: '/admin' }, { label: 'Products' }],
  '/admin/orders':    [{ label: 'Admin', to: '/admin' }, { label: 'Orders' }],
  '/admin/customers': [{ label: 'Admin', to: '/admin' }, { label: 'Customers' }],
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
const Breadcrumbs = ({ pathname }) => {
  const crumbs = BREADCRUMB_MAP[pathname] || [
    { label: 'Admin', to: '/admin' },
    { label: 'Page' },
  ]

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-[#0b0b0c]/50 mb-6"
    >
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.label}>
          {i > 0 && (
            <ChevronRight size={12} className="text-[#0b0b0c]/30 flex-shrink-0" />
          )}
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="hover:text-[#a6813f] transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#0b0b0c]">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// ─── Admin initials avatar ────────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'AD'

  return (
    <div className="w-9 h-9 bg-[#a6813f] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
      {initials}
    </div>
  )
}

// ─── AdminLayout ──────────────────────────────────────────────────────────────
const AdminLayout = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutMutation] = useLogoutMutation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // mobile drawer state

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap()
    } catch {
      // proceed even if API call fails
    }
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  // Close the mobile drawer whenever a nav link is tapped
  const handleNavClick = () => setIsSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">

      {/* ── Mobile top bar ───────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-[#0b0b0c] text-white px-4 py-3">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#a6813f]/70 leading-none mb-1">
            ChronoLux
          </p>
          <h1 className="text-base font-serif leading-none">Admin Panel</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
          className="text-white/80 hover:text-white p-1"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Mobile overlay backdrop ──────────────────────────────── */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`
          w-64 bg-[#0b0b0c] text-white flex flex-col flex-shrink-0
          fixed top-0 left-0 h-screen z-50 overflow-y-auto
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0
        `}
      >
        {/* Logo + mobile close button */}
        <div className="px-6 py-8 border-b border-white/5 flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#a6813f]/70 mb-1.5">
              ChronoLux
            </p>
            <h1 className="text-xl font-serif text-white">Admin Panel</h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-white/50 hover:text-white p-1 -mt-1 -mr-1"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-none ${
                  isActive
                    ? 'bg-[#a6813f]/15 text-[#c8a45c] border-l-2 border-[#a6813f] pl-[calc(1rem-2px)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? 'text-[#c8a45c]' : 'text-white/40'}
                />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* ── Bottom section: Back to store + profile + logout ── */}
        <div className="border-t border-white/5">

          {/* Back to store */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-7 py-4 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Store size={15} strokeWidth={1.5} className="text-white/30" />
            Back to Store
          </Link>

          {/* Divider */}
          <div className="mx-6 border-t border-white/5" />

          {/* Admin profile */}
          <div className="flex items-center gap-3 px-6 py-4">
            <Avatar name={user?.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-white/40 truncate">
                {user?.email || 'admin@chronolux.com'}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-7 py-3.5 text-sm text-white/50 hover:text-red-400 hover:bg-white/5 transition-all border-t border-white/5 group"
          >
            <LogOut
              size={15}
              strokeWidth={1.5}
              className="text-white/30 group-hover:text-red-400 transition-colors"
            />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        <div className="p-5 sm:p-8">
          <Breadcrumbs pathname={location.pathname} />
          {children}
        </div>
      </main>

    </div>
  )
}

export default AdminLayout