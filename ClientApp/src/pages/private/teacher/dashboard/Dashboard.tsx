import { Routes, Route, Navigate, generatePath } from 'react-router-dom'
import { FC } from "react";
import { Theme, Box } from "@mui/material";
import { SxProps } from "@mui/system";

import { usePrivatePathTDashboard } from "../../../../app/hooks/usePrivatePathTDashboard";

import { paths } from "../../../../app/constants/paths";
import { DashboardMenu } from '../../../../components/menu/DahboardMenu';
import { IMenu, IMenuTitles } from '../../../../store/types';


export const Dashboard: FC = () => {

  const {
    location,
    path
  } = usePrivatePathTDashboard()

  const pathToMainDashboard = generatePath(paths.teacher.dashboard.overview, {taskId: path?.taskId})

  // создать стэйт курса если нет то подиспатчить

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

  return (
    <Box sx={styles.container}>
      <Box sx={styles.gridWrapper}>
        <Box sx={styles.leftContainer}>
          <DashboardMenu
            activeMenu={path.activeMenuId}
            items={menuItems}
          />
        </Box>

        {/* right */}
        <Box sx={styles.rightContainer}>
          {/* right-wrapper */}
          <Box>

          </Box>
        </Box>

      </Box>
    </Box>
  )
}

const styles = {
  container: {
    maxWidth: "1400px"
  } as SxProps<Theme>,

  gridWrapper: {
    display: 'grid',
    marginBottom: "8px",
    gridTemplateColumns: '20% 80%',
    gridTemplateAreas: ' "leftContainer rightContainer"',
    overflow: 'hidden',
    height: '100%',
  } as SxProps<Theme>,

  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'leftContainer',
    px: 3,
    overflowY: 'auto',
  } as SxProps<Theme>,

  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'rightContainer',
    overflowY: 'auto',
  } as SxProps<Theme>,
}

const menuItems = [
  {
    title: IMenuTitles.CHECKINGS,
    path: paths.teacher.dashboard.checkings
  },
  {
    title: IMenuTitles.GRADES,
    path: paths.teacher.dashboard.grades
  },
  {
    title: IMenuTitles.EXPORT,
    path: paths.teacher.dashboard.export
  },
  {
    title: IMenuTitles.OVERVIEW,
    path: paths.teacher.dashboard.overview
  },
  {
    title: IMenuTitles.WORKS,
    path: paths.teacher.dashboard.works
  },
  {
    title: IMenuTitles.EXPERTS,
    path: paths.teacher.dashboard.experts
  }
] as IMenu[]
