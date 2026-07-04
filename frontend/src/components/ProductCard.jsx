import React, { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { useAddToCartMutation } from '../features/cart/cartApiSlice'
import { useAddToWishlistMutation } from '../features/wishlist/wishlistApiSlice'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../features/cart/cartSlice'
import { setWishlist } from '../features/wishlist/wishlistSlice'
import { optimizeImageUrl } from '../utils/imageUrl'

const ProductCard = memo(({ product, priority = false }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const guestCartItems = useSelector((state) => state.cart.items)
  const guestWishlistProducts = useSelector((state) => state.wishlist.products)
  const [addToCart, { isLoading: cartLoading }] = useAddToCartMutation()
  const [addToWishlist, { isLoading: wishlistLoading }] = useAddToWishlistMutation()

  const handleAddToCart = useCallback(async (e) => {
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
    }
  }, [addToCart, dispatch, guestCartItems, isAuthenticated, product])

  const handleAddToWishlist = useCallback(async (e) => {
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
    }
  }, [addToWishlist, dispatch, guestWishlistProducts, isAuthenticated, product])

  const imageUrl = optimizeImageUrl(product.images?.[0]?.url, { width: 400 })

  return (
    <div className="group transition-transform duration-300 hover:-translate-y-2">
      <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <div className="relative bg-neutral-gray aspect-square overflow-hidden mb-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={product.name}
              loading={priority ? 'eager' : 'lazy'}
              fetchpriority={priority ? 'high' : 'auto'}
              decoding="async"
              width={400}
              height={400}
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
            type="button"
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            aria-label={`Add ${product.name} to wishlist`}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-primary disabled:opacity-50"
          >
            <Heart size={18} aria-hidden="true" />
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
        type="button"
        onClick={handleAddToCart}
        disabled={cartLoading}
        className="w-full px-4 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-dark-gray transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShoppingCart size={16} aria-hidden="true" />
        {cartLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
