import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError, ICatalog, IStudentWork, IPeerForm } from '../types';


export interface ICheckingsState {
  isListLoading: boolean,
  isListLock: boolean,
  isWorkLoading: boolean,
  isWorkLock: boolean,
  isPeerFormLoading: boolean,
  isPeerFormLock: boolean,
  error: IError | undefined,
  studentList: ICatalog[] | undefined,
  studentWork: IStudentWork | undefined,
  peerForm: IPeerForm | undefined
}

const initialState: ICheckingsState = {
  isListLoading: false,
  isWorkLoading: false,
  isPeerFormLoading: false,
  error: undefined,
  isListLock: true,
  isWorkLock: true,
  isPeerFormLock: true,
  studentList: undefined,
  studentWork: undefined,
  peerForm: undefined
};

export const checkings = createSlice({
  name: 'checkings',
  initialState,
  reducers: {
    fetchStudentListStarted: (state) => {
      state.isListLoading = true
      state.isListLock = true
      state.error = undefined
      state.studentList = undefined
    },

    fetchStudentWorkStarted: (state) => {
      state.isWorkLoading = true
      state.isWorkLock = true
      state.error = undefined
      state.studentWork = undefined
    },

    fetchPeerFormStarted: (state) => {
      state.isPeerFormLoading = true
      state.isPeerFormLock = true
      state.error = undefined
      state.peerForm = undefined
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

    fetchPeerFormSuccess: (state, { payload }: PayloadAction<IPeerForm>) => {
      state.isPeerFormLoading = false
      state.error = undefined
      state.isPeerFormLock = false
      state.peerForm = JSON.parse(JSON.stringify(payload))
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

    fetchPeerFormFailed: (state, { payload }: PayloadAction<IError>) => {
      state.isPeerFormLoading = false
      state.error = payload
      state.isPeerFormLock = false
    },
  },
});

export const actions = checkings.actions

export const reducer = checkings.reducer
