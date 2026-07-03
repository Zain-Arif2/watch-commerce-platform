import User from '../models/User.js';
import BaseRepository from './BaseRepository.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

async findByEmail(email) {
  return await this.model.findOne({ email }).select("+password");
  }
}

export default new UserRepository();
