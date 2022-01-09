import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, ITaskItem, INewTaskResponse, ITasks } from '../types';


export interface ITaskState {
  isLoading: boolean,
  isLock: boolean,
  error: IError | undefined,
  payload: ITasks | undefined,
  newTaskPayload: INewTaskResponse | undefined,
  hasConfidenceFactor: boolean | undefined
}

const initialState: ITaskState = {
  isLoading: false,
  error: undefined,
  isLock: true,
  payload: undefined,
  newTaskPayload: undefined,
  hasConfidenceFactor: undefined
};

export const tasks = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },

    fetchTaskStepStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },

    fetchTaskStepSuccess: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.hasConfidenceFactor = payload
    },

    fetchSuccess: (state, { payload }: PayloadAction<ITasks>) => {
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
    createReset: (state) => {
      state.isLoading = false
      state.isLock = false
      state.error = undefined
      state.newTaskPayload = undefined
      state.hasConfidenceFactor = undefined
    },
    createStarted: (state) => {
      state.isLoading = true
      state.isLock = true
      state.error = undefined
    },
    createSuccess:  (state, { payload }: PayloadAction<INewTaskResponse>) => {
      state.isLoading = false
      state.error = undefined
      state.isLock = false
      state.newTaskPayload = payload
    },
    createError: (state, { payload }: PayloadAction<IError>) => {
      state.isLoading = false
      state.error = payload
      state.isLock = false
    },
  },
});

export const actions = tasks.actions

export const reducer = tasks.reducer
