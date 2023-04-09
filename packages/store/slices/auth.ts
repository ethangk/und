import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../reducers'
import { authApi } from '../services'

export interface AuthState {
  token?: string
}

const initialState: AuthState = {}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    resetToken: (state) => {
      state.token = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.me.matchRejected, (state, action) => {
        if (action.payload?.status === 401) {
          state.token = undefined
          localStorage.removeItem('access_token')
        }
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const access_token = action.payload.access_token
        localStorage.setItem('access_token', access_token)
        state.token = access_token
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        const access_token = action.payload.access_token
        localStorage.setItem('access_token', access_token)
        state.token = access_token
      })
  },
})

export const { setToken, resetToken } = authSlice.actions

export const authReducer = authSlice.reducer

export const getIsAuthorized = (state: RootState) => !!state.auth.token