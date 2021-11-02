import { useMemo } from 'react'
import { useLocation, matchPath, NavigateProps } from 'react-router-dom'
import { generatePath } from 'react-router'
import type { Location } from 'history'
import { IPathDashboard } from '../../store/types'
import { paths } from '../constants/paths'


export type IUsePrivatePathResult = {
  location: Location,
  path?: IPathDashboard
}

export const usePrivatePathTDashboard = (): IUsePrivatePathResult => {
  const location = useLocation();
  if (location.pathname === paths.teacher.main) {
    return {
      location,
      path: {} as IPathDashboard
    }
  }

  const path = matchPath('t/task/:taskId/*', location.pathname)
    ?? matchPath('t/task/:taskId/:activeMenuTopId', location.pathname)
    
  const taskId = path?.params?.taskId
  const activeMenuId = path?.params?.activeMenuId

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

  return {
    location,
    path: {
      taskId,
      activeMenuId
    },
  }
}