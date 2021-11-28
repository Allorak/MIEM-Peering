
import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, RouteProps } from 'react-router-dom'
import { Box, SxProps, Theme } from '@mui/system'

import { TeacherPrivate } from './teacher/TeacherPrivate'
import { StudentPrivate } from './student/StudentPrivate'

import { PrivateHeader } from '../../components/header'

import { Role } from './registration/role'
import { Registration } from './registration'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { paths } from '../../app/constants/paths'
import { fetchUserProfile } from '../../store/userProfile'

import * as globalStyles from "../../const/styles"


export function Private() {

  const location = useLocation()
  const dispatch = useAppDispatch()

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized)
  const accessToken = useAppSelector(state => state.auth.accessToken)
  const registrationToken = useAppSelector(state => state.registration.googleToken)
  const userProfilePayload = useAppSelector(state => state.userProfile.payload)
  const userProfileIsLoading = useAppSelector(state => state.userProfile.isLoading)

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, accessToken])

  useEffect(() => {
    if (accessToken) {
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

  if (!userProfileIsLoading && userProfilePayload?.role === 'teacher') {
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

  if (!userProfileIsLoading && userProfilePayload?.role === 'student') {
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

  return (
    <Routes>
      <PrivateRoute path={paths.registration.main} element={<Registration />} />
      <PrivateRoute path={paths.registration.selectRole} element={<Role />} />
    </Routes>
  )
}

function PrivateRoute(props: RouteProps): React.ReactElement {
  return (
    <Route {...props} />
  )
}

const styles = {
  wrapper: {
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
