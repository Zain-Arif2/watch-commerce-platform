import ReviewService from '../services/ReviewService.js'

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await ReviewService.getReviewsByProduct(req.params.productId)
    res.json({ success: true, data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body

    if (!productId || !rating || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product, rating, and comment are required',
      })
    }

    const review = await ReviewService.createReview({
      userId: req.user._id,
      productId,
      rating: Number(rating),
      comment: comment.trim(),
    })

    res.status(201).json({ success: true, data: review })
  } catch (error) {
    const status = error.message.includes('already reviewed') ? 400 : 500
    res.status(status).json({ success: false, message: error.message })
  }
}
