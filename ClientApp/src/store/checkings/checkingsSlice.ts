import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, ICatalog } from '../types';


export interface ICoursesState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  studentList: ICatalog[] | undefined,

}

const initialState: ICoursesState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  studentList: undefined,
};

export const checkings = createSlice({
  name: 'checkings',
  initialState,
  reducers: {
    fetchStudentListStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },

    fetchStudentListSuccess: (state, { payload }: PayloadAction<Array<ICatalog>>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.studentList = JSON.parse(JSON.stringify(payload))
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
      state.isLock = false
    },
  },
});

export const actions = checkings.actions

export const reducer = checkings.reducer
