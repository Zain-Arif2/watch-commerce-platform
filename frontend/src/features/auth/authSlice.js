import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      try {
        localStorage.setItem('auth_session', '1')
      } catch {
        // ignore storage errors
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      try {
        localStorage.removeItem('auth_session')
      } catch {
        // ignore storage errors
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions

export default authSlice.reducer
