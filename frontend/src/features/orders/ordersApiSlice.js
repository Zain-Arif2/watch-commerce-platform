import { apiSlice } from '../api/apiSlice'

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: ['Order'],
    }),
    getAdminOrders: builder.query({
      query: () => '/orders/admin',
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/admin/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useGetMyOrdersQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApiSlice
