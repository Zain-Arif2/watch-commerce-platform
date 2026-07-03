// App.jsx
import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppLoader from "./components/AppLoader";

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Cart = lazy(() => import('./pages/Cart'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess')) // <-- added
const Wishlist = lazy(() => import('./pages/Wishlist'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Brands = lazy(() => import('./pages/Brands'))
const BrandProducts = lazy(() => import('./pages/BrandProducts'))
const Account = lazy(() => import('./pages/Account'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))

import { useGetMeQuery } from './features/auth/authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './features/auth/authSlice'
import { setCart } from './features/cart/cartSlice'
import { setWishlist } from './features/wishlist/wishlistSlice'

function App() {
  const dispatch = useDispatch()
 const { data: userData, isLoading } = useGetMeQuery();


  useEffect(() => {
    if (userData?.data) {
      dispatch(setCredentials(userData.data))
    }
  }, [userData, dispatch])

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

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<AppLoader />}>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route
              path="*"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:slug" element={<Product />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/checkout/success" element={<OrderSuccess />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route path="/brands/:slug" element={<BrandProducts />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/account/orders" element={<Account />} />
                      <Route path="/account/addresses" element={<Account />} />
                      <Route path="/account/settings" element={<Account />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App