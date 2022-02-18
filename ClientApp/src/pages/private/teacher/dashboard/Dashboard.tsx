import { Routes, Route, Navigate, generatePath } from 'react-router-dom'
import { FC, useCallback, useMemo, useState } from "react";
import { Theme, Box, Typography, useMediaQuery } from "@mui/material";
import { SxProps } from "@mui/system";

import { usePrivatePathTDashboard } from "../../../../app/hooks/usePrivatePathTDashboard";
import { useAppSelector } from '../../../../app/hooks';
import { paths } from "../../../../app/constants/paths";

import { DashboardMenu } from '../../../../components/menu/DahboardMenu';
import { Burger } from '../../../../components/icons/Burger';
import { ArrowToggler } from '../../../../components/arrowToggler';
import { IMenu, IMenuTitles, IRole, PeerSteps } from '../../../../store/types';

import { Grades } from './grades';
import { Overview } from './Overview';
import { Works } from './works';
import { Experts } from './experts';
import { Checkings } from './checkings';
import { ExportGrades } from './exportGrades';

import * as globalStyles from "../../../../const/styles";


export const Dashboard: FC = () => {
  const {
    location,
    path
  } = usePrivatePathTDashboard()

  const pathToMainDashboard = generatePath(paths.teacher.dashboard.overview, { taskId: path?.taskId })
  const dashboardProps = useAppSelector(state => state.dashboard.payload)

  const [isOpenMenu, setOpenMenu] = useState(false)
  const [isActiveMenu, setActiveMenu] = useState(false)

  const isMobile = useMediaQuery('(max-width:767px)')
  const isDesktop = useMediaQuery('(max-width:2047px)')

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

  const toggleOpenMenu = useCallback((openMenu: boolean) => {
    if (isMobile) {
      setActiveMenu(!openMenu)
    } else if (isDesktop) {
      setOpenMenu(!openMenu)
    }
  }, [isMobile, isDesktop])

  const convertedMenuItems = useMemo((): IMenu[] => {
    const isFirstStep = dashboardProps && dashboardProps.userRole === IRole.teacher && dashboardProps.taskType === PeerSteps.FIRST_STEP

    if (isFirstStep) {
      return menuItems.map(item => ({
        title: item.title,
        path: generatePath(item.path, { taskId: path.taskId })
      }))
    }

    const filteredMenuItems = menuItems.filter(item => item.path !== paths.teacher.dashboard.experts)

    return filteredMenuItems.map(item => ({
      title: item.title,
      path: generatePath(item.path, { taskId: path.taskId })
    }))

  }, [dashboardProps, menuItems])

  const menuItemBurgerBg = useMemo(() => (
    isActiveMenu ? "primary.main" : "common.white"
  ), [isActiveMenu])

  const onBurgerItemClick = useCallback(() => {
    setActiveMenu(!isActiveMenu)
  }, [isActiveMenu])

  const burgerIconColor = useMemo(() => (
    isActiveMenu ? "white" : "#2F3CED"
  ), [isActiveMenu])

  const leftContainerSx = useMemo((): SxProps<Theme> => {
    if (isMobile && isActiveMenu)
      return {
        ...styles.leftContainer,
        ...styles.menuActive
      }

    if (isOpenMenu && isDesktop && !isMobile)
      return styles.leftContainerOpen

    return styles.leftContainer
  }, [isMobile, isMobile, isActiveMenu, isOpenMenu])

  const activeMenuTitle = useMemo(() => {
    const foundMenuItem = convertedMenuItems.find(item => item.title === path.activeMenuId)
    return foundMenuItem ? foundMenuItem.title : path.activeMenuId
  }, [convertedMenuItems, path.activeMenuId])

  const onCollapseMenu = useCallback(() => {
    setActiveMenu(false)
    setOpenMenu(false)
  }, [])

  const rightContainerSx = useMemo((): SxProps<Theme> => (
    isActiveMenu ? styles.rightContainerLock : styles.rightContainerWrapper
  ), [])

  const isExpertsRoute = useMemo(() => (
    dashboardProps && dashboardProps.userRole === IRole.teacher && dashboardProps.taskType === PeerSteps.FIRST_STEP
  ), [dashboardProps])

  const menuItemTitleMarginBottom = useMemo(() => (
    isMobile ? "15px" : "20px"
  ), [isMobile])

  return (
    <Box sx={styles.container}>
      <Box
        sx={styles.menuItemBurger}
        bgcolor={menuItemBurgerBg}
        onClick={onBurgerItemClick}
      >
        <Burger svgColor={burgerIconColor} />
      </Box>

      <Box sx={styles.gridWrapper}>
        <Box sx={leftContainerSx}>
          <DashboardMenu
            activeMenu={path.activeMenuId}
            status={isOpenMenu}
            items={convertedMenuItems}
            toggleOpenMenu={toggleOpenMenu}
          />


          <ArrowToggler
            status={isOpenMenu}
            toggleOpenMenu={toggleOpenMenu}
          />
        </Box>

        <Box
          sx={styles.rightContainer}
          onClick={onCollapseMenu}
        >
          <Typography
            variant={"h5"}
            mb={menuItemTitleMarginBottom}
            color={"#273AB5"}
            sx={styles.menuTitle}
          >
            {activeMenuTitle}
          </Typography>

          <Box sx={rightContainerSx}>
            <Box>
              <Routes>
                <Route path={paths.teacher.dashboard.overview} element={<Overview />} />
                <Route path={paths.teacher.dashboard.grades} element={<Grades />} />
                <Route path={paths.teacher.dashboard.works} element={<Works />} />
                <Route path={paths.teacher.dashboard.checkings} element={<Checkings />} />
                <Route path={paths.teacher.dashboard.export} element={<ExportGrades />} />

                {isExpertsRoute && (
                  <Route path={paths.teacher.dashboard.experts} element={<Experts />} />
                )}
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
    maxWidth: "2048px",
    margin: "0 auto",
    '@media (min-width: 2048px)': {
      maxWidth: "1800px",
    }
  } as SxProps<Theme>,
  menuItemBurger: {
    position: 'absolute',
    top: '90px',
    right: '25px',
    padding: '8px',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: "1px solid",
    borderColor: "primary.main",
    '@media (min-width: 768px)': {
      display: 'none'
    }
  } as SxProps<Theme>,
  gridWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',

    /** Desktop */
    '@media (min-width: 768px)': {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '70px auto',
      gridTemplateAreas: ' "leftContainer rightContainer"',
      margin: "10px auto 15px",
      padding: '0 15px 0 8px',
    },

    /** > 2k */
    '@media (min-width: 2048px)': {
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
    transition: 'all 0.5s',

    /** Desktop */
    '@media (min-width: 768px)': {
      position: 'absolute',
      top: '-30px',
      left: '-8px',
      display: 'flex',
      flexDirection: 'column',
      gridArea: 'leftContainer',
      width: '54px',
      height: 'auto',
      minHeight: '100vh',
      overflowY: 'auto',
      transform: 'TranslateX(0)',
      transition: 'width 0.5s',
      padding: '30px 8px 0',
      boxShadow: '15px 0px 10px -15px rgba(34, 60, 80, 0.1)',
      backgroundColor: 'white'
    },

    /** > 2k */
    '@media (min-width: 2048px)': {
      width: '100%',
      maxWidth: '355px',
      backgroundColor: '#F5F7FD'
    }
  } as SxProps<Theme>,
  leftContainerOpen: {
    position: 'absolute',
    top: '-30px',
    zIndex: '100',
    width: '250px',
    height: 'auto',
    minHeight: '100vh',
    transition: 'width 0.5s',
    overflowY: 'auto',
    padding: '30px 8px 0',
    boxShadow: '15px 0px 10px -15px rgba(34, 60, 80, 0.1)',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column'
  } as SxProps<Theme>,
  menuActive: {
    transform: 'TranslateX(0)',
  } as SxProps<Theme>,
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'rightContainer',
    overflowY: 'auto',
    maxWidth: "100%",
    minHeight: "100vh",
    padding: '10px 10px 0',
    '@media (min-width: 768px)': {
      margin: "0px 0px 0px 10px",
      padding: '0'
    },
    '@media (min-width: 2048px)': {
      margin: "0px 0px 0px 25px",
    },
  } as SxProps<Theme>,
  rightContainerWrapper: {
    maxHeight: "calc(100vh - 147px)",
    paddingRight: "8px",
    overflowY: "auto",
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
  rightContainerLock: {
    maxHeight: "calc(100vh - 147px)",
    paddingRight: "8px",
    overflowY: "auto",
    touchAction: 'none',
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
  menuTitle: {
  
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
