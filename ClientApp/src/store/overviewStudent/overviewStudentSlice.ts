import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IOverviewStudent } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  payload: IOverviewStudent
}

const initialState: ICoursesState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  payload: {} as IOverviewStudent
};

export const overview = createSlice({
  name: 'overview',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<IOverviewStudent>) => {
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
    reset: (state) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = true
      state.payload = {} as IOverviewStudent
    }
  },
});

export const actions = overview.actions

export const reducer = overview.reducer
