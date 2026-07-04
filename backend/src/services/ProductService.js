import ProductRepository from '../repositories/ProductRepository.js'
import CloudinaryService from './CloudinaryService.js'
import Product from '../models/Product.js'

class ProductService {
  constructor() {
    this.productRepository = ProductRepository
  }

  slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async getProducts(filters, options = {}) {
    const page = Number(options.page) || 1
    const limit = Number(options.limit) || 12
    const skip = (page - 1) * limit

    const result = await this.productRepository.findAllWithFilters(filters, {
      skip,
      limit,
    })

    return {
      ...result,
      page,
      pages: Math.ceil(result.total / limit),
    }
  }

  async getProductById(id) {
    return await Product.findById(id).populate('brand').populate('category')
  }

  async getProductBySlug(slug) {
    return await this.productRepository.findBySlug(slug)
  }

  async getHomeFeed(limit = 4) {
    const parsedLimit = Number(limit) || 4

    const [featured, newArrivals, limitedEdition] = await Promise.all([
      this.productRepository.findAllWithFilters({ isFeatured: 'true' }, { skip: 0, limit: parsedLimit }),
      this.productRepository.findAllWithFilters({ isNewArrival: 'true' }, { skip: 0, limit: parsedLimit }),
      this.productRepository.findAllWithFilters({ isLimitedEdition: 'true' }, { skip: 0, limit: parsedLimit }),
    ])

    return {
      featured: featured.products,
      newArrivals: newArrivals.products,
      limitedEdition: limitedEdition.products,
    }
  }

  async createProduct(data) {
    const slug = data.slug || this.slugify(`${data.name}-${Date.now()}`)

    return await this.productRepository.create({
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice,
      brand: data.brand,
      category: data.category,
      images: data.images || [],
      stock: data.stock,
      isFeatured: data.isFeatured || false,
      isNewArrival: data.isNewArrival || false,
      isLimitedEdition: data.isLimitedEdition || false,
    })
  }

  async updateProduct(id, data) {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new Error('Product not found')
    }

    const removedImages = product.images.filter(
      (existingImage) =>
        !data.images?.some((image) => image.public_id === existingImage.public_id)
    )

    await CloudinaryService.deleteImages(removedImages)

    product.name = data.name ?? product.name
    product.description = data.description ?? product.description
    product.price = data.price ?? product.price
    product.discountPrice = data.discountPrice ?? product.discountPrice
    product.brand = data.brand ?? product.brand
    product.category = data.category ?? product.category
    product.images = data.images ?? product.images
    product.stock = data.stock ?? product.stock
    product.isFeatured = data.isFeatured ?? product.isFeatured
    product.isNewArrival = data.isNewArrival ?? product.isNewArrival
    product.isLimitedEdition = data.isLimitedEdition ?? product.isLimitedEdition

    await product.save()

    return await Product.findById(id).populate('brand').populate('category')
  }

  async deleteProduct(id) {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new Error('Product not found')
    }

    await CloudinaryService.deleteImages(product.images)
    await this.productRepository.findByIdAndDelete(id)

    return product
  }
}

export default new ProductService()
