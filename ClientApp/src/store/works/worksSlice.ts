import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGAuthCheckUser, IError, ICourses, IWorkItem } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  payload: IWorkItem[] | undefined
}

const initialState: ICoursesState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  payload: undefined
};

export const works = createSlice({
  name: 'works',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
      state.payload = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<Array<IWorkItem>>) => {
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

    reset: (state) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = true
      state.payload = undefined
    },
  },
});

export const actions = works.actions

export const reducer = works.reducer
