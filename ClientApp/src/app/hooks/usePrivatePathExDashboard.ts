import { useLocation, matchPath } from 'react-router-dom'
import type { Location } from 'history'

import { IMenuTitles, IPathDashboard } from '../../store/types'
import { paths } from '../constants/paths'


export type IUsePrivatePathResult = {
  location: Location,
  path?: IPathDashboard
}

export const usePrivatePathExDashboard = (): IUsePrivatePathResult => {
  const location = useLocation();
  if (location.pathname === paths.teacher.main) {
    return {
      location,
      path: {} as IPathDashboard
    }
  }

  const path = matchPath('/ex/task/:taskId/:activeMenu', location.pathname)
    ?? matchPath('/ex/task/:taskId/*', location.pathname)

  const taskId = path?.params?.taskId
  const activeMenuId = path?.params?.activeMenu

  if (!taskId) {
    return {
      location,
    }
  }

  if (!activeMenuId) {
    return {
      location,
      path: {
        taskId
      }
    }
  }

  const activeMenu = convertActiveMenu(activeMenuId)

  return {
    location,
    path: {
      taskId,
      activeMenuId: activeMenu
    },
  }
}

const convertActiveMenu = (activeMenuId: string | undefined) => {
  switch (activeMenuId) {
    case "overview": return IMenuTitles.OVERVIEW
    case "checkings": return IMenuTitles.CHECKINGS
    default: return undefined
  }
}