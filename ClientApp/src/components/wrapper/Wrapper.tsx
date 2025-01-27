import { FC } from "react";
import { SxProps } from '@mui/system';
import { Box, Theme } from "@mui/material";

import { palette } from '../../theme/colors';


export const Wrapper: FC = ({
    children
}) => {
    return (
        <Box sx={styles.root}>
            {children}
        </Box>
    )
}

const styles = {
    root: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',
        zIndex: '-100',
        top: 0,
        left: 0,
        backgroundColor: palette.containerBg.light
    } as SxProps<Theme>,
}
