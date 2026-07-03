import express from 'express'
import { getCustomers } from '../controllers/userController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/admin/customers', protect, authorize('admin'), getCustomers)

export default router
