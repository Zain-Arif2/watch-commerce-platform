const prefetched = new Set()

export const prefetchRoute = (importFn) => {
  const key = importFn.toString()
  if (prefetched.has(key)) return
  prefetched.add(key)
  importFn().catch(() => prefetched.delete(key))
}

export const prefetchOnHover = (importFn) => ({
  onMouseEnter: () => prefetchRoute(importFn),
  onFocus: () => prefetchRoute(importFn),
})
