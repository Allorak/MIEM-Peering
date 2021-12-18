import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IStudentWork, IWorkItem } from '../types';


export interface IWorksState {
  isWorkListLoading: boolean,
  isWorkListLock: boolean,
  isStudentWorkLoading: boolean,
  isStudentWorkLock: boolean,
  error: IError | undefined,
  workList: IWorkItem[] | undefined,
  studentWork: IStudentWork | undefined
}

const initialState: IWorksState = {
  isWorkListLoading: false,
  isStudentWorkLoading: false,
  error: undefined,
  isWorkListLock: true,
  isStudentWorkLock: true,
  studentWork: undefined,
  workList: undefined
};

export const works = createSlice({
  name: 'teacherWorks',
  initialState,
  reducers: {
    fetchWorkListStarted: (state) => {
      state.isWorkListLoading = true
      state.isWorkListLock = true
      state.error = undefined
      state.workList = undefined
    },

    fetchWorkListSuccess: (state, { payload }: PayloadAction<Array<IWorkItem>>) => {
      state.isWorkListLoading = false
      state.error = undefined
      state.isWorkListLock = false
      state.workList = payload
    },

    fetchStudentWorkStarted: (state) => {
      state.isStudentWorkLoading = true
      state.isStudentWorkLock = true
      state.error = undefined
      state.studentWork = undefined
    },

    fetchStudentWorkSuccess: (state, { payload }: PayloadAction<IStudentWork>) => {
      state.isStudentWorkLoading = false
      state.error = undefined
      state.isStudentWorkLock = false
      state.studentWork = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isWorkListLoading = false
      state.error = payload
      state.isWorkListLock = false
    },

    reset: (state) => {
      state.isWorkListLoading = false
      state.isStudentWorkLoading = false
      state.error = undefined
      state.isWorkListLock = true
      state.isStudentWorkLock = true
      state.workList = undefined
    },
  },
});

export const actions = works.actions

export const reducer = works.reducer
