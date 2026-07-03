import WishlistRepository from '../repositories/WishlistRepository.js';
import Product from '../models/Product.js';

class WishlistService {
  constructor() {
    this.wishlistRepository = WishlistRepository;
  }

  async getWishlist(userId) {
    let wishlist = await this.wishlistRepository.findByUser(userId);
    if (!wishlist) {
      wishlist = await this.wishlistRepository.create({ user: userId, products: [] });
    }
    return wishlist;
  }

  async addToWishlist(userId, productId) {
    let wishlist = await this.wishlistRepository.findByUser(userId);
    if (!wishlist) {
      wishlist = await this.wishlistRepository.create({ user: userId, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();
    return await this.wishlistRepository.findByUser(userId);
  }

  async removeFromWishlist(userId, productId) {
    const wishlist = await this.wishlistRepository.findByUser(userId);
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    return await this.wishlistRepository.findByUser(userId);
  }
}

export default new WishlistService();
