import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, ICatalog, IStudentWork } from '../types';


export interface ICheckingsState {
  isListLoading: boolean,
  isListLock: boolean,
  isWorkLoading: boolean,
  isWorkLock: boolean,
  error: IError | undefined,
  studentList: ICatalog[] | undefined,
  studentWork: IStudentWork | undefined

}

const initialState: ICheckingsState = {
  isListLoading: false,
  isWorkLoading: false,
  error: undefined,
  isListLock: true,
  isWorkLock: true,
  studentList: undefined,
  studentWork: undefined
};

export const checkings = createSlice({
  name: 'checkings',
  initialState,
  reducers: {
    fetchStudentListStarted: (state) => {
      state.isListLoading = true
      state.isListLock = true
      state.error = undefined
    },

    fetchStudentWorkStarted: (state) => {
      state.isWorkLoading = true
      state.isWorkLock = true
      state.error = undefined
      state.studentWork = undefined
    },

    fetchStudentListSuccess: (state, { payload }: PayloadAction<Array<ICatalog>>) => {
      state.isListLoading = false
      state.error = undefined
      state.isListLock = false
      state.studentList = JSON.parse(JSON.stringify(payload))
    },

    fetchStudentWorkSuccess: (state, { payload }: PayloadAction<IStudentWork>) => {
      state.isWorkLoading = false
      state.error = undefined
      state.isWorkLock = false
      state.studentWork = JSON.parse(JSON.stringify(payload))
    },

    fetchListFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isListLoading = false
      state.error = payload
      state.isListLock = false
    },

    fetchWorkFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isWorkLoading = false
      state.error = payload
      state.isWorkLock = false
    },
  },
});

export const actions = checkings.actions

export const reducer = checkings.reducer
