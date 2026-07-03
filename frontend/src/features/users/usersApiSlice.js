import { apiSlice } from '../api/apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => '/users/admin/customers',
      providesTags: ['User'],
    }),
  }),
})

export const { useGetCustomersQuery } = usersApiSlice
