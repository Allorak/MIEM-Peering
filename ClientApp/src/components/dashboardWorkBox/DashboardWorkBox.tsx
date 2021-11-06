import { CircularProgress, Slide, Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { IError } from "../../store/types";

interface IProps {
    error?: IError
    isLoading: boolean
    isLock?: boolean
}

export const DashboardWorkBox: FC<IProps> = ({
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
        console.log("WorkBox Error:", error)

    if (isLoading && isLock) {
        return (
            <Box sx={styles.wrapper}>
                <Box sx={styles.loadingContainer}>
                    <CircularProgress sx={styles.progress} />
                    <Typography variant='h6'>
                        {"Загрузка..."}
                    </Typography>
                </Box>
            </Box>
        )
    }

    if (isLoading) {
        return (
            <Box sx={styles.wrapper}>
                <Box sx={styles.loadingContainer}>
                    <CircularProgress sx={styles.progress} />
                    <Typography variant='h6'>
                        {"Загрузка..."}
                    </Typography>
                </Box>
            </Box>
        )
    }
    return null
}

const styles = {
    progress: {
        color: "primary.main",

    } as SxProps<Theme>,

    wrapper: {
        width: "100%",
        marginTop: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
    } as SxProps<Theme>,
    loadingContainer: {
        display: "flex",
        alignItems: "center",
        height: "70px",
        gap: "10px"
    } as SxProps<Theme>,
}