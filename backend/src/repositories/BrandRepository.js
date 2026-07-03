import Brand from '../models/Brand.js';
import BaseRepository from './BaseRepository.js';

class BrandRepository extends BaseRepository {
  constructor() {
    super(Brand);
  }
}

export default new BrandRepository();
