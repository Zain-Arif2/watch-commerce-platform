const reportWebVitals = (onPerfEntry) => {
  if (typeof onPerfEntry !== 'function') return

  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    onCLS(onPerfEntry)
    onINP(onPerfEntry)
    onLCP(onPerfEntry)
    onFCP(onPerfEntry)
    onTTFB(onPerfEntry)
  })
}

export default reportWebVitals
