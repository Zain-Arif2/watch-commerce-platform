import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6">
          <div className="max-w-2xl w-full bg-white border border-[#c8a45c]/20 shadow-[0_2px_20px_rgba(0,0,0,.04)] p-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#a6813f] mb-4">
              SYSTEM ERROR
            </p>

            <h1 className="text-5xl font-serif text-[#0b0b0c] mb-6">
              Something Went Wrong
            </h1>

            <p className="text-[#0b0b0c]/60 leading-relaxed mb-10 max-w-xl mx-auto">
              We apologize for the inconvenience. An unexpected error has
              occurred while processing your request. Please reload the page or
              try again in a few moments.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white px-10 py-4 tracking-[0.2em]"
            >
              RELOAD PAGE
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
export { ErrorBoundary }
