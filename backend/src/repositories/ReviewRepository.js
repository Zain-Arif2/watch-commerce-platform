import Review from '../models/Review.js'
import BaseRepository from './BaseRepository.js'

class ReviewRepository extends BaseRepository {
  constructor() {
    super(Review)
  }

  async findByProduct(productId) {
    return await this.model
      .find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
  }
}

export default new ReviewRepository()
