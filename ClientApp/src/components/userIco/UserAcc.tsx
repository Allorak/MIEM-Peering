import { FC } from "react";
import { matchPath } from "react-router-dom";

import { Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";

import { Avatar as AvatarIcon } from "../icons/Avatar"

import { useAppSelector } from "../../app/hooks";



export const UserAcc: FC = () => {
    const payload = useAppSelector(state => state.userProfile.payload)
    const userRole = useAppSelector(state => state.dashboard.payload?.userRole)
    const path = matchPath('/:role/task/:taskId/*', location.pathname)
    const role = path?.params?.role
    const taskId = path?.params?.taskId

    return (
        <Box sx={styles.profileBlock}>
            {role && taskId && userRole && (
                <Box sx={styles.dashboardRoleBlock}>
                    <Typography  variant='body1' sx={styles.role}>
                        {userRole}
                    </Typography>
                </Box>
            )}
            <Box sx={styles.usernameBlock}>
                <Typography variant='h6' sx={styles.username}>
                    {payload && payload.fullname ? payload.fullname : "Гость"}
                </Typography>
            </Box>
            {payload && payload.imageUrl ? (
                <Box sx={{ ...styles.avatarImage }}>
                    <img
                        src={payload.imageUrl}
                        style={{ width: 50, height: 50 }}
                        alt="Avatar" />
                </Box>
            ) : (
                <Box sx={{ ...styles.avatarImage }}>
                    <AvatarIcon />
                </Box>
            )
            }
        </Box>
    )
}

const styles = {
    avatarImage: {
        overflow: 'hidden',
        flexShrink: '0',
        width: '50px',
        height: '50px',
        position: 'relative',
        borderRadius: '50%',
        ':hover': {
            cursor: 'pointer',
        }
    } as SxProps<Theme>,
    username: {
        fontSize: '18px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    } as SxProps<Theme>,
    role: {
        overflow: 'hidden',
        display: 'block',
        whiteSpace: 'nowrap',
        color: "primary.main",
        backgroundColor: '#EBECFC',
        borderRadius: '4px',
        padding: '0 9px'
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
    } as SxProps<Theme>
}