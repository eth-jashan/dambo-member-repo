import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    address: null,
  },
  reducers: {
    setAddress: (state, action) => {
      console.log('setAddress')
      state.address = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAddress } = authSlice.actions
export const selectAddress = state => state.auth.address;

export default authSlice.reducer