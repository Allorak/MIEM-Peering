import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError } from '../types';


export interface INewCourseState {
  isLoading: boolean,
  error: IError | undefined,
  joinStatus: boolean | undefined,
  deleteStatus: boolean | undefined
}

const initialState: INewCourseState = {
  isLoading: false,
  error: undefined,
  joinStatus: undefined,
  deleteStatus: undefined
};

export const joinCourseSlice = createSlice({
  name: 'joinCourseSlice',
  initialState,
  reducers: {
    joinCourseStarted: (state) => {
      state.isLoading = true
      state.error = undefined
    },

    courseJoinSuccess: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = false
      state.joinStatus = payload
    },

    courseJoinFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
    },

    courseSetInitialState: (state) => {
      state.isLoading =  false
      state.error = undefined
      state.joinStatus = undefined
      state.deleteStatus = undefined
    },

    courseDeleteSuccess: (state) => {
      state.isLoading = false
      state.deleteStatus = true
    }
  },
});

export const actions = joinCourseSlice.actions

export const reducer = joinCourseSlice.reducer
