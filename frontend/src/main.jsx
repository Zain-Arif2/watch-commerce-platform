import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LazyMotionProvider from './components/LazyMotionProvider.jsx'
import reportWebVitals from './utils/reportWebVitals.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <LazyMotionProvider>
            <Toaster position="top-center" />
            <App />
          </LazyMotionProvider>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
)

if (import.meta.env.PROD) {
  reportWebVitals((metric) => {
    if (import.meta.env.DEV) {
      console.info(`[Web Vitals] ${metric.name}:`, metric.value)
    }
  })
}
