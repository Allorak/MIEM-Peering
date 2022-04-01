import { FC } from "react";
import { Box, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { Indicators } from "../../../components/icons/Indicatots";

export const Video: FC = () => {
    return (
        <Box sx={styles.wrapper}>
            <Box sx={styles.videoWrapper}>
                <Box sx={styles.videoPlayer}>
                    <Box sx={styles.videoPlayerHeader}>
                        <Indicators />
                    </Box>
                    <Box sx={styles.iFrameBox}>
                        <iframe width="100%" height="400" src="https://www.youtube.com/embed/Jp5_s6ge1E8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const styles = {
    wrapper: {
        my: "50px",
        '@media (max-width: 768px)': {
            my: "25px",
        }
    } as SxProps<Theme>,
    videoPlayer: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '790px',
        width: '100%',
        padding: '20px 10px 10px',
        backgroundColor: 'primary.main',
        borderRadius: '12px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, .25)',
        transform: 'skewY(4deg)',
        '@media (min-width: 768px)': {
            padding: '20px 30px 30px',
        }
    } as SxProps<Theme>,
    videoPlayerHeader: {
        display: 'flex',
        justifyContent: 'flex-start',
        mb: '15px'
    } as SxProps<Theme>,
    videoWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E7FF',
        transform: 'skewY(-4deg)',
        transition: 'border 0.3s ease-in-out',
        border: '0px solid transparent',
        borderRadius: '50px',
        '@media (min-width: 768px)': {
            border: '100px solid transparent'
        }
    } as SxProps<Theme>,
    iFrameBox: {
        display: 'flex',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
    } as SxProps<Theme>,
}