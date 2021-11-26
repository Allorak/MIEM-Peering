import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IError, IExtpertItem } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  error: IError | undefined,
  payload: Array<IExtpertItem> | undefined
}

const initialState: ICoursesState = {
  isLoading: false,
  error: undefined,
  payload: undefined
};

export const experts = createSlice({
  name: 'experts',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.error = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<Array<IExtpertItem>>) => {
      state.isLoading = false
      state.error = undefined
      state.payload = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
      state.payload = undefined
    },
    deleteStarted: (state) => {
      state.isLoading = true
      state.error = undefined
    },
    deleteFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
    },
    deleteSuccess: (state) => {
      state.isLoading = false
      state.error = undefined
    },
  },
});

export const actions = experts.actions

export const reducer = experts.reducer
