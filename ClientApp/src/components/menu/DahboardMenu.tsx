import { FC } from "react";
import { NavLink as RouterLink } from 'react-router-dom'
import { Box, SxProps, Theme } from "@mui/system";
import { Link, Tooltip, Typography, useMediaQuery } from "@mui/material";

import { Overview } from "../icons/Overview";
import { Works } from "../icons/Works";
import { Experts } from "../icons/Experts";
import { Grades } from "../icons/Grades";
import { Work } from "../icons/Work";
import { Authorform } from "../icons/Authorform";
import { Checkings } from "../icons/Checkings";
import { Export } from "../icons/Export";

import { IMenu, IMenuTitles } from "../../store/types";
import { palette } from "../../theme/colors";


interface IProps {
  toggleOpenMenu: (status: boolean) => void,
  items: IMenu[],
  activeMenu?: IMenuTitles,
  status: boolean
}

export const DashboardMenu: FC<IProps> = ({
  toggleOpenMenu,
  items,
  activeMenu,
  status
}) => {
  return (
    <Box sx={styles.container}>
      {items.map(item => (
        <Box
          onClick={() => toggleOpenMenu(true)}
          key={item.title}
        >
          <MenuItem
            key={item.title}
            item={item}
            status={status}
            isActive={activeMenu ? activeMenu === item.title : false}
          />
        </Box>
      ))}
    </Box>
  )
}

const MenuItem: FC<{ item: IMenu, isActive: boolean, status: boolean }> = ({
  item,
  isActive,
  status
}) => {
  const matches = useMediaQuery('(min-width:768px) and (max-width:2047px)')

  const MenuIcon: FC<{ objectType: IMenuTitles }> = ({ objectType }) => {
    switch (objectType) {
      case IMenuTitles.OVERVIEW:
        return (<Overview svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.AUTHORFORM:
        return (<Authorform svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.WORKS:
        return (<Works svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.WORK:
        return (<Work svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.EXPERTS:
        return (<Experts svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.GRADES:
        return (<Grades svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.CHECKINGS:
        return (<Checkings svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.EXPORT:
        return (<Export svgColor={isActive ? "white" : "#A4ADC8"} />)
      default: return null
    }
  }

  return (

    <Link
      to={item.path}
      component={RouterLink}
      sx={{textDecoration: "none"}}
    >
      <Tooltip
        title={!status && matches ? item.title : ""}
        placement={"right"}
        arrow
      >
        <Box sx={{ ...styles.generalMenu, ...(isActive ? styles.activeMenu : styles.unActiveMenu) }}>
          <Box sx={styles.iconContainer}>
            <MenuIcon objectType={item.title} />
          </Box>

          <Typography
            variant={"h6"}
            color={"inherit"}
            sx={status && matches ? styles.textRow : !matches ? styles.textRow : styles.hidden}
          >
            {item.title}
          </Typography>
        </Box>
      </Tooltip>
    </Link >
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  } as SxProps<Theme>,
  hidden: {
    display: 'none'
  } as SxProps<Theme>,
  activeMenu: {
    backgroundColor: palette.active.primary,
    color: 'common.white',
    ":hover": {
      backgroundColor: palette.active.primary
    }
  } as SxProps<Theme>,
  unActiveMenu: {
    color: '#A4ADC8',
    ":hover": {
      textDecoration: "underline"
    }
  } as SxProps<Theme>,
  generalMenu: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'flex-start',
    width: 'auto',
    height: "54px",
    padding: "0 8px",
    gap: "19px",
    borderRadius: '4px',
    textDecoration: 'none',
    '@media (min-width: 768px)': {
      width: "100%",
      boxSizing: "border-box",
      padding: "0px 0px 0px 15px",
      ":hover": {
        backgroundColor: "#EBECFC"
      }
    },
    '@media (min-width: 2048px)': {
      justifyContent: 'flex-start',
      width: 'auto',
      padding: "0px 10px 0px 30px",
    },
  } as SxProps<Theme>,
  iconContainer: {
    fontSize: "25px",
    display: "flex",
    overflow: "hidden",
    flexShrink: '0',
    justifyContent: "center",
    width: "25px",
    color: "inherit"
  } as SxProps<Theme>,
  textRow: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '@media (min-width: 2048px)': {
      display: 'block',
    },
  } as SxProps<Theme>,
}