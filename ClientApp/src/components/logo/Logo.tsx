import { Typography } from "@mui/material"
import { Box, Theme } from "@mui/system"
import { FC } from "react"
import logo from "../../img/logo.svg"
import { SxProps } from '@mui/system';
import { EStudieses } from "../icons/EStudieses";

export const Logo: FC = () => {
    return (
        <Box sx={styles.root} >
            <img src={logo} alt="Peer Assessment Tools" />
            <Box sx={styles.logoTextContainer}>
                <EStudieses />
            </Box>
        </Box>
    )
}

const styles = {
    root: {
        display: 'inline-flex',
        alignItems: 'center',
        'img': {
            marginRight: '18.66px'
        }
    } as SxProps<Theme>,
    logoTextContainer: {
       '@media (max-width: 700px)': {
           display: 'none',
           opacity: '0',
           width: '0',
           height: '0'
       }
    } as SxProps<Theme>,
}
