import CategoryRepository from '../repositories/CategoryRepository.js';

class CategoryService {
  constructor() {
    this.categoryRepository = CategoryRepository;
  }

  async getAllCategories() {
    return await this.categoryRepository.find();
  }

  async getCategoryBySlug(slug) {
    return await this.categoryRepository.findOne({ slug });
  }
}

export default new CategoryService();
