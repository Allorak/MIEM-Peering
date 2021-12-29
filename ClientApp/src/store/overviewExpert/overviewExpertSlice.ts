import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IOverviewExpert } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  payload: IOverviewExpert | undefined
}

const initialState: ICoursesState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  payload: undefined
};

export const overviewExpertSlice = createSlice({
  name: 'overviewExpert',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<IOverviewExpert>) => {
      console.log(payload, "!")
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
      state.payload = undefined
    }
  },
});

export const actions = overviewExpertSlice.actions

export const reducer = overviewExpertSlice.reducer
