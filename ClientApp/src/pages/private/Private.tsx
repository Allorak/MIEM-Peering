import { Routes, Route, Navigate, useLocation, RouteProps } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { paths } from '../../app/constants/paths'
import { TeacherPrivate } from './teacher/TeacherPrivate'
import { StudentPrivate } from './student/StudentPrivate'
import { PrivateHeader } from '../../components/header'
import { useEffect } from 'react'
import { fetchUserProfile } from '../../store/userProfile'
import { Role } from '../role'
import { Registration } from './registration'
import { Box, SxProps, Theme } from '@mui/system'
import { palette } from '../../theme/colors'




export function Private() {
  console.log("Private run")
  const location = useLocation()
  const dispatch = useAppDispatch()

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized)
  const authPayload = useAppSelector(state => state.auth.payload)
  const registrationProps = useAppSelector(state => state.registration.registraionProps)
  const isRegistered = useAppSelector(state => state.registration.isRegistered)
  useEffect(() => {
    if (authPayload?.accessToken) {
      dispatch(fetchUserProfile())
      console.log('Get user profile...s')
    }
  }, [dispatch, authPayload.accessToken])

  const userProfilePayload = useAppSelector(state => state.userProfile.payload)
  const userProfileIsLoading = useAppSelector(state => state.userProfile.isLoading)
  console.log(authPayload, 'auth')
  console.log(registrationProps?.email)
  useEffect(() => {
    if (authPayload && authPayload.accessToken) {
      fetchUserProfile()
    }
  }, [dispatch, authPayload])
  if ((!isAuthorized || !authPayload.accessToken) && !registrationProps?.email) {
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
    console.log('Private route return teacher Route')
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
    console.log('Private route return student Route')
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
  console.log('Private route return null')
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
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "5px"
    },

    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px"
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: palette.fillLight.greyLight,
      borderRadius: "10px"
    },
  } as SxProps<Theme>,
}
