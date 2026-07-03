import CloudinaryService from '../services/CloudinaryService.js'

export const uploadImages = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      })
    }

    const images = await CloudinaryService.uploadImages(req.files)

    return res.json({
      success: true,
      data: { images },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images',
    })
  }
}
