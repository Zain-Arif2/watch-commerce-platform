import ReviewRepository from '../repositories/ReviewRepository.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'

class ReviewService {
  constructor() {
    this.reviewRepository = ReviewRepository
  }

  async getReviewsByProduct(productId) {
    return await this.reviewRepository.findByProduct(productId)
  }

  async createReview({ userId, productId, rating, comment }) {
    const product = await Product.findById(productId)
    if (!product) {
      throw new Error('Product not found')
    }

    const existingReview = await Review.findOne({ user: userId, product: productId })
    if (existingReview) {
      throw new Error('You have already reviewed this product')
    }

    const review = await this.reviewRepository.create({
      user: userId,
      product: productId,
      rating,
      comment,
    })

    const reviews = await Review.find({ product: productId })
    const numReviews = reviews.length
    const ratingSum = reviews.reduce((sum, item) => sum + item.rating, 0)

    product.rating = ratingSum / numReviews
    product.numReviews = numReviews
    await product.save()

    return await Review.findById(review._id).populate('user', 'name')
  }
}

export default new ReviewService()
