import { FC } from "react";

import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";


interface IProps {
    submissionStatus: boolean
}

export const StatusWorkDashboard: FC<IProps> = ({
    submissionStatus
}) => {
    const status = (submissionStatus === false ? 'Вам необходимо сдать работу' : 'Ваша работа сдана')

    return (
        <Box sx={styles.wrapper}>
            <Typography variant={'h6'}>
                {"Статус работы"}
            </Typography>
            <Box sx={styles.cardHeader}>
                <Box>
                    <Typography variant='body1' sx={{ ...styles.statusNameColor, ...styles.statusName }}>
                        {status}
                    </Typography>
                </Box>
            </Box>
        </Box >
    )
}

const styles = {
    wrapper: {
        backgroundColor: 'common.white',
        borderRadius: '4px',
        padding: '15px',
        display: 'flex',
        height: "100%",
        boxSizing: "border-box",
        flexDirection: 'column',
        boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
        gap: "10px",
    } as SxProps<Theme>,
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    } as SxProps<Theme>,
    statusName: {
        overflow: 'hidden',
        display: 'block',
        textAlign: 'center',
        borderRadius: '4px',
        padding: '6px 12px'
    } as SxProps<Theme>,
    statusNameColor: {
        color: theme => theme.palette.primary.main,
        backgroundColor: '#EBECFC',
    } as SxProps<Theme>,
}