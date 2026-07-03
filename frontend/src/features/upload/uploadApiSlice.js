import { apiSlice } from '../api/apiSlice'

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const { useUploadImagesMutation } = uploadApiSlice
