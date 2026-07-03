import { apiSlice } from '../api/apiSlice'

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId) => `/reviews/product/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Review', id: productId }],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId },
        'Product',
      ],
    }),
  }),
})

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} = reviewsApiSlice
