import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { lazy } from 'react'
import { motion } from 'framer-motion'
import { useAddToCartMutation } from '../features/cart/cartApiSlice'
import { useAddToWishlistMutation } from '../features/wishlist/wishlistApiSlice'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../features/cart/cartSlice'
import { setWishlist } from '../features/wishlist/wishlistSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const guestCartItems = useSelector((state) => state.cart.items)
  const guestWishlistProducts = useSelector((state) => state.wishlist.products)
  const [addToCart, { isLoading: cartLoading }] = useAddToCartMutation()
  const [addToWishlist, { isLoading: wishlistLoading }] = useAddToWishlistMutation()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      const existingItem = guestCartItems.find((item) => item.product?._id === product._id)
      const updatedItems = existingItem
        ? guestCartItems.map((item) =>
            item.product?._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...guestCartItems, { _id: `guest-cart-${product._id}`, product, quantity: 1 }]

      localStorage.setItem('guest_cart_items', JSON.stringify(updatedItems))
      dispatch(setCart({ items: updatedItems }))
      toast.success('Product added to cart!')
      return
    }

    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap()
      toast.success('Product added to cart!')
    } catch (error) {
      const message = error?.data?.message || 'Failed to add to cart'
      toast.error(message)
      console.error('Failed to add to cart:', error)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      const alreadyExists = guestWishlistProducts.some((item) => item._id === product._id)
      if (alreadyExists) {
        toast('Product already in wishlist')
        return
      }

      const updatedProducts = [...guestWishlistProducts, product]
      localStorage.setItem('guest_wishlist_products', JSON.stringify(updatedProducts))
      dispatch(setWishlist({ products: updatedProducts }))
      toast.success('Product added to wishlist!')
      return
    }

    try {
      await addToWishlist({ productId: product._id }).unwrap()
      toast.success('Product added to wishlist!')
    } catch (error) {
      const message = error?.data?.message || 'Failed to add to wishlist'
      toast.error(message)
      console.error('Failed to add to wishlist:', error)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative bg-neutral-gray aspect-square overflow-hidden mb-4">
          {product.images?.[0] && (
           <img
  src={product.images[0].url}
  alt={product.name}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
/>
          )}
          {product.isNewArrival && (
            <span className="absolute top-4 left-4 bg-accent text-primary text-xs font-bold px-3 py-1">
              NEW
            </span>
          )}
          {product.isLimitedEdition && (
            <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1">
              LIMITED
            </span>
          )}
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-primary disabled:opacity-50"
          >
            <Heart size={18} />
          </button>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand?.name}</p>
          <h3 className="font-semibold text-primary mb-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ${product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        disabled={cartLoading}
        className="w-full px-4 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-dark-gray transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShoppingCart size={16} />
        {cartLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </motion.div>
  )
}

export default ProductCard
