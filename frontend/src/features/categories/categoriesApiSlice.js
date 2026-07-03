import { apiSlice } from '../api/apiSlice'

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/slug/${slug}`,
      providesTags: ['Category'],
    }),
  }),
})

export const { useGetCategoriesQuery, useGetCategoryBySlugQuery } = categoriesApiSlice
