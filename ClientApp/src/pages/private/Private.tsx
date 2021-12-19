
import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, RouteProps } from 'react-router-dom'
import { Box, SxProps, Theme } from '@mui/system'

import { TeacherPrivate } from './teacher/TeacherPrivate'
import { StudentPrivate } from './student/StudentPrivate'

import { PrivateHeader } from '../../components/header'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { paths } from '../../app/constants/paths'
import { fetchUserProfile } from '../../store/userProfile'

import { IRole } from '../../store/types'

import * as globalStyles from "../../const/styles"


export function Private() {

  const location = useLocation()
  const dispatch = useAppDispatch()

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized)
  const accessToken = useAppSelector(state => state.auth.accessToken)
  const registrationToken = useAppSelector(state => state.registration.googleToken)
  const userProfilePayload = useAppSelector(state => state.userProfile.payload)

  useEffect(() => {
    if (accessToken && !userProfilePayload) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, accessToken])

  if ((!isAuthorized || !accessToken) && !registrationToken) {
    console.log('Navigate to login')
    return (
      <Navigate
        to={paths.login}
        replace
        state={{
          from: location
        }}
      />
    )
  }

  if (userProfilePayload && userProfilePayload.role === IRole.teacher) {
    console.log("Teacher routes")
    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <PrivateRoute path='*' element={<TeacherPrivate />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  if (userProfilePayload && userProfilePayload.role === IRole.student) {
    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <PrivateRoute path='*' element={<StudentPrivate />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  return null
}

function PrivateRoute(props: RouteProps): React.ReactElement {
  return (
    <Route {...props} />
  )
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100vh',
    overflow: 'hidden'
  } as SxProps<Theme>,

  body: {
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: 'calc(100vh - 80px)',
    ...globalStyles.scrollStyles,
  } as SxProps<Theme>,
}
