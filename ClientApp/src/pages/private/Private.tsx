
import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, RouteProps, matchPath, generatePath } from 'react-router-dom'
import { Box, SxProps, Theme } from '@mui/system'

import { PrivateHeader } from '../../components/header'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { paths } from '../../app/constants/paths'
import { fetchUserProfile } from '../../store/userProfile'

import { IRole } from '../../store/types'

import * as globalStyles from "../../const/styles"
import { Dashboard as TeacherDashboard } from './teacher/dashboard/Dashboard'
import { TaskAdd } from './teacher/task/add'
import { CourseMain as TeacherCourseMain } from './teacher/course/main'
import { TCourseList as TeacherCourseList } from './teacher/course/list'
import { CourseMain as StudentCourseMain } from './student/course/main'
import { Dashboard as StudentDashboard } from './student/dashboard/Dashboard'
import { Dashboard as ExpertDashboard } from './expert/dashboard/Dashboard'
import { STCourseList as StudentCourseList } from './student/course/list'
import { fetchDashboard, actions as DashboardActions } from '../../store/dashboard'
import { CircularProgress, Typography } from '@mui/material'


export function Private() {

  const location = useLocation()
  const dispatch = useAppDispatch()

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized)
  const accessToken = useAppSelector(state => state.auth.accessToken)
  const registrationToken = useAppSelector(state => state.registration.googleToken)
  const userProfilePayload = useAppSelector(state => state.userProfile.payload)
  const dashboardProps = useAppSelector(state => state.dashboard.payload)

  const path = matchPath('/:role/task/:taskId/*', location.pathname)
  const role = path?.params?.role
  const taskId = path?.params?.taskId

  useEffect(() => {
    if (accessToken && !userProfilePayload) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, accessToken])

  useEffect(() => {
    if (taskId && role) {
      dispatch(DashboardActions.resetState())
      dispatch(fetchDashboard(taskId))
    }
  }, [taskId])

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

  if (taskId && !dashboardProps) {
    return (
      <Box sx={styles.loadingRoot}>
        <CircularProgress sx={styles.progress} />
        <Typography variant='h6'
          sx={{ color: "common.white" }}
        >
          {"Загрузка..."}
        </Typography>
      </Box>
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.teacher && role !== 't') {
    console.log('Navigate to Teacher Dashboard')

    const pathToMainDashboard = generatePath(paths.teacher.dashboard.overview, { taskId })

    return (
      <Navigate
        to={pathToMainDashboard}
        replace
      />
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.student && role !== 'st') {
    console.log('Navigate to Student Dashboard')

    const pathToMainDashboard = generatePath(paths.student.dashboard.overview, { taskId })

    return (
      <Navigate
        to={pathToMainDashboard}
        replace
      />
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.expert && role !== 'ex') {
    console.log('Navigate to Expert Dashboard')

    const pathToMainDashboard = generatePath(paths.expert.dashboard.overview, { taskId })

    return (
      <Navigate
        to={pathToMainDashboard}
        replace
      />
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.teacher) {
    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <Route path={"*"} element={<TeacherDashboard />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.student) {
    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <Route path={"*"} element={<StudentDashboard />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.expert) {
    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <Route path={"*"} element={<ExpertDashboard />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  if (userProfilePayload && userProfilePayload.role === IRole.teacher) {
    console.log("Teacher routes")

    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <Route path={paths.teacher.main} element={<TeacherCourseList />} />
            <Route path={paths.teacher.courses.course} element={<TeacherCourseMain />} />
            <Route path={paths.teacher.task.add} element={<TaskAdd />} />
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
            <Route path={paths.student.main} element={<StudentCourseList />} />
            <Route path={paths.student.courses.course} element={<StudentCourseMain />} />
            <Route path={"*"} element={<StudentDashboard />} />
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

  loadingRoot: {
    width: '100%',
    position: 'fixed',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    top: '0',
    left: '0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5001,
    backgroundColor: 'rgba(0,0,0, 0.77)'
  } as SxProps<Theme>,

  progress: {
    color: "primary.main",
  } as SxProps<Theme>,
}
