import Wishlist from '../models/Wishlist.js';
import BaseRepository from './BaseRepository.js';

class WishlistRepository extends BaseRepository {
  constructor() {
    super(Wishlist);
  }

  async findByUser(userId) {
    return await this.model.findOne({ user: userId }).populate('products');
  }
}

export default new WishlistRepository();
