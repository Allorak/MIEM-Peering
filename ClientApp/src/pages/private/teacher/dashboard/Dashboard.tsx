import { Routes, Route, Navigate, generatePath } from 'react-router-dom'
import { FC, useMemo } from "react";

import { usePrivatePathTDashboard } from "../../../../app/hooks/usePrivatePathTDashboard";
import { useAppSelector } from '../../../../app/hooks';
import { paths } from "../../../../app/constants/paths";

import { IMenu, IMenuTitles, IRole, PeerSteps } from '../../../../store/types';

import { DashboardRouter } from '../../../../components/dashboardRouter';

import { Grades } from './grades';
import { Overview } from './Overview';
import { Works } from './works';
import { Experts } from './experts';
import { Checkings } from './checkings';
import { ExportGrades } from './exportGrades';


export const Dashboard: FC = () => {
  const {
    location,
    path
  } = usePrivatePathTDashboard()

  const pathToMainDashboard = generatePath(paths.teacher.dashboard.overview, { taskId: path?.taskId })
  const dashboardProps = useAppSelector(state => state.dashboard.payload)

  if (!path) {
    return (
      <Navigate
        to={paths.teacher.main}
        replace
        state={{
          from: location
        }}
      />
    )
  }

  if (!path.activeMenuId && path.taskId) {
    <Navigate
      to={pathToMainDashboard}
      replace
      state={{
        from: location
      }}
    />
  }

  const convertedMenuItems = useMemo((): IMenu[] => {
    const isFirstStep = dashboardProps && dashboardProps.userRole === IRole.teacher && dashboardProps.taskType === PeerSteps.FIRST_STEP

    if (isFirstStep) {
      return menuItems.map(item => ({
        title: item.title,
        path: generatePath(item.path, { taskId: path.taskId })
      }))
    }

    const filteredMenuItems = menuItems.filter(item => item.path !== paths.teacher.dashboard.experts)

    return filteredMenuItems.map(item => ({
      title: item.title,
      path: generatePath(item.path, { taskId: path.taskId })
    }))

  }, [dashboardProps, menuItems])

  const isExpertsRoute = useMemo(() => (
    dashboardProps && dashboardProps.userRole === IRole.teacher && dashboardProps.taskType === PeerSteps.FIRST_STEP
  ), [dashboardProps])

  return (
    <DashboardRouter
      convertedMenuItems={convertedMenuItems}
      activeMenuId={path.activeMenuId}
    >
      <Routes>
        <Route path={paths.teacher.dashboard.overview} element={<Overview />} />
        <Route path={paths.teacher.dashboard.grades} element={<Grades />} />
        <Route path={paths.teacher.dashboard.works} element={<Works />} />
        <Route path={paths.teacher.dashboard.checkings} element={<Checkings />} />
        <Route path={paths.teacher.dashboard.export} element={<ExportGrades />} />

        {isExpertsRoute && (
          <Route path={paths.teacher.dashboard.experts} element={<Experts />} />
        )}
      </Routes>
    </DashboardRouter>
  )
}

const menuItems = [
  {
    title: IMenuTitles.OVERVIEW,
    path: paths.teacher.dashboard.overview
  },
  {
    title: IMenuTitles.WORKS,
    path: paths.teacher.dashboard.works
  },
  {
    title: IMenuTitles.CHECKINGS,
    path: paths.teacher.dashboard.checkings
  },
  {
    title: IMenuTitles.EXPERTS,
    path: paths.teacher.dashboard.experts
  },
  {
    title: IMenuTitles.GRADES,
    path: paths.teacher.dashboard.grades
  },
  {
    title: IMenuTitles.EXPORT,
    path: paths.teacher.dashboard.export
  },
] as IMenu[]