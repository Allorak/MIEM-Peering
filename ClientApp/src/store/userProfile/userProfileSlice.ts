import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUserProfile, IError } from '../types';


export interface IUserProfileState {
  isLoading: boolean,
  error: IError | undefined,
  payload: IUserProfile | undefined
}

const initialState: IUserProfileState = {
  isLoading: false,
  error: undefined,
  payload: undefined
};

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    userProfileStarted: (state) => {
      state.isLoading = true
      state.error = undefined
    },

    userProfileSuccess: (state, { payload }: PayloadAction<IUserProfile>) => {
      state.isLoading = false
      state.payload = payload
    },

    userProfileFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
      state.payload = undefined
    },

    userProfileRemove: (state) => {
      state.isLoading = false
      state.error = undefined
      state.payload = undefined
    }
  },
});

export const actions = userProfileSlice.actions

export const reducer = userProfileSlice.reducer
