import UserRepository from '../repositories/UserRepository.js';
import OtpRepository from '../repositories/OtpRepository.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import sendEmail from '../config/sendEmail.js';
import bcrypt from 'bcryptjs';

const OTP_EXPIRY_MINUTES = 10;

class UserService {
  constructor() {
    this.userRepository = UserRepository;
    this.otpRepository = OtpRepository;
  }

  async registerUser(data) {
    const user = await this.userRepository.create(data);
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, products: [] });
    return user;
  }

  // Step 1: generate + email an OTP. Does NOT create the user yet.
  async sendRegistrationOtp({ name, email, password }) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const err = new Error('User already exists');
      err.code = 11000;
      throw err;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // remove any previous unused OTP for this email before creating a fresh one
    await this.otpRepository.deleteByEmail(email);
    await this.otpRepository.create({ email, otp: hashedOtp, expiresAt });

    // Fire-and-forget: don't make the user wait for the SMTP round-trip.
    // Errors are logged, not thrown, so a slow/failed email doesn't fail the request.
    sendEmail({
      to: email,
      subject: 'Verify your email - CHRONOLUX',
      html: `
        <p>Hi ${name},</p>
        <p>Your CHRONOLUX verification code is:</p>
        <h2 style="letter-spacing: 4px;">${otp}</h2>
        <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
      `,
    }).catch((err) => console.error('Failed to send OTP email:', err.message));
  }

  // Step 2: verify OTP, and only then actually create the user.
  async verifyOtpAndRegister({ name, email, password, otp }) {
    const record = await this.otpRepository.findByEmail(email);
    if (!record) {
      throw new Error('OTP not found. Please request a new one.');
    }

    if (record.expiresAt < new Date()) {
      await this.otpRepository.deleteByEmail(email);
      throw new Error('OTP has expired. Please request a new one.');
    }

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      throw new Error('Invalid OTP');
    }

    await this.otpRepository.deleteByEmail(email);

    return await this.registerUser({ name, email, password });
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