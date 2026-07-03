import cloudinary from '../config/cloudinary.js'

const PRODUCT_FOLDER = 'chronolux/products'

class CloudinaryService {
  uploadImage(buffer, folder = PRODUCT_FOLDER) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          })
        }
      )

      stream.end(buffer)
    })
  }

  async uploadImages(files) {
    return Promise.all(files.map((file) => this.uploadImage(file.buffer)))
  }

  isCloudinaryImage(image) {
    return Boolean(
      image?.public_id &&
        (image.url?.includes('res.cloudinary.com') ||
          image.public_id.startsWith(`${PRODUCT_FOLDER}/`))
    )
  }

  async deleteImage(publicId) {
    if (!publicId) return
    await cloudinary.uploader.destroy(publicId)
  }

  async deleteImages(images = []) {
    const cloudinaryImages = images.filter((image) => this.isCloudinaryImage(image))

    await Promise.all(
      cloudinaryImages.map((image) => this.deleteImage(image.public_id))
    )
  }
}

export default new CloudinaryService()
