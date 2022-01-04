import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IMyWorkForm } from '../types';


export interface IMyWorkState {
  isLoading: boolean,
  error: IError | undefined,
  payload: IMyWorkForm | undefined
}

const initialState: IMyWorkState = {
  isLoading: false,
  error: undefined,
  payload: undefined,
};

export const myWork = createSlice({
  name: 'myWork',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.error = undefined
      state.payload = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<IMyWorkForm>) => {
      state.isLoading = false
      state.error = undefined
      state.payload = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
    },
  },
});

export const actions = myWork.actions
export const reducer = myWork.reducer