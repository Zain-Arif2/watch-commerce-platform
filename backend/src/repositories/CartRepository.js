import Cart from '../models/Cart.js';
import BaseRepository from './BaseRepository.js';

class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }

  async findByUser(userId) {
    return await this.model.findOne({ user: userId }).populate('items.product');
  }
}

export default new CartRepository();
