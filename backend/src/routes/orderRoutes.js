import express from 'express'
import { getAdminOrders, getMyOrders } from '../controllers/orderController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/my-orders', protect, getMyOrders)
router.get('/admin', protect, authorize('admin'), getAdminOrders)

export default router
