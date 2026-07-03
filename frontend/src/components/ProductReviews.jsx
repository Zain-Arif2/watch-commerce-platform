import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  useCreateReviewMutation,
  useGetProductReviewsQuery,
} from '../features/reviews/reviewsApiSlice'

const StarRating = ({ rating, onRate, interactive = false, size = 16 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? 'fill-[#a6813f] text-[#a6813f]'
                : 'text-[#c8a45c]/30'
            }
          />
        </button>
      ))}
    </div>
  )
}

const ProductReviews = ({ productId, initialReviews = [] }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { data, isLoading } = useGetProductReviewsQuery(productId, { skip: !productId })
  const [createReview, { isLoading: submitting }] = useCreateReviewMutation()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const reviews = data?.data || initialReviews || []

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      toast.error('Please login to leave a review')
      navigate('/login')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment')
      return
    }

    try {
      await createReview({ productId, rating, comment }).unwrap()
      toast.success('Review submitted successfully')
      setComment('')
      setRating(5)
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit review')
    }
  }

  return (
    <section className="mt-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-4">
            CUSTOMER REVIEWS
          </p>
          <h2 className="text-4xl font-serif">What Clients Say</h2>
        </div>

        <div className="flex items-center gap-4">
          <StarRating rating={Math.round(averageRating)} size={20} />
          <p className="text-[#0b0b0c]/60">
            {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-6">
          {isLoading ? (
            <p className="text-[#0b0b0c]/50">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-[#c8a45c]/20 p-8 text-center text-[#0b0b0c]/60">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-[#c8a45c]/20 p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold">{review.user?.name || 'Customer'}</p>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p className="text-[#0b0b0c]/70 leading-relaxed">{review.comment}</p>
                <p className="text-xs text-[#0b0b0c]/40 mt-3">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border border-[#c8a45c]/20 p-8 h-fit">
          <h3 className="text-2xl font-serif mb-6">Write a Review</h3>

          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-sm text-[#0b0b0c]/60 mb-2">Your Rating</p>
                <StarRating rating={rating} onRate={setRating} interactive />
              </div>

              <div>
                <label className="text-sm text-[#0b0b0c]/60 mb-2 block">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={5}
                  placeholder="Share your experience with this timepiece..."
                  className="w-full border border-[#c8a45c]/30 px-4 py-3 outline-none focus:border-[#a6813f] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0b0b0c] hover:bg-[#a6813f] text-white py-3 tracking-wide transition-colors disabled:opacity-50"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-[#0b0b0c]/60 mb-6">
                Login to share your thoughts about this watch.
              </p>
              <Link
                to="/login"
                className="inline-block bg-[#0b0b0c] hover:bg-[#a6813f] text-white px-6 py-3 tracking-wide transition-colors"
              >
                LOGIN TO REVIEW
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductReviews
