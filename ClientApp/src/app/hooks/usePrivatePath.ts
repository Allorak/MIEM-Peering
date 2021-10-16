import { useMemo } from 'react'
import { useLocation, matchPath, NavigateProps } from 'react-router-dom'
import { generatePath } from 'react-router'
import type { Location } from 'history'
import { IPath } from '../../store/types'


export type IUsePrivatePathResult = {
  location: Location,
  path?: IPath,
  navigateProps?: NavigateProps,
}

export const usePrivatePath = (): IUsePrivatePathResult => {
  const location = useLocation();

  
  return {
    location
  }
}

