import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
} from "../features/products/productsApiSlice";
import { Heart, ShoppingCart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import { useAddToWishlistMutation } from "../features/wishlist/wishlistApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../features/cart/cartSlice";
import { setWishlist } from "../features/wishlist/wishlistSlice";
import toast from "react-hot-toast";
import ProductReviews from "../components/ProductReviews";
import { optimizeImageUrl } from "../utils/imageUrl";
import Seo from "../components/Seo";
import { SITE_URL } from "../config/site";

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { data, isLoading } = useGetProductBySlugQuery(slug);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const guestCartItems = useSelector((state) => state.cart.items);
  const guestWishlistProducts = useSelector((state) => state.wishlist.products);
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: addingToWishlist }] = useAddToWishlistMutation();

  const { product, reviews = [] } = data?.data || {};
  const relatedParams = product?.brand?._id
    ? { brand: product.brand._id, limit: 5 }
    : { limit: 5 };
  const { data: relatedProductsData, isLoading: relatedLoading } = useGetProductsQuery(
    relatedParams,
    { skip: !product }
  );

  const relatedProducts = (relatedProductsData?.data?.products || [])
    .filter((item) => item._id !== product?._id)
    .slice(0, 4);

  const updateGuestCart = (productData, qty) => {
    const existingItem = guestCartItems.find(
      (item) => item.product?._id === productData._id
    );
    const updatedItems = existingItem
      ? guestCartItems.map((item) =>
          item.product?._id === productData._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      : [
          ...guestCartItems,
          { _id: `guest-cart-${productData._id}`, product: productData, quantity: qty },
        ];

    localStorage.setItem("guest_cart_items", JSON.stringify(updatedItems));
    dispatch(setCart({ items: updatedItems }));
  };

  const handleAddToCart = async () => {
    if (!product) return false;

    if (!isAuthenticated) {
      updateGuestCart(product, quantity);
      toast.success("Product added to cart!");
      return true;
    }

    try {
      await addToCart({ productId: product._id, quantity }).unwrap();
      toast.success("Product added to cart!");
      return true;
    } catch (error) {
      const message = error?.data?.message || "Failed to add to cart";
      toast.error(message);
      return false;
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const added = await handleAddToCart();
    if (added) {
      navigate("/cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      const alreadyExists = guestWishlistProducts.some((item) => item._id === product._id);
      if (alreadyExists) {
        toast("Product already in wishlist");
        return;
      }

      const updatedProducts = [...guestWishlistProducts, product];
      localStorage.setItem("guest_wishlist_products", JSON.stringify(updatedProducts));
      dispatch(setWishlist({ products: updatedProducts }));
      toast.success("Product added to wishlist!");
      return;
    }

    try {
      await addToWishlist({ productId: product._id }).unwrap();
      toast.success("Product added to wishlist!");
    } catch (error) {
      const message = error?.data?.message || "Failed to add to wishlist";
      toast.error(message);
    }
  };

  const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQty = () => setQuantity((prev) => Math.min(10, prev + 1));
  const handleQtyInput = (event) => {
    const raw = Number(event.target.value);
    if (Number.isNaN(raw)) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.max(1, Math.min(10, raw)));
  };

  if (isLoading) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a6813f]"></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-serif text-[#0b0b0c] mb-4">
            Product Not Found
          </h1>
          <p className="text-[#0b0b0c]/60">
            The product you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Seo
        title={product.name}
        description={product.description?.slice(0, 155)}
        path={`/product/${product.slug}`}
        image={product.images?.[0]?.url}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images?.map((img) => img.url),
          brand: product.brand?.name,
          offers: {
            '@type': 'Offer',
            price: product.discountPrice || product.price,
            priceCurrency: 'USD',
            availability: product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/product/${product.slug}`,
          },
        }}
      />
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* IMAGE SECTION */}
          <div className="aspect-square bg-white border border-[#c8a45c]/20 overflow-hidden">
            {product.images?.[0] && (
              <img
                src={optimizeImageUrl(product.images[0].url, { width: 800 })}
                alt={product.name}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={800}
                height={800}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            )}
          </div>

          {/* DETAILS */}
          <div>

            {/* Brand */}
            <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-4">
              {product.brand?.name}
            </p>

            {/* Name */}
            <h1 className="text-5xl font-serif mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-3xl font-semibold text-[#0b0b0c]">
                ${product.discountPrice || product.price}
              </p>
              {product.numReviews > 0 && (
                <p className="text-sm text-[#0b0b0c]/50">
                  {product.rating?.toFixed(1)} ★ ({product.numReviews} reviews)
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-[#0b0b0c]/60 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#c8a45c]/20 mb-10" />

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm tracking-widest text-[#0b0b0c]/60 mb-3">QUANTITY</p>
              <div className="inline-flex items-center border border-[#c8a45c]/30 bg-white">
                <button
                  type="button"
                  onClick={decreaseQty}
                  className="px-4 py-2 text-xl text-[#0b0b0c]/70 hover:text-[#a6813f]"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={handleQtyInput}
                  className="w-16 text-center py-2 outline-none"
                />
                <button
                  type="button"
                  onClick={increaseQty}
                  className="px-4 py-2 text-xl text-[#0b0b0c]/70 hover:text-[#a6813f]"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-4">

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 min-w-[180px] bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white py-4 flex items-center justify-center gap-3 tracking-wide disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {addingToCart ? "ADDING..." : "ADD TO CART"}
              </button>

              {/* Buy It Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="flex-1 min-w-[180px] bg-[#a6813f] hover:bg-[#0b0b0c] transition-all duration-300 text-white py-4 tracking-wide disabled:opacity-50"
              >
                BUY IT NOW
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                className="px-5 py-4 border border-[#c8a45c]/30 hover:border-[#a6813f] transition-all duration-300 bg-white disabled:opacity-50"
              >
                <Heart size={20} />
              </button>

            </div>

          </div>
        </div>

        {/* Related Products */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-4">
              YOU MAY LIKE
            </p>
            <h2 className="text-4xl font-serif">Related Products</h2>
          </div>

          {relatedLoading ? (
            <div className="text-center text-[#0b0b0c]/50">Loading related products...</div>
          ) : relatedProducts.length === 0 ? (
            <div className="text-center text-[#0b0b0c]/50">
              Related products are not available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          )}
        </section>

        <ProductReviews productId={product._id} initialReviews={reviews} />
      </div>
    </main>
    </>
  );
};

export default Product;