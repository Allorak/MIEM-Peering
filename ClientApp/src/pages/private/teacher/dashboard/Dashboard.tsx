import { Routes, Route, Navigate, generatePath } from 'react-router-dom'
import { FC, useState } from "react";
import { Theme, Box, Typography, useMediaQuery } from "@mui/material";
import { SxProps } from "@mui/system";

import { usePrivatePathTDashboard } from "../../../../app/hooks/usePrivatePathTDashboard";
import { useAppSelector } from '../../../../app/hooks';

import { Router404 } from '../../../../components/router404';
import { DashboardMenu } from '../../../../components/menu/DahboardMenu';
import { Burger } from '../../../../components/icons/Burger';
import { IMenu, IMenuTitles, IRole, PeerSteps } from '../../../../store/types';
import { paths } from "../../../../app/constants/paths";

import { Grades } from './grades';
import { Overview } from './Overview';
import { Works } from './works';
import { Experts } from './experts';
import { Checkings } from './checkings';
import { ExportGrades } from './exportGrades';

import * as globalStyles from "../../../../const/styles"

export const Dashboard: FC = () => {

  const {
    location,
    path
  } = usePrivatePathTDashboard()

  const pathToMainDashboard = generatePath(paths.teacher.dashboard.overview, { taskId: path?.taskId })
  const dashboardProps = useAppSelector(state => state.dashboard.payload)

  const [activeMenu, setActiveMenu] = useState(false)
  const matches = useMediaQuery('(max-width:767px)')

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

  const isFirstStep = dashboardProps && dashboardProps.userRole === IRole.teacher && dashboardProps.taskType === PeerSteps.FIRST_STEP

  const menuItemsP = isFirstStep ? menuItems.map(item => ({ title: item.title, path: generatePath(item.path, { taskId: path.taskId }) })) as IMenu[] :
    menuItems.filter(item => item.path !== paths.teacher.dashboard.experts).map(item => ({ title: item.title, path: generatePath(item.path, { taskId: path.taskId }) })) as IMenu[]

  return (
    <Box sx={styles.container}>
      <Box sx={activeMenu ? styles.menuItemBurgerActive : styles.menuItemBurger}
        onClick={() => { setActiveMenu(!activeMenu) }}
      >
        <Burger svgColor={activeMenu ? "white" : "#CBD5DE"} />
      </Box>
      <Box sx={styles.gridWrapper}>
        <Box sx={matches && activeMenu ? { ...styles.leftContainer, ...styles.menuActive } : styles.leftContainer}>
          <Typography variant={"h5"} marginBottom={"30px"}>
            {"Меню"}
          </Typography>
          <DashboardMenu
            activeMenu={path.activeMenuId}
            items={menuItemsP}
          />
        </Box>
        <Box
          sx={styles.rightContainer}
          onClick={() => { setActiveMenu(false) }} >
          <Typography
            variant={"h5"}
            marginBottom={"30px"}
            color={"#273AB5"}
          >
            {menuItemsP.find(item => item.title === path.activeMenuId)?.title}
          </Typography>

          <Box sx={activeMenu ? styles.rightContainerLock : styles.rightContainerWrapper}>
            <Box>
              <Routes>
                <Route path={paths.teacher.dashboard.overview} element={<Overview />} />
                <Route path={paths.teacher.dashboard.grades} element={<Grades />} />
                <Route path={paths.teacher.dashboard.works} element={<Works />} />
                <Route path={paths.teacher.dashboard.checkings} element={<Checkings />} />
                <Route path={paths.teacher.dashboard.export} element={<ExportGrades />} />
                {dashboardProps && dashboardProps.userRole === IRole.teacher && dashboardProps.taskType === PeerSteps.FIRST_STEP && (
                  <Route path={paths.teacher.dashboard.experts} element={<Experts />} />
                )}  
                <Route path={'*'} element={<Router404 />} />
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
  menuItemBurger: {
    position: 'absolute',
    top: '105px',
    right: '25px',
    padding: '8px',
    backgroundColor: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    '@media (min-width: 768px)': {
      display: 'none'
    }
  } as SxProps<Theme>,
  menuItemBurgerActive: {
    position: 'absolute',
    top: '105px',
    right: '25px',
    padding: '8px',
    backgroundColor: 'primary.main',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    '@media (min-width: 768px)': {
      display: 'none'
    }
  } as SxProps<Theme>,
  gridWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '@media (min-width: 768px)': {
      display: 'grid',
      gridTemplateColumns: '70px auto',
      gridTemplateAreas: ' "leftContainer rightContainer"',
      margin: "30px auto 15px",
      padding: '0 15px 0 8px',
    },
    '@media (min-width: 1280px)': {
      gridTemplateColumns: '20% 80%',
    },
  } as SxProps<Theme>,
  leftContainer: {
    position: 'fixed',
    zIndex: '600',
    width: '180px',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'leftContainer',
    padding: '25px',
    transform: 'TranslateX(-100%)',
    transition: 'TranslateX 3s',
    '@media (min-width: 768px)': {
      position: 'static',
      display: 'flex',
      flexDirection: 'column',
      gridArea: 'leftContainer',
      width: '100%',
      height: 'auto',
      minHeight: '100vh',
      overflowY: 'auto',
      transform: 'TranslateX(0)',
      transition: 'all 0.5s',
      padding: '0 8px 0 0',
      boxShadow: '15px 0px 10px -15px rgba(34, 60, 80, 0.1)',
      backgroundColor: 'transparent'
    },
  } as SxProps<Theme>,
  menuActive: {
    transform: 'TranslateX(0)',
    transition: 'all 0.5s'
  } as SxProps<Theme>,
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'rightContainer',
    overflowY: 'auto',
    maxWidth: "100%",
    padding: '25px 25px 0',
    '@media (min-width: 768px)': {
      margin: "0px 0px 0px 25px",
      padding: '0'
    },
  } as SxProps<Theme>,
  rightContainerWrapper: {
    maxHeight: "calc(100vh - 183px)",
    paddingRight: "8px",
    overflowY: "auto",
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
  rightContainerLock: {
    maxHeight: "calc(100vh - 183px)",
    paddingRight: "8px",
    overflowY: "auto",
    touchAction: 'none',
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
