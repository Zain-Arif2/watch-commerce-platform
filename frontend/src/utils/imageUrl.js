export const optimizeImageUrl = (url, { width = 400, quality = 'auto' } = {}) => {
  if (!url || typeof url !== 'string') return url

  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/upload/f_auto') || url.includes('/upload/w_')) return url
    return url.replace('/upload/', `/upload/f_auto,q_${quality},w_${width}/`)
  }

  return url
}
