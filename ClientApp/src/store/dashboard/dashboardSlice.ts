import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IDashboardTaskProps } from '../types';


export interface IDashboardState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  payload: IDashboardTaskProps | undefined
}

const initialState: IDashboardState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  payload: undefined
};

export const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<IDashboardTaskProps>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.payload = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
      state.isLock = false
    },

    resetState: (state) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.payload = undefined
    }
  },
});

export const actions = dashboard.actions

export const reducer = dashboard.reducer
