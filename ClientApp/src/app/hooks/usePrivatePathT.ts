import { useMemo } from 'react'
import { useLocation, matchPath, NavigateProps } from 'react-router-dom'
import { generatePath } from 'react-router'
import type { Location } from 'history'
import { IPath } from '../../store/types'
import { paths } from '../constants/paths'


export type IUsePrivatePathResult = {
  location: Location,
  path?: IPath
}

export const usePrivatePathT = (): IUsePrivatePathResult => {
  const location = useLocation();
  if (location.pathname === paths.teacher.main) {
    return {
      location,
      path: {} as IPath
    }
  }

  const path = matchPath('/t/course/:courseId', location.pathname)
    ?? matchPath('/t/course/:courseId/main', location.pathname)
    ?? matchPath('/t/course/:courseId/task', location.pathname)    
    ?? matchPath('/t/course/:courseId/task/add', location.pathname)
    ?? matchPath('/t/course/:courseId/task/:taskId', location.pathname)
    
  const courseId = path?.params?.courseId
  const taskId = path?.params?.taskId
  
  if (!courseId && !taskId) {
    return {
      location,
    }
  }

  if (!courseId) {
    return {
      location,
      path: {
        taskId
      }
    }
  }

  if (!taskId) {
    return {
      location,
      path: {
        courseId
      }
    }
  }  

  return {
    location,
    path: {
      taskId,
      courseId
    },
  }
}