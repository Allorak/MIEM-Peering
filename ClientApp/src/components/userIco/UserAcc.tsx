import { Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import Avatar from '../../img/ico/avatar.svg'

export const UserAcc: FC = () => {

    const payload = useAppSelector(state => state.userProfile.payload)
    console.log(payload?.imageUrl, "IMG")
    console.log(payload?.fullname, "FULLNAME")
    return (
        <Box sx={styles.profileBlock}>
            <Box sx={styles.usernameBlock}>
                <Typography variant='h6' sx={styles.username}>
                    {payload && payload.fullname ? payload.fullname : "Гость"}
                </Typography>
            </Box>
            <Box sx={{...styles.avatarImage, backgroundImage: `url(${payload && payload.imageUrl ? payload.imageUrl : Avatar})`}}/>
        </Box>
    )
}

const styles = {
    avatarImage: {
        flexShrink: '0',
        height: '50px',
        width: '50px',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundSepeat: 'no-repeat',
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
        maxWidth: '270px'
    } as SxProps<Theme>
}
