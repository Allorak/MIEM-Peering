import { Routes, Route, Navigate, generatePath } from 'react-router-dom'
import { FC } from "react";
import { Theme, Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { usePrivatePathTDashboard } from "../../../../app/hooks/usePrivatePathTDashboard";


import { DashboardMenu } from '../../../../components/menu/DahboardMenu';
import { IMenu, IMenuTitles } from '../../../../store/types';
import { paths } from "../../../../app/constants/paths";

import { CourseMain } from '../course/main';
import { Overview } from './Overview';
import { Works } from './works';
import { Experts } from './experts';

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
            <Box>
              <Routes>
                <Route path={paths.teacher.dashboard.overview} element={<Overview />} />
                <Route path={paths.teacher.dashboard.experts} element={<Experts />} />
                <Route path={paths.teacher.dashboard.export} element={<CourseMain />} />
                <Route path={paths.teacher.dashboard.grades} element={<CourseMain />} />
                <Route path={paths.teacher.dashboard.works} element={<Works />} />
                <Route path={paths.teacher.dashboard.checkings} element={<CourseMain />} />
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
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '@media (min-width: 768px)': {
      display: 'grid',
      gridTemplateColumns: '10% 90%',
      gridTemplateAreas: ' "leftContainer rightContainer"',
      margin: "30px auto 15px",
      padding: '0 15px 0 8px',
    },
    '@media (min-width: 1280px)': {
      gridTemplateColumns: '20% 80%',
    },
  } as SxProps<Theme>,

  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'leftContainer',
    padding: '25px',
    '@media (min-width: 768px)': {
      padding: '0'
    },
  } as SxProps<Theme>,

  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'rightContainer',
    overflowY: 'auto',
    maxWidth: "100%",
    padding: '0 25px',
    '@media (min-width: 768px)': {
      margin: "0px 0px 0px 25px",
      padding: '0'
    },
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
