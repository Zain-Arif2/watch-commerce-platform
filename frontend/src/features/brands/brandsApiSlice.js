import { apiSlice } from '../api/apiSlice'

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => '/brands',
      providesTags: ['Brand'],
    }),
    getBrandBySlug: builder.query({
      query: (slug) => `/brands/slug/${slug}`,
      providesTags: ['Brand'],
    }),
  }),
})

export const { useGetBrandsQuery, useGetBrandBySlugQuery } = brandsApiSlice
