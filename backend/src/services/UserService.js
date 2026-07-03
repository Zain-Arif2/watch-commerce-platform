import UserRepository from '../repositories/UserRepository.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';

class UserService {
  constructor() {
    this.userRepository = UserRepository;
  }

  async registerUser(data) {
    const user = await this.userRepository.create(data);
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, products: [] });
    return user;
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return null;
    return user;
  }

  async getCustomers() {
    return await this.userRepository.find({}, {
      projection: '-password -verificationToken -resetPasswordToken -resetPasswordExpire',
      sort: { createdAt: -1 },
    });
  }
}

export default new UserService();
