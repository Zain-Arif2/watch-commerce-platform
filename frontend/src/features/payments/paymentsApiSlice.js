import { apiSlice } from '../api/apiSlice'

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: '/payments/create-checkout-session',
        method: 'POST',
        body: data,
      }),
    }),
    verifyCheckoutSession: builder.query({
      query: (sessionId) => `/payments/verify-session?sessionId=${sessionId}`,
    }),
  }),
})

export const {
  useCreateCheckoutSessionMutation,
  useVerifyCheckoutSessionQuery,
} = paymentsApiSlice
