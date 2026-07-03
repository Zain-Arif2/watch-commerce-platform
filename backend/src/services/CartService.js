import CartRepository from '../repositories/CartRepository.js';
import Product from '../models/Product.js';

class CartService {
  constructor() {
    this.cartRepository = CartRepository;
  }

  getCartItemProductId(item) {
    if (!item?.product) {
      return null;
    }

    if (item.product._id) {
      return item.product._id.toString();
    }

    return item.product.toString();
  }

  async sanitizeCart(cart) {
    if (!cart) {
      return cart;
    }

    const validItems = cart.items.filter((item) => this.getCartItemProductId(item));

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return cart;
  }

  async getCart(userId) {
    let cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      cart = await this.cartRepository.create({ user: userId, items: [] });
    } else {
      cart = await this.sanitizeCart(cart);
    }
    return cart;
  }

  async addToCart(userId, productId, quantity = 1) {
    let cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      cart = await this.cartRepository.create({ user: userId, items: [] });
    }

    cart = await this.sanitizeCart(cart);

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => this.getCartItemProductId(item) === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return await this.cartRepository.findByUser(userId);
  }

  async removeFromCart(userId, productId) {
    let cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart = await this.sanitizeCart(cart);
    cart.items = cart.items.filter((item) => this.getCartItemProductId(item) !== productId);
    await cart.save();
    return await this.cartRepository.findByUser(userId);
  }

  async updateCartItemQuantity(userId, productId, quantity) {
    let cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart = await this.sanitizeCart(cart);

    const itemIndex = cart.items.findIndex(
      (item) => this.getCartItemProductId(item) === productId
    );
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    if (quantity <= 0) {
      return await this.removeFromCart(userId, productId);
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return await this.cartRepository.findByUser(userId);
  }

  async clearCart(userId) {
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    cart.items = [];
    await cart.save();
    return cart;
  }
}

export default new CartService();
