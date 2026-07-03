import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  loading: false,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.products = action.payload.products
    },
  },
})

export const { setWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
