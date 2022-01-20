import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { reducer as auth } from '../store/auth'
import { reducer as gAuth } from '../store/googleAuth'
import { reducer as userProfile } from '../store/userProfile'
import { reducer as registration } from '../store/registretion'
import { reducer as courses } from '../store/courses'
import { reducer as newCourse } from '../store/addCourse'
import { reducer as joinCourse } from '../store/JoinCourse'
import { reducer as tasks } from '../store/tasks'
import { reducer as overview } from '../store/overview'
import { reducer as overviewStudent } from '../store/overviewStudent'
import { reducer as overviewExpert } from '../store/overviewExpert'
import { reducer as works } from '../store/works'
import { reducer as experts } from '../store/experts'
import { reducer as checkings } from '../store/checkings'
import { reducer as authorForm } from '../store/authorformStudent'
import { reducer as dashboard } from '../store/dashboard'
import { reducer as deadlineStatus } from '../store/deadlineStatus'
import { reducer as myWork } from '../store/myWork'
import { reducer as grades } from '../store/grades'


export const store = configureStore({
  reducer: {
    auth,
    gAuth,
    userProfile,
    registration,
    dashboard,
    deadlineStatus,
    courses,
    newCourse,
    joinCourse,
    tasks,
    overview,
    overviewStudent,
    overviewExpert,
    works,
    experts,
    checkings,
    authorForm,
    myWork,
    grades
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