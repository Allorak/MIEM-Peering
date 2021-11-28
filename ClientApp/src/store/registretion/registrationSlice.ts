import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IRegistrationResponse, IError, IRegistretionProps } from '../types';


export interface IRegState {
  isRegistered: boolean,
  isRegistering: boolean,
  error: IError | undefined,
  payload: boolean | undefined,
  googleToken: string | undefined
}

const initialState: IRegState = {
  isRegistered: false,
  isRegistering: false,
  error: undefined,
  payload: undefined,
  googleToken: undefined
};

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    regStarted: (state) => {
      state.isRegistering = true
      state.error = undefined
    },

    regSuccess: (state, { payload }: PayloadAction<boolean>) => {
      state.isRegistering = false
      state.isRegistered = true
      state.payload = payload
    },

    regFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isRegistering = false
      state.isRegistered = false
      state.error = payload
    },

    setGoogleToken: (state, { payload }: PayloadAction<string>) => {
      state.error = undefined
      state.isRegistering = false
      state.isRegistered = false
      state.googleToken = payload
    }
  },
});

export const actions = registrationSlice.actions

export const reducer = registrationSlice.reducer
