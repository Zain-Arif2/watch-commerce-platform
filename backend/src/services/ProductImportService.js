import Product from '../models/Product.js'
import Brand from '../models/Brand.js'
import Category from '../models/Category.js'

const WATCH_ENDPOINTS = [
  'https://dummyjson.com/products/category/mens-watches',
  'https://dummyjson.com/products/category/womens-watches',
]

const VARIANT_SUFFIXES = [
  'Classic Edition',
  'Sport Edition',
  'Heritage Edition',
  'Midnight Edition',
]

class ProductImportService {
  slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  formatCategoryName(category) {
    if (category === 'mens-watches') {
      return "Men's Watches"
    }

    if (category === 'womens-watches') {
      return "Women's Watches"
    }

    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  getDiscountPrice(price, discountPercentage = 0) {
    if (!discountPercentage) {
      return undefined
    }

    return Number((price - (price * discountPercentage) / 100).toFixed(2))
  }

  getCollectionFlags(products) {
    const featuredIds = new Set(
      [...products]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4)
        .map((product) => product.id)
    )

    const newArrivalIds = new Set(
      [...products]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4)
        .map((product) => product.id)
    )

    const limitedEditionIds = new Set(
      [...products]
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 4)
        .map((product) => product.id)
    )

    return { featuredIds, newArrivalIds, limitedEditionIds }
  }

  async fetchWatchProducts() {
    const responses = await Promise.all(
      WATCH_ENDPOINTS.map(async (url) => {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.status}`)
        }

        return response.json()
      })
    )

    return responses.flatMap((payload) => payload.products || [])
  }

  createVariantProducts(products) {
    return products.flatMap((product) => {
      const variants = VARIANT_SUFFIXES.map((suffix, index) => ({
        ...product,
        id: Number(`${product.id}${index + 1}`),
        title: `${product.title} ${suffix}`,
        description: `${product.description} This ${suffix.toLowerCase()} offers a fresh style variation for collectors.`,
        price: Number((Number(product.price) * (1 + (index + 1) * 0.08)).toFixed(2)),
        stock: Math.max(1, Number(product.stock || 0) + (index + 1) * 3),
        rating: Math.min(5, Number((Number(product.rating || 0) + index * 0.12).toFixed(2))),
        sku: `${product.sku || this.slugify(product.title).toUpperCase()}-V${index + 1}`,
      }))

      return [product, ...variants]
    })
  }

  buildProductDocument(product, brandMap, categoryMap, flags) {
    return {
      name: product.title,
      slug: this.slugify(`${product.brand}-${product.title}-${product.id}`),
      description: product.description,
      price: Number(product.price),
      discountPrice: this.getDiscountPrice(product.price, product.discountPercentage),
      brand: brandMap.get(product.brand)?._id,
      category: categoryMap.get(this.slugify(product.category))?._id,
      images: (product.images?.length ? product.images : [product.thumbnail])
        .filter(Boolean)
        .map((image, index) => ({
          public_id: `${product.id}-${index + 1}`,
          url: image,
        })),
      stock: Number(product.stock) || 0,
      isFeatured: flags.featuredIds.has(product.id),
      isNewArrival: flags.newArrivalIds.has(product.id),
      isLimitedEdition: flags.limitedEditionIds.has(product.id),
      rating: Number(product.rating) || 0,
      numReviews: product.reviews?.length || 0,
      specifications: {
        movement: product.tags?.join(', ') || 'Quartz',
        caseMaterial: product.brand || 'Stainless Steel',
        caseSize: product.dimensions?.width ? `${product.dimensions.width}mm` : undefined,
        strapMaterial: product.category === 'mens-watches' ? 'Leather / Steel Mix' : 'Luxury Strap',
        waterResistance: product.availabilityStatus || 'Standard',
        warranty: product.warrantyInformation,
        referenceNumber: product.sku,
      },
    }
  }

  async importDummyJsonWatches() {
    const remoteProducts = await this.fetchWatchProducts()
    const expandedProducts = this.createVariantProducts(remoteProducts)
    const flags = this.getCollectionFlags(expandedProducts)

    await Product.deleteMany()
    await Brand.deleteMany()
    await Category.deleteMany()

    const uniqueBrands = [...new Set(expandedProducts.map((product) => product.brand).filter(Boolean))]
    const brandDocs = await Brand.create(
      uniqueBrands.map((brand) => ({
        name: brand,
        slug: this.slugify(brand),
        description: `${brand} watch collection imported from DummyJSON.`,
      }))
    )

    const brandMap = new Map(brandDocs.map((brand) => [brand.name, brand]))

    const uniqueCategories = [...new Set(expandedProducts.map((product) => product.category).filter(Boolean))]
    const categoryDocs = await Category.create(
      uniqueCategories.map((category) => ({
        name: this.formatCategoryName(category),
        slug: this.slugify(category),
        description: `${this.formatCategoryName(category)} collection imported from DummyJSON.`,
      }))
    )

    const categoryMap = new Map(categoryDocs.map((category) => [category.slug, category]))

    const products = expandedProducts.map((product) =>
      this.buildProductDocument(product, brandMap, categoryMap, flags)
    )

    await Product.create(products)

    return {
      totalProducts: products.length,
      totalBrands: brandDocs.length,
      totalCategories: categoryDocs.length,
    }
  }
}

export default new ProductImportService()
