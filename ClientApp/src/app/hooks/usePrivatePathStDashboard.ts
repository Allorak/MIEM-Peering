import { useLocation, matchPath } from 'react-router-dom'
import type { Location } from 'history'

import { IMenuTitles, IPathDashboard } from '../../store/types'
import { paths } from '../constants/paths'


export type IUsePrivatePathResult = {
  location: Location,
  path?: IPathDashboard
}

export const usePrivatePathStDashboard = (): IUsePrivatePathResult => {
  const location = useLocation();
  if (location.pathname === paths.student.main) {
    return {
      location,
      path: {} as IPathDashboard
    }
  }

  const path = matchPath('st/task/:taskId/:activeMenu', location.pathname)
    ?? matchPath('st/task/:taskId/*', location.pathname)

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
    case "authorform": return IMenuTitles.AUTHORFORM
    case "menu2": return IMenuTitles.MENU_2
    case "menu3": return IMenuTitles.MENU_3
    default: return undefined
  }
}