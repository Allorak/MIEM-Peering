import { FC, useCallback, useMemo, useState } from "react";
import { Theme } from "@emotion/react";
import { useMediaQuery, Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { IMenu, IMenuTitles } from "../../store/types";
import { ArrowToggler } from "../arrowToggler";
import { Burger } from "../icons/Burger";
import { DashboardMenu } from "../menu/DahboardMenu";

import * as globalStyles from "../../const/styles";


interface IProps {
  convertedMenuItems: IMenu[],
  activeMenuId: IMenuTitles | undefined
}

export const DashboardRouter: FC<IProps> = ({
  convertedMenuItems,
  activeMenuId,
  children
}) => {
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false)
  const [isActiveMenu, setActiveMenu] = useState(false)

  const isMobile = useMediaQuery('(max-width:767px)')
  const isDesktop = useMediaQuery('(max-width:2047px)')

  const toggleOpenMenu = useCallback((openMenu: boolean) => {
    if (isMobile) {
      setActiveMenu(!openMenu)
    }
    if (!isMobile && isDesktop) {
      setOpenMenu(!openMenu)
    }
  }, [isMobile, isDesktop])

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
    const foundMenuItem = convertedMenuItems.find(item => item.title === activeMenuId)
    return foundMenuItem ? foundMenuItem.title : activeMenuId
  }, [convertedMenuItems, activeMenuId])

  const onCollapseMenu = useCallback(() => {
    setActiveMenu(false)
    setOpenMenu(false)
  }, [])

  const rightContainerSx = useMemo((): SxProps<Theme> => (
    isActiveMenu ? styles.rightContainerLock : styles.rightContainerWrapper
  ), [])

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
            activeMenu={activeMenuId}
            status={isOpenMenu}
            items={convertedMenuItems}
            toggleOpenMenu={toggleOpenMenu}
          />

          <ArrowToggler
            status={isOpenMenu || isMobile}
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
          >
            {activeMenuTitle}
          </Typography>

          <Box sx={rightContainerSx}>
            {children}
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
}