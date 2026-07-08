import Otp from '../models/Otp.js';

class OtpRepository {
  async create(data) {
    return await Otp.create(data);
  }

  async findByEmail(email) {
    return await Otp.findOne({ email });
  }

  async deleteByEmail(email) {
    return await Otp.deleteMany({ email });
  }
}

export default new OtpRepository();