import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError } from '../types';


export interface IRegState {
  isRegistered: boolean,
  isRegistering: boolean,
  error: IError | undefined,
  payload: boolean | undefined,
}

const initialState: IRegState = {
  isRegistered: false,
  isRegistering: false,
  error: undefined,
  payload: undefined,
};

export const registrationUserSlice = createSlice({
  name: 'registrationUser',
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

    resetReg: (state) => {
      state.isRegistering = false
      state.isRegistered = false
      state.payload = undefined
      state.error = undefined
    }
  },
});

export const actions = registrationUserSlice.actions

export const reducer = registrationUserSlice.reducer
