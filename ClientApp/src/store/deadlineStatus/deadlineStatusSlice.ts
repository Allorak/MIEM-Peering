import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, DeadlineStatus } from '../types';


export interface IDeadlineStatusState {
  isLoading: boolean
  error: IError | undefined
  submissionStatus: DeadlineStatus | undefined
  reviewStatus: DeadlineStatus | undefined
}

const initialState: IDeadlineStatusState = {
  isLoading: false,
  submissionStatus: undefined,
  reviewStatus: undefined,
  error: undefined,
};

export const deadlineStatus = createSlice({
  name: 'deadlineStatus',
  initialState,
  reducers: {
    fetchSubmissionStatusStarted: (state) => {
      state.submissionStatus = undefined
      state.isLoading = true
      state.error = undefined
    },

    fetchReviewStatusStarted: (state) => {
      state.reviewStatus = undefined
      state.isLoading = true
      state.error = undefined
    },

    fetchSubmissionStatusSuccess: (state, { payload }: PayloadAction<DeadlineStatus>) => {
      state.isLoading = false
      state.error = undefined
      state.submissionStatus = payload
    },

    fetchReviewStatusSuccess: (state, { payload }: PayloadAction<DeadlineStatus>) => {
      state.isLoading = false
      state.error = undefined
      state.reviewStatus = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
    },

    reset: (state) => {
      state.isLoading = false
      state.submissionStatus = undefined
      state.reviewStatus = undefined
      state.error = undefined
    }
  },
});

export const actions = deadlineStatus.actions
export const reducer = deadlineStatus.reducer