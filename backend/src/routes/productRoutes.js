import express from 'express'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '../controllers/productController.js'
import { authorize, protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/id/:id', getProductById)
router.get('/slug/:slug', getProductBySlug)

router.post('/', protect, authorize('admin'), createProduct)
router.put('/id/:id', protect, authorize('admin'), updateProduct)
router.delete('/id/:id', protect, authorize('admin'), deleteProduct)

export default router
