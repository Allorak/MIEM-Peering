import { FC } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { UncheckedFile } from "../icons/UncheckedFile";

import { IStatusTask } from "../../store/types";

interface IProps extends IStatusTask { }

export const UncheckedFileCard: FC<IProps> = ({
    submissionsToCheck: totalCount,
    submissionsNumber
}) => {
    const currentUncheckedCount = totalCount - submissionsNumber
    return (
        <Box>
            <Box sx={styles.wrapper}>
                <Box>
                    <Box sx={styles.cardContent}>
                        <Box sx={styles.cardHeader}>
                            <Box sx={styles.typeIcon}>
                                <UncheckedFile />
                            </Box>
                        </Box>
                        <Box sx={styles.cardBody}>
                            <Typography variant={'h5'}>
                                {currentUncheckedCount}
                            </Typography>
                            <Typography variant={'body1'}>
                                {"Осталось проверить"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

const styles = {
    wrapper: {
        backgroundColor: 'common.white',
        borderRadius: '8px',
        padding: '20px 15px',
        height: '100px',
        display: 'flex',
        alignItems: "center",
        boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
        gap: "10px"
    } as SxProps<Theme>,
    cardHeader: {
        display: 'flex',
        justifyContent: 'center',
        mr: '24px'
    } as SxProps<Theme>,
    cardBody: {
    } as SxProps<Theme>,
    typeIcon: {
        display: 'flex',
        width: '60px',
        flexShrink: 0
    } as SxProps<Theme>,    
    cardContent: {
        display: "flex",
    } as SxProps<Theme>,
}