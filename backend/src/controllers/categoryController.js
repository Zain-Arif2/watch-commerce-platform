import CategoryService from '../services/CategoryService.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await CategoryService.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
