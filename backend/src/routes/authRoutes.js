import express from 'express';
import {
  register,
  sendRegisterOtp,
  verifyOtpAndRegister,
  login,
  logout,
  getMe,
  refreshToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register); // kept for backward compatibility
router.post('/send-otp', sendRegisterOtp);
router.post('/verify-otp', verifyOtpAndRegister);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh-token', refreshToken);

export default router;