import { CircularProgress, Slide, Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { IError } from "../../store/types";

interface IProps {
    error?: IError
    isLoading: boolean
    isLock?: boolean
}

export const WorkBox: FC<IProps> = ({
    error,
    isLoading,
    isLock,
    children
}) => {

    if (!isLoading && !error && (isLock === undefined || (isLock === false)) && children) {
        return (
            <Slide direction='up' in={true}>
                <Box>{children}</Box>
            </Slide>
        )
    }

    if (error)
        console.log("API Error:", error)

    if (isLoading && isLock) {
        return (
            <Box>
                <Box sx={styles.root}>
                    <CircularProgress sx={styles.progress} />
                    <Typography variant='h6'
                        sx={{ color: "common.white" }}
                    >
                        Загрузка...
                    </Typography>
                </Box>
                {children}
            </Box>
        )
    }

    if (isLoading) {
        return (
            <Box sx={styles.root}>
                <CircularProgress sx={styles.progress} />
                <Typography variant='h6'
                    sx={{ color: "common.white" }}
                >
                    Загрузка...
                </Typography>
            </Box>
        )
    }
    return null
}

const styles = {
    progress: {
        color: "primary.main",

    } as SxProps<Theme>,
    root: {
        width: '100%',
        position: 'fixed',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        top: '0',
        left: '0',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5001,
        backgroundColor: 'rgba(0,0,0, 0.77)'
    } as SxProps<Theme>,


}