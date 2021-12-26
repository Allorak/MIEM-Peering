import { Routes, Route, Navigate, generatePath } from 'react-router-dom'
import { FC } from "react";
import { Theme, Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { usePrivatePathTDashboard } from "../../../../app/hooks/usePrivatePathTDashboard";


import { DashboardMenu } from '../../../../components/menu/DahboardMenu';
import { IMenu, IMenuTitles } from '../../../../store/types';
import { paths } from "../../../../app/constants/paths";

import { Checkings } from '../../teacher/dashboard/checkings';
import { Overview } from './overview';

import * as globalStyles from "../../../../const/styles"


export const Dashboard: FC = () => {

  const {
    location,
    path
  } = usePrivatePathTDashboard()

  const pathToMainDashboard = generatePath(paths.teacher.dashboard.overview, { taskId: path?.taskId })

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

  const menuItemsP = menuItems.map(item => ({ title: item.title, path: generatePath(item.path, { taskId: path.taskId }) })) as IMenu[]

  return (
    <Box sx={styles.container}>
      <Box sx={styles.gridWrapper}>
        <Box sx={styles.leftContainer}>
          <Typography variant={"h5"} marginBottom={"30px"}>
            {"Меню"}
          </Typography>

          <DashboardMenu
            activeMenu={path.activeMenuId}
            items={menuItemsP}
          />
        </Box>

        <Box sx={styles.rightContainer}>
          <Typography
            variant={"h5"}
            marginBottom={"30px"}
            color={"#273AB5"}
          >
            {menuItemsP.find(item => item.title === path.activeMenuId)?.title}
          </Typography>

          <Box sx={styles.rightContainerWrapper}>
            <Box marginRight={"15px"}>
              <Routes>
                <Route path={paths.teacher.dashboard.overview} element={<Overview />} />
                <Route path={paths.teacher.dashboard.checkings} element={<Checkings />} />
              </Routes>
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  )
}

const styles = {
  container: {
    maxWidth: "1800px",
    margin: "0 auto",
  } as SxProps<Theme>,

  gridWrapper: {
    display: 'grid',
    margin: "30px 0px 8px 15px",
    gridTemplateColumns: '15% 85%',
    gridTemplateAreas: ' "leftContainer rightContainer"',
    height: '100%',
  } as SxProps<Theme>,

  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'leftContainer',
    overflowY: 'auto',
  } as SxProps<Theme>,

  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'rightContainer',
    overflowY: 'auto',
    maxWidth: "100%",
    margin: "0px 0px 0px 25px",
  } as SxProps<Theme>,
  rightContainerWrapper: {
    maxHeight: "calc(100vh - 183px)",
    overflowY: "auto",
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
}

const menuItems = [
  {
    title: IMenuTitles.OVERVIEW,
    path: paths.teacher.dashboard.overview
  },
  {
    title: IMenuTitles.CHECKINGS,
    path: paths.teacher.dashboard.checkings
  }
] as IMenu[]
