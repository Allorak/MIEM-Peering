import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IError, IExpertItem } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  error: IError | undefined,
  payload: Array<IExpertItem> | undefined
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

    fetchSuccess: (state, { payload }: PayloadAction<Array<IExpertItem>>) => {
      state.isLoading = false
      state.error = undefined
      state.payload = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
      state.payload = undefined
    }
  },
});

export const actions = experts.actions

export const reducer = experts.reducer
