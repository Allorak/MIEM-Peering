
import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, matchPath, generatePath, useNavigate } from 'react-router-dom'
import { Box, SxProps, Theme } from '@mui/system'
import { CircularProgress, Typography } from '@mui/material'
import Cookies from 'universal-cookie';

import { PrivateHeader } from '../../components/header'
import { Router404 } from '../../components/router404'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { usePrivatePathT } from "../../app/hooks/usePrivatePathT"
import { usePrivatePathSt } from "../../app/hooks/usePrivatePathSt"
import { paths } from '../../app/constants/paths'
import { fetchUserProfile } from '../../store/userProfile'

import { ICookiesToken, IRole } from '../../store/types'

import * as globalStyles from "../../const/styles"
import { Dashboard as TeacherDashboard } from './teacher/dashboard/Dashboard'
import { TaskAdd } from './teacher/task/add'
import { Landing } from '../landing'
import { CourseMain as TeacherCourseMain } from './teacher/course/main'
import { TCourseList as TeacherCourseList } from './teacher/course/list'
import { CourseMain as StudentCourseMain } from './student/course/main'
import { Dashboard as StudentDashboard } from './student/dashboard/Dashboard'
import { Dashboard as ExpertDashboard } from './expert/dashboard/Dashboard'
import { STCourseList as StudentCourseList } from './student/course/list'
import { fetchDashboard, actions as DashboardActions } from '../../store/dashboard'
import { actions as authActions } from '../../store/auth'
import { fetchCourses } from '../../store/courses/thunks/courses'


export function Private() {
  const cookies = new Cookies();
  const location = useLocation()
  const history = useNavigate()
  const dispatch = useAppDispatch()

  const { path: pathT } = usePrivatePathT()
  const { path: pathSt } = usePrivatePathSt()

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized)
  const accessToken = useAppSelector(state => state.auth.accessToken)
  const registrationToken = useAppSelector(state => state.registration.googleToken)
  const userProfilePayload = useAppSelector(state => state.userProfile.payload)
  const dashboardProps = useAppSelector(state => state.dashboard.payload)
  const dashboardError = useAppSelector(state => state.dashboard.error)

  const path = matchPath('/:role/task/:taskId/*', location.pathname)
  const role = path?.params?.role
  const taskId = path?.params?.taskId

  const accessTokenFromCookies = cookies.get(ICookiesToken.key)

  // if (!accessTokenFromCookies && accessToken && accessToken !== undefined) {
  //   cookies.set(ICookiesToken.key, accessToken)
  // }

  useEffect(() => {
    if (!accessToken && accessTokenFromCookies && !userProfilePayload) {
      dispatch(authActions.authSuccess(accessTokenFromCookies))
      if (pathT?.courseId || pathSt?.courseId) {
        dispatch(fetchCourses())
      }
    }
  }, [dispatch, accessToken, accessTokenFromCookies])

  useEffect(() => {
    if (accessToken && !userProfilePayload) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, accessToken])

  useEffect(() => {
    if (taskId && role && accessToken) {
      dispatch(DashboardActions.resetState())
      dispatch(fetchDashboard(taskId))
    }
  }, [taskId, accessToken])

  useEffect(() => {
    if (dashboardError) {
      dispatch(DashboardActions.resetState())
      history(paths.notFound)
    }
  }, [dashboardError])

  if ((!isAuthorized || !accessToken) && !registrationToken && !accessTokenFromCookies) {
    return (
      <>
        <Routes>
          <Route path={paths.root} element={<Landing />} />
        </Routes>

        {location.pathname !== paths.root && (
          <Navigate
            to={paths.root}
            replace
          />
        )}
      </>
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
    const pathToMainDashboard = generatePath(paths.teacher.dashboard.overview, { taskId })

    return (
      <Navigate
        to={pathToMainDashboard}
        replace
      />
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.student && role !== 'st') {
    const pathToMainDashboard = generatePath(paths.student.dashboard.overview, { taskId })

    return (
      <Navigate
        to={pathToMainDashboard}
        replace
      />
    )
  }

  if (taskId && dashboardProps && dashboardProps.userRole === IRole.expert && role !== 'ex') {
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

        <Box sx={styles.dashboardBody}>
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

        <Box sx={styles.dashboardBody}>
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

        <Box sx={styles.dashboardBody}>
          <Routes>
            <Route path={"*"} element={<ExpertDashboard />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  if (userProfilePayload && userProfilePayload.role === IRole.teacher) {
    if (location.pathname === paths.root) {
      return (
        <Navigate
          to={paths.teacher.main}
          replace
        />
      )
    }

    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <Route path={paths.teacher.main} element={<TeacherCourseList />} />
            <Route path={paths.teacher.courses.course} element={<TeacherCourseMain />} />
            <Route path={paths.teacher.task.add} element={<TaskAdd />} />
            <Route path={'*'} element={<Router404 />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  if (userProfilePayload && userProfilePayload.role === IRole.student) {
    if (location.pathname === paths.root) {
      return (
        <Navigate
          to={paths.student.main}
          replace
        />
      )
    }
    return (
      <Box sx={styles.wrapper}>
        <PrivateHeader />

        <Box sx={styles.body}>
          <Routes>
            <Route path={paths.student.main} element={<StudentCourseList />} />
            <Route path={paths.student.courses.course} element={<StudentCourseMain />} />
            <Route path={"*"} element={<Router404 />} />
          </Routes>
        </Box>
      </Box>
    )
  }

  return null
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
  dashboardBody: {
    overflowY: 'hidden',
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
