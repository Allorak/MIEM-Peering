import { FC, useMemo } from "react";
import { Routes, Route, Navigate, generatePath } from 'react-router-dom'

import { usePrivatePathStDashboard } from "../../../../app/hooks/usePrivatePathStDashboard";
import { paths } from "../../../../app/constants/paths";

import { IMenu, IMenuTitles } from '../../../../store/types';

import { DashboardRouter } from '../../../../components/dashboardRouter';

import { Overview } from './Overview';
import { Authorform } from './authorform';
import { MyWork } from './myWork';
import { Checkings } from './checkings';


export const Dashboard: FC = () => {
  const {
    location,
    path
  } = usePrivatePathStDashboard()

  const pathToMainDashboard = generatePath(paths.student.dashboard.overview, { taskId: path?.taskId })

  if (!path) {
    return (
      <Navigate
        to={paths.student.main}
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
        <Route path={paths.student.dashboard.overview} element={<Overview />} />
        <Route path={paths.student.dashboard.authorform} element={<Authorform />} />
        <Route path={paths.student.dashboard.work} element={<MyWork />} />
        <Route path={paths.student.dashboard.checkings} element={<Checkings />} />
      </Routes>
    </DashboardRouter>
  )
}

const menuItems = [
  {
    title: IMenuTitles.OVERVIEW,
    path: paths.student.dashboard.overview
  },
  {
    title: IMenuTitles.AUTHORFORM,
    path: paths.student.dashboard.authorform
  },
  {
    title: IMenuTitles.WORK,
    path: paths.student.dashboard.work
  },
  {
    title: IMenuTitles.CHECKINGS,
    path: paths.student.dashboard.checkings
  },
] as IMenu[]
