import { FC, useMemo } from "react";
import { Routes, Route, Navigate, generatePath } from 'react-router-dom'

import { usePrivatePathExDashboard } from '../../../../app/hooks/usePrivatePathExDashboard';

import { DashboardRouter } from "../../../../components/dashboardRouter";
import { Router404 } from "../../../../components/router404";

import { IMenu, IMenuTitles } from '../../../../store/types';
import { paths } from "../../../../app/constants/paths";

import { Checkings } from "./checkings";
import { Overview } from './overview';


export const Dashboard: FC = () => {
  const {
    location,
    path
  } = usePrivatePathExDashboard()

  const pathToMainDashboard = generatePath(paths.expert.dashboard.overview, { taskId: path?.taskId })

  if (!path?.taskId) {
    return (
      <Navigate
        to={paths.notFound}
        replace
      />
    )
  }

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
    return menuItems.map(item => ({ title: item.title, path: generatePath(item.path, { taskId: path.taskId }) }))
  }, [])

  return (
    <DashboardRouter
      convertedMenuItems={convertedMenuItems}
      activeMenuId={path.activeMenuId}
    >
      <Routes>
        <Route path={paths.expert.dashboard.overview} element={<Overview />} />
        <Route path={paths.expert.dashboard.checkings} element={<Checkings />} />
        <Route path={'*'} element={<Router404 />} />
      </Routes>
    </DashboardRouter>
  )
}

const menuItems = [
  {
    title: IMenuTitles.OVERVIEW,
    path: paths.expert.dashboard.overview
  },
  {
    title: IMenuTitles.CHECKINGS,
    path: paths.expert.dashboard.checkings
  }
] as IMenu[]
