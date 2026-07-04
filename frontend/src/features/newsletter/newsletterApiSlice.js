import { apiSlice } from '../api/apiSlice'

export const newsletterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
})

export const { useSubscribeNewsletterMutation } = newsletterApiSlice