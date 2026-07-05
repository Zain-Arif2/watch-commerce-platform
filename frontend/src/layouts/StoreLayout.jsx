import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AppLoader from '../components/AppLoader'
import ScrollToTopButton from '../components/ScrollToTopButton'

const Footer = lazy(() => import('../components/Footer'))

const StoreLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Suspense fallback={<AppLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
    <ScrollToTopButton />
  </div>
)

export default StoreLayout