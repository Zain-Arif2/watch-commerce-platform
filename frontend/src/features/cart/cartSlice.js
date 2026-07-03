import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { setCart, clearCart } = cartSlice.actions

export default cartSlice.reducer
