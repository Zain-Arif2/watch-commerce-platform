import BrandService from '../services/BrandService.js';

export const getBrands = async (req, res) => {
  try {
    const brands = await BrandService.getAllBrands();
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandBySlug = async (req, res) => {
  try {
    const brand = await BrandService.getBrandBySlug(req.params.slug);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    res.json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
