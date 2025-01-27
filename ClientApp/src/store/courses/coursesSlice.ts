import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, ICourses } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  payload: Array<ICourses> | undefined
  updateStatus: boolean | undefined
}

const initialState: ICoursesState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  payload: undefined,
  updateStatus: undefined
};

export const courses = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<Array<ICourses>>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.payload = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
      state.isLock = false
    },
  },
});

export const actions = courses.actions

export const reducer = courses.reducer
