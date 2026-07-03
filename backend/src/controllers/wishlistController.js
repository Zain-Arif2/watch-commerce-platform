import WishlistService from '../services/WishlistService.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await WishlistService.getWishlist(req.user._id);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await WishlistService.addToWishlist(req.user._id, productId);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await WishlistService.removeFromWishlist(req.user._id, productId);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
