import express from 'express'
import {
  createCheckoutSession,
  stripeWebhook,
  verifyCheckoutSession,
} from '../controllers/paymentController.js'
import { optionalAuth } from '../middleware/optionalAuth.js'

const router = express.Router()

router.post('/create-checkout-session', optionalAuth, createCheckoutSession)
router.get('/verify-session', verifyCheckoutSession)

export { stripeWebhook }
export default router
