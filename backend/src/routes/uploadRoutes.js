import express from 'express'
import { uploadImages } from '../controllers/uploadController.js'
import upload from '../middleware/upload.js'
import { authorize, protect } from '../middleware/auth.js'

const router = express.Router()

const handleUpload = (req, res, next) => {
  upload.array('images', 5)(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Image upload failed',
      })
    }
    next()
  })
}

router.post('/', protect, authorize('admin'), handleUpload, uploadImages)

export default router
