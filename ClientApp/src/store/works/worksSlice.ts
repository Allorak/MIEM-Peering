import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IStudentWork, IWorks, IWorkStatistics } from '../types';


export interface IWorksState {
  isWorkListLoading: boolean,
  isWorkStatisticsLoading: boolean,
  isWorkListLock: boolean,
  isStudentWorkLoading: boolean,
  isStudentWorkLock: boolean,
  error: IError | undefined,
  workList: IWorks | undefined,
  studentWork: IStudentWork | undefined
  workStatistics: IWorkStatistics | undefined,
  
}

const initialState: IWorksState = {
  isWorkListLoading: false,
  isWorkStatisticsLoading: false,
  isStudentWorkLoading: false,
  error: undefined,
  isWorkListLock: true,
  isStudentWorkLock: true,
  studentWork: undefined,
  workList: undefined,
  workStatistics: undefined
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

    fetchWorkStatisticsStarted: (state) => {
      state.isWorkStatisticsLoading = true
      state.error = undefined
      state.workStatistics = undefined
    },

    fetchWorkListSuccess: (state, { payload }: PayloadAction<IWorks>) => {
      state.isWorkListLoading = false
      state.error = undefined
      state.isWorkListLock = false
      state.workList = payload
    },

    fetchWorkStatisticsSuccess: (state, { payload }: PayloadAction<IWorkStatistics>) => {
      state.isWorkStatisticsLoading = false
      state.error = undefined
      state.workStatistics = payload
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
      state.isWorkStatisticsLoading = false
      state.workStatistics = undefined
    },
  },
});

export const actions = works.actions

export const reducer = works.reducer
