import ProductService from '../services/ProductService.js'
import Review from '../models/Review.js'

export const getProducts = async (req, res) => {
  try {
    const result = await ProductService.getProducts(req.query, {
      page: req.query.page,
      limit: req.query.limit,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    })
  }
}

export const getHomeFeed = async (req, res) => {
  try {
    const limit = req.query.limit || 4
    const data = await ProductService.getHomeFeed(limit)

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch home feed',
      error: error.message,
    })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    })
  }
}

export const getProductBySlug = async (req, res) => {
  try {
    const product = await ProductService.getProductBySlug(req.params.slug)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const reviews = await Review.find({ product: product._id }).populate(
      'user',
      'name'
    )

    res.json({
      success: true,
      data: {
        product,
        reviews,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    })
  }
}

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      images,
      stock,
      isFeatured,
      isNewArrival,
      isLimitedEdition,
    } = req.body

    if (!name || !description || !price || !brand || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, brand, and category are required',
      })
    }

    if (!images?.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required',
      })
    }

    const product = await ProductService.createProduct({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      brand,
      category,
      images,
      stock: Number(stock) || 0,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isLimitedEdition: Boolean(isLimitedEdition),
    })

    res.status(201).json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body)

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    const status = error.message === 'Product not found' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to update product',
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id)

    res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    const status = error.message === 'Product not found' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to delete product',
    })
  }
}
