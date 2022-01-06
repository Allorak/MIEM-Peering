import { FC, useState } from "react";
import { Routes, Route, Navigate, generatePath } from 'react-router-dom'
import { Theme, Box, Typography, useMediaQuery } from "@mui/material";
import { SxProps } from "@mui/system";

import { usePrivatePathExDashboard } from '../../../../app/hooks/usePrivatePathExDashboard';

import { DashboardMenu } from '../../../../components/menu/DahboardMenu';
import { Burger } from "../../../../components/icons/Burger";

import { IMenu, IMenuTitles } from '../../../../store/types';
import { paths } from "../../../../app/constants/paths";

import { Checkings } from "./checkings";
import { Overview } from './overview';

import * as globalStyles from "../../../../const/styles"


export const Dashboard: FC = () => {

  const {
    location,
    path
  } = usePrivatePathExDashboard()

  const pathToMainDashboard = generatePath(paths.expert.dashboard.overview, { taskId: path?.taskId })
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

  const menuItemsP = menuItems.map(item => ({ title: item.title, path: generatePath(item.path, { taskId: path.taskId }) })) as IMenu[]

  return (
    <Box sx={styles.container}>
      <Box sx={styles.menuItemBurger}
        onClick={() => { setActiveMenu(!activeMenu) }}
      >
        <Burger />
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

          <Box sx={styles.rightContainerWrapper}>
            <Box>
              <Routes>
                <Route path={paths.expert.dashboard.overview} element={<Overview />} />
                <Route path={paths.expert.dashboard.checkings} element={<Checkings />} />
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
    top: '28px',
    right: '85px',
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
    position: 'fixed',
    zIndex: '600',
    width: '170px',
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
      overflowY: 'auto',
      transform: 'TranslateX(0)',
      transition: 'all 0.5s',
      padding: '0',
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
    overflowY: "auto",
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
}

const menuItems = [
  {
    title: IMenuTitles.OVERVIEW,
    path: paths.expert.dashboard.overview
  },
  {
    title: IMenuTitles.CHECKINGS,
    path: paths.expert.dashboard.checkings
  }
] as IMenu[]
