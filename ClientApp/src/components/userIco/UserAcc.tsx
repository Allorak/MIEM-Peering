import { FC, useCallback, useMemo, useState } from "react";
import { matchPath } from "react-router-dom";

import { Popover, Typography, Box, Button } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { palette } from "../../theme/colors";

import { Avatar as AvatarIcon } from "../icons/Avatar"

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IRole } from "../../store/types";
import { unauthorize } from "../../store/auth";


export const UserAcc: FC = () => {
    const dispatch = useAppDispatch()

    const payload = useAppSelector(state => state.userProfile.payload)
    const userRole = useAppSelector(state => state.dashboard.payload?.userRole)
    const path = matchPath('/:role/task/:taskId/*', location.pathname)

    const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLDivElement | undefined>(undefined)

    const role = path?.params?.role
    const taskId = path?.params?.taskId
    const colorUserRole = (userRole === 'Teacher' ?
        { ...styles.roleTeacher, ...styles.role } : userRole === 'Student' ?
            { ...styles.roleStudent, ...styles.role } : userRole === 'Expert' ?
                { ...styles.roleExpert, ...styles.role } : styles.role)

    const onUserProfile = useCallback((event: React.MouseEvent<HTMLDivElement> | null) => {
        setAnchorEl(event?.currentTarget)
    }, [])

    const onCancelUserProfile = useCallback(() => {
        setAnchorEl(undefined)
    }, [])

    const onExit = useCallback(() => {
        dispatch(unauthorize())
    }, [])

    const open = useMemo(() => {
        return Boolean(anchorEl)
    }, [anchorEl])

    const id = useMemo(() => {
        return open ? 'user-profile' : undefined
    }, [open])

    return (
        <Box sx={styles.profileBlock}>
            {role && taskId && userRole && (
                <Box sx={styles.dashboardRoleBlock}>
                    <Typography variant='body1' sx={colorUserRole}>
                        {userRole}
                    </Typography>
                </Box>
            )}

            <Box
                aria-describedby={id}
                onClick={onUserProfile}
                bgcolor={anchorEl ? "#f5f7fd" : "common.white"}
                sx={styles.userPropfileWrapper}
            >

                <Box sx={styles.avatarImage}>
                    {payload && payload.imageUrl ? (
                        <img
                            src={payload.imageUrl}
                            style={{ width: 50, height: 50 }}
                            alt={payload.fullname}
                        />
                    ) : (
                        <AvatarIcon />
                    )}
                </Box>

                <KeyboardArrowDownIcon sx={{
                    alignSelf: "center"
                }} />


            </Box>

            {payload && (
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={onCancelUserProfile}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box p={1.5}>
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            gap={"5px"}
                            border={"1px solid"}
                            borderRadius={"10px"}
                            borderColor={"divider"}
                            p={"5px"}
                        >
                            <Box sx={styles.avatarImage}>
                                {payload && payload.imageUrl ? (
                                    <img
                                        src={payload.imageUrl}
                                        style={{ width: 50, height: 50 }}
                                        alt={payload.fullname}
                                    />
                                ) : (
                                    <AvatarIcon />
                                )}
                            </Box>

                            <Box>
                                <Typography
                                    variant='h6'
                                    sx={styles.username}
                                >
                                    {payload.fullname}
                                </Typography>

                                <a href={`mailto: ${payload.email}`}>
                                    <Typography
                                        variant={"body1"}
                                        sx={styles.useremail}
                                    >
                                        {payload.email}
                                    </Typography>
                                </a>

                                <Typography
                                    variant={"body2"}
                                >
                                    {payload.role === IRole.teacher ? "Преподаватель" : "Студент"}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            display={"flex"}
                            mt={1.5}
                        >
                            <Button
                                sx={styles.userProfileActionBt}
                                startIcon={<HelpOutlineOutlinedIcon color={"primary"} />}
                            >
                                {"Помощь"}
                            </Button>

                            <Button
                                sx={styles.userProfileActionBt}
                                startIcon={<LogoutOutlinedIcon color={"primary"} />}
                                onClick={onExit}
                            >
                                {"Выйти"}
                            </Button>
                        </Box>
                    </Box>
                </Popover>
            )}

        </Box>
    )
}

const styles = {
    userPropfileWrapper: {
        px: "5px",
        borderRadius: "8px",
        display: "flex",
        ":hover": {
            bgcolor: "#f5f7fd",
            cursor: "pointer"
        }
    } as SxProps<Theme>,
    avatarImage: {
        overflow: 'hidden',
        flexShrink: '0',
        width: '50px',
        height: '50px',
        position: 'relative',
        borderRadius: '50%',
    } as SxProps<Theme>,
    username: {
        maxWidth: "250px",
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    } as SxProps<Theme>,
    useremail: {
        maxWidth: "250px",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textDecoration: "underline",
        lineHeight: 1,
        ":hover": {
            cursor: "pointer",
            textDecoration: "underline",
            color: "primary.main"
        }
    } as SxProps<Theme>,
    role: {
        overflow: 'hidden',
        display: 'block',
        whiteSpace: 'nowrap',
        borderRadius: '4px',
        padding: '0 9px'
    } as SxProps<Theme>,
    roleTeacher: {
        color: `${palette.fill.success}`,
        backgroundColor: `${palette.transparent.success}`,
    } as SxProps<Theme>,
    roleExpert: {
        color: `${palette.fill.info}`,
        backgroundColor: `${palette.transparent.info}`,
    } as SxProps<Theme>,
    roleStudent: {
        color: `${palette.fill.secondary}`,
        backgroundColor: `${palette.transparent.secondary}`,
    } as SxProps<Theme>,
    dashboardRoleBlock: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '16px',
    } as SxProps<Theme>,
    usernameBlock: {
        display: 'none',
        overflow: 'hidden',
        alignItems: 'center',
        marginRight: '16px',
        '@media (min-width: 1024px)': {
            display: 'flex',
        },
    } as SxProps<Theme>,
    profileBlock: {
        display: 'flex',
        maxWidth: '330px'
    } as SxProps<Theme>,

    userProfileActionBt: {
        lineHeight: "18px",
        px: "10px",
        textAlign: "start",
        color: palette.active.black,
        fontWeight: 700,
        flex: "1 0 50%",
        ":hover": {
            color: palette.hover.black,
            textDecoration: "underline"
        }
    } as SxProps<Theme>,
}