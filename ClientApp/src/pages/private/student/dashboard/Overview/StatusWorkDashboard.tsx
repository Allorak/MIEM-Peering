import { FC, useCallback } from "react";

import { Box, SxProps, Theme } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { palette } from "../../../../../theme/colors";

import { paths } from "../../../../../app/constants/paths";

import { generatePath, matchPath, useNavigate } from "react-router-dom";

interface IProps {
    submissionStatus: boolean
}

export const StatusWorkDashboard: FC<IProps> = ({
    submissionStatus
}) => {
    const history = useNavigate()
    const status = (submissionStatus === true ? 'Работа успешно сдана' : 'Вашу работу не удалось обнаружить')
    const statusButton = (submissionStatus === true ? 'Посмотреть работу' : 'Сдать работу')
    const statusStyle = (submissionStatus === true ? { ...styles.redirectButton, ...styles.redirectButtonSuccess } : { ...styles.redirectButton, ...styles.redirectButtonWarning })
    const path = matchPath('st/task/:taskId/overview', location.pathname)

    const taskId = path?.params?.taskId

    const onRedirect = useCallback(() => {
        const authorformPath = generatePath(paths.student.dashboard.authorform, { taskId })
        const workPath = generatePath(paths.student.dashboard.work, { taskId })
        history(submissionStatus === true ? workPath : authorformPath)
    }, [submissionStatus, taskId])

    return (
        <Box sx={styles.wrapper}>
            <Typography variant={'h6'}>
                {"Статус работы"}
            </Typography>
            <Box sx={styles.cardContent}>
                <Typography variant='body1' sx={styles.cardText}>
                    {status}
                </Typography>
                <Button
                    variant='contained'
                    sx={statusStyle}
                    onClick={onRedirect}>
                    {statusButton}
                </Button>
            </Box>
        </Box >
    )
}

const styles = {
    wrapper: {
        backgroundColor: 'common.white',
        borderRadius: '8px',
        padding: '15px',
        display: 'flex',
        height: "100%",
        boxSizing: "border-box",
        flexDirection: 'column',
        boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
        gap: "10px",
    } as SxProps<Theme>,
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    } as SxProps<Theme>,
    redirectButton: {
        marginTop: "12px",
        display: "flex",
        padding: "7px 20px",
        justifyContent: "flex-end"
    } as SxProps<Theme>,
    redirectButtonWarning: {
        backgroundColor: 'error.main',
        ":hover": {
            backgroundColor: palette.hover.danger
        }
    } as SxProps<Theme>,
    redirectButtonSuccess: {
        backgroundColor: 'success.main',
        ":hover": {
            backgroundColor: palette.hover.success
        }
    } as SxProps<Theme>,
    cardText: {
        textAlign: 'center'
    } as SxProps<Theme>,
}