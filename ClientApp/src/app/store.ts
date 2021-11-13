import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { reducer as auth } from '../store/auth'
import { reducer as gAuth } from '../store/googleAuth'
import { reducer as userProfile } from '../store/userProfile'
import { reducer as registration } from '../store/registretion'
import { reducer as courses } from '../store/courses'
import { reducer as newCourse } from '../store/addCourse'
import { reducer as tasks } from '../store/tasks'
import { reducer as overview } from '../store/overview'
import { reducer as works } from '../store/works'

export const store = configureStore({
  reducer: {
    auth,
    gAuth,
    userProfile,
    registration,
    courses,
    newCourse,
    tasks,
    overview,
    works
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>