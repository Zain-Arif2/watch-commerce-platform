class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id, options = {}) {
    return await this.model.findById(id, options.projection || '', options);
  }

  async findOne(filter, options = {}) {
    return await this.model.findOne(filter, options.projection || '', options);
  }

  async find(filter = {}, options = {}) {
    const query = this.model.find(filter, options.projection || '');
    
    if (options.sort) query.sort(options.sort);
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    
    return await query;
  }

  async findByIdAndUpdate(id, data, options = {}) {
    return await this.model.findByIdAndUpdate(id, data, { new: true, ...options });
  }

  async findByIdAndDelete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async countDocuments(filter = {}) {
    return await this.model.countDocuments(filter);
  }
}

export default BaseRepository;
