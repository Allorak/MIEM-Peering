import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGoogleUserRegistered, IGoogleUserNew, IError } from '../types';


export interface IGAuthState {
  isAuthorized: boolean,
  isAuthorizing: boolean,
  error: IError | undefined,
  payload: IGoogleUserRegistered | IGoogleUserNew | undefined
}

const initialState: IGAuthState = {
  isAuthorized: false,
  isAuthorizing: false,
  error: undefined,
  payload: undefined
};

export const googleAuthSlice = createSlice({
  name: 'gAuthCheck',
  initialState,
  reducers: {
    authStarted: (state) => {
      state.isAuthorizing = true
      state.error = undefined
    },

    authSuccess: (state, { payload }: PayloadAction<IGoogleUserRegistered | IGoogleUserNew>) => {
      state.isAuthorizing = false
      state.isAuthorized = true
      state.error = undefined
      state.payload = payload
    },

    authFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isAuthorizing = false
      state.isAuthorized = false
      state.error = payload
    },
  },
});

export const actions = googleAuthSlice.actions

export const reducer = googleAuthSlice.reducer
