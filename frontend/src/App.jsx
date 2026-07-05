import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AppLoader from './components/AppLoader'
import StoreLayout from './layouts/StoreLayout'
import { useGetMeQuery } from './features/auth/authApiSlice'
import { setCredentials } from './features/auth/authSlice'
import { setCart } from './features/cart/cartSlice'
import { setWishlist } from './features/wishlist/wishlistSlice'

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Cart = lazy(() => import('./pages/Cart'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Brands = lazy(() => import('./pages/Brands'))
const BrandProducts = lazy(() => import('./pages/BrandProducts'))
const Account = lazy(() => import('./pages/Account'))
const FAQ = lazy(() => import("./pages/FAQ"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Warranty = lazy(() => import("./pages/Warranty"));
const Terms = lazy(() => import("./pages/Terms"))

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))

const hasAuthSession = () => {
  try {
    return localStorage.getItem('auth_session') === '1'
  } catch {
    return false
  }
}

const hasCheckedAuth = () => {
  try {
    return sessionStorage.getItem('auth_checked') === '1'
  } catch {
    return false
  }
}

function App() {
  const dispatch = useDispatch()
  const shouldCheckAuth = hasAuthSession() || !hasCheckedAuth()
  const { data: userData, isSuccess, isError, isLoading } = useGetMeQuery(undefined, {
    skip: !shouldCheckAuth,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  })
  useEffect(() => {
    if (userData?.data) {
      dispatch(setCredentials(userData.data))
    }
  }, [userData, dispatch])

  useEffect(() => {
    if (!shouldCheckAuth || isLoading) return

    if (isSuccess || isError) {
      try {
        sessionStorage.setItem('auth_checked', '1')
      } catch {
        // ignore storage errors
      }
    }
  }, [shouldCheckAuth, isLoading, isSuccess, isError])

  useEffect(() => {
    const guestCartRaw = localStorage.getItem('guest_cart_items')
    const guestWishlistRaw = localStorage.getItem('guest_wishlist_products')

    let guestCartItems = []
    let guestWishlistProducts = []

    try {
      guestCartItems = guestCartRaw ? JSON.parse(guestCartRaw) : []
    } catch (error) {
      console.error('Invalid guest cart data:', error)
    }

    try {
      guestWishlistProducts = guestWishlistRaw ? JSON.parse(guestWishlistRaw) : []
    } catch (error) {
      console.error('Invalid guest wishlist data:', error)
    }

    dispatch(setCart({ items: Array.isArray(guestCartItems) ? guestCartItems : [] }))
    dispatch(
      setWishlist({
        products: Array.isArray(guestWishlistProducts) ? guestWishlistProducts : [],
      })
    )
  }, [dispatch])

  // App.jsx
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />

          <Route element={<StoreLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<Product />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="checkout/success" element={<OrderSuccess />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:slug" element={<BrandProducts />} />
            <Route path="account" element={<Account />} />
            <Route path="account/orders" element={<Account />} />
            <Route path="account/addresses" element={<Account />} />
            <Route path="account/settings" element={<Account />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
