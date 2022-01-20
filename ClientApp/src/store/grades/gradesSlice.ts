import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IError, IGrades } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  error: IError | undefined,
  payload: Array<IGrades> | undefined
}

const initialState: ICoursesState = {
  isLoading: false,
  error: undefined,
  payload: undefined
};

export const experts = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.error = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<Array<IGrades>>) => {
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
