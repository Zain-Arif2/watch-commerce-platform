import BrandRepository from '../repositories/BrandRepository.js';

class BrandService {
  constructor() {
    this.brandRepository = BrandRepository;
  }

  async getAllBrands() {
    return await this.brandRepository.find();
  }

  async getBrandBySlug(slug) {
    return await this.brandRepository.findOne({ slug });
  }
}

export default new BrandService();
