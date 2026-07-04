import { Watch } from 'lucide-react'

const AppLoader = () => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0c]"
    role="status"
    aria-live="polite"
    aria-label="Loading page"
  >
    <div className="flex flex-col items-center">
      <div className="animate-spin">
        <Watch size={56} strokeWidth={1.5} className="text-[#c8a45c]" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-3xl font-serif tracking-[0.2em] text-[#f5f1e8]">
        CHRONO<span className="text-[#c8a45c]">LUX</span>
      </h1>

      <p className="mt-2 text-xs tracking-[0.3em] uppercase text-[#c8a45c]">
        Loading...
      </p>
    </div>
  </div>
)

export default AppLoader
