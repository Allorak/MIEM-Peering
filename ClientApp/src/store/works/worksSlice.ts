import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, IWorkItem } from '../types';


export interface IWorksState {
  isWorkListLoading: boolean,
  isWorkListLock: boolean,
  error: IError | undefined,
  workList: IWorkItem[] | undefined
}

const initialState: IWorksState = {
  isWorkListLoading: false,
  error: undefined,
  isWorkListLock: true,
  workList: undefined
};

export const works = createSlice({
  name: 'teacherWorks',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isWorkListLoading = true
      state.isWorkListLock = true
      state.error = undefined
      state.workList = undefined
    },

    fetchSuccess: (state, { payload }: PayloadAction<Array<IWorkItem>>) => {
      state.isWorkListLoading = false
      state.error = undefined
      state.isWorkListLock = false
      state.workList = payload
    },

    fetchFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isWorkListLoading = false
      state.error = payload
      state.isWorkListLock = false
    },

    reset: (state) => {
      state.isWorkListLoading = false
      state.error = undefined
      state.isWorkListLock = true
      state.workList = undefined
    },
  },
});

export const actions = works.actions

export const reducer = works.reducer
