import Order from '../models/Order.js'
import BaseRepository from './BaseRepository.js'

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order)
  }

  async findAllPopulated(filter = {}, options = {}) {
    const query = this.model
      .find(filter)
      .populate('user', 'name email role')
      .populate('orderItems.product', 'name slug price images')
      .sort(options.sort || { createdAt: -1 })

    if (options.limit) {
      query.limit(options.limit)
    }

    return await query
  }
}

export default new OrderRepository()
