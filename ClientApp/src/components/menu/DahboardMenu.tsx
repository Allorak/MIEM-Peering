import { FC } from "react";
import { NavLink as RouterLink } from 'react-router-dom'
import { Link, Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';

import { Overview } from "../icons/Overview";
import { Works } from "../icons/Works";
import { Experts } from "../icons/Experts";
import { Grades } from "../icons/Grades";

import { IMenu, IMenuTitles } from "../../store/types";
import { palette } from "../../theme/colors";


interface IProps {
  items: IMenu[],
  activeMenu?: IMenuTitles
}

export const DashboardMenu: FC<IProps> = ({
  items,
  activeMenu
}) => {
  return (
    <Box sx={styles.container}>
      {items.map(item => (
        <MenuItem
          key={item.title}
          item={item}
          isActive={activeMenu ? activeMenu === item.title : false}
        />
      ))}
    </Box>
  )
}

const MenuItem: FC<{ item: IMenu, isActive: boolean }> = ({
  item,
  isActive
}) => {

  const MenuIcon: FC<{ objectType: IMenuTitles }> = ({ objectType }) => {
    switch (objectType) {
      case IMenuTitles.OVERVIEW:
        return (<Overview svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.WORKS:
        return (<Works svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.EXPERTS:
        return (<Experts svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.GRADES:
        return (<Grades svgColor={isActive ? "white" : "#A4ADC8"} />)
      case IMenuTitles.CHECKINGS:
        return (
          <AssignmentTurnedInOutlinedIcon
            color={'inherit'}
            fontSize={'inherit'}
          />
        )
      case IMenuTitles.EXPORT:
        return (
          <ArrowCircleUpIcon
            color={'inherit'}
            fontSize={'inherit'}
          />
        )
      default: return null
    }
  }

  return (
    <Link
      to={item.path}
      component={RouterLink}
      sx={{ ...styles.generalMenu, ...(isActive ? styles.activeMenu : styles.unActiveMenu) }}
    >
      <Box sx={styles.iconContainer}>
        <MenuIcon objectType={item.title} />
      </Box>

      <Typography
        variant={"h6"}
        color={"inherit"}
        sx={styles.textRow}
      >
        {item.title}
      </Typography>
    </Link>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  } as SxProps<Theme>,
  activeMenu: {
    backgroundColor: palette.active.primary,
    color: 'common.white'
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
    justifyContent: 'center',
    width: 'auto',
    height: "54px",
    padding: "0",
    gap: "19px",
    borderRadius: '4px',
    textDecoration: 'none',
    '@media (min-width: 1280px)': {
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
    '@media (min-width: 768px)': {
      display: 'none',
    },
    '@media (min-width: 1280px)': {
      display: 'block',
    },
  } as SxProps<Theme>,
}