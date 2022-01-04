import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IAuthorForm, ISubmissionStatus } from '../types';


export interface IAuthorformState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  authorFormPayload: IAuthorForm | undefined,
  submissionWorkStatus: ISubmissionStatus | undefined
}

const initialState: IAuthorformState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  authorFormPayload: undefined,
  submissionWorkStatus: undefined
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
    fetchSubmissionStatusStarted: (state) => {
      state.isLoading = true
      state.error = undefined
    },
    fetchAuthorFormSuccess: (state, { payload }: PayloadAction<IAuthorForm>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.authorFormPayload = JSON.parse(JSON.stringify(payload))
    },
    fetchSubmissionStatusSuccess: (state, { payload }: PayloadAction<ISubmissionStatus>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.submissionWorkStatus = payload
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
      state.authorFormPayload = {} as IAuthorForm
    },

  },
});

export const actions = authorform.actions

export const reducer = authorform.reducer
