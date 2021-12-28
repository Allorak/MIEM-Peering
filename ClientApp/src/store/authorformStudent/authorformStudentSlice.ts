import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IAuthorForm } from '../types';


export interface IAuthorformState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  authorform: IAuthorForm | undefined
}

const initialState: IAuthorformState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  authorform: undefined 
};

export const authorform = createSlice({
  name: 'authorform',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },
    fetchSuccess: (state, { payload }: PayloadAction<IAuthorForm>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.authorform = JSON.parse(JSON.stringify(payload))
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
      state.authorform = {} as IAuthorForm
    }
  },
});

export const actions = authorform.actions

export const reducer = authorform.reducer
