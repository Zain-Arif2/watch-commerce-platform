import Product from '../models/Product.js';
import BaseRepository from './BaseRepository.js';

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findAllWithFilters(filters, options = {}) {
    const query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.brand) {
      query.brand = filters.brand;
    }

    if (filters.keyword) {
      query.$or = [
        { name: { $regex: filters.keyword, $options: 'i' } },
        { description: { $regex: filters.keyword, $options: 'i' } },
      ];
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) {
        query.price.$gte = Number(filters.minPrice);
      }
      if (filters.maxPrice) {
        query.price.$lte = Number(filters.maxPrice);
      }
    }

    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured === 'true';
    }

    if (filters.isNewArrival !== undefined) {
      query.isNewArrival = filters.isNewArrival === 'true';
    }

    if (filters.isLimitedEdition !== undefined) {
      query.isLimitedEdition = filters.isLimitedEdition === 'true';
    }

    let sort = { createdAt: -1 };
    if (filters.sort === 'price-asc') {
      sort = { price: 1 };
    } else if (filters.sort === 'price-desc') {
      sort = { price: -1 };
    } else if (filters.sort === 'rating') {
      sort = { rating: -1 };
    }

    const products = await this.model
      .find(query)
      .populate('brand', 'name slug logo')
      .populate('category', 'name slug')
      .sort(sort)
      .skip(options.skip || 0)
      .limit(options.limit || 12);

    const total = await this.model.countDocuments(query);

    return { products, total };
  }

  async findBySlug(slug) {
    return await this.model
      .findOne({ slug })
      .populate('brand')
      .populate('category');
  }
}

export default new ProductRepository();
