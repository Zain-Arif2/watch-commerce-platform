import React from 'react'
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

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#0b0b0c] text-white flex flex-col flex-shrink-0">

        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/5">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#a6813f]/70 mb-1.5">
            ChronoLux
          </p>
          <h1 className="text-xl font-serif text-white">Admin Panel</h1>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
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
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Breadcrumbs pathname={location.pathname} />
          {children}
        </div>
      </main>

    </div>
  )
}

export default AdminLayout
