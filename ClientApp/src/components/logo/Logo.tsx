import { FC } from "react"
import { Box, Theme } from "@mui/system"
import { SxProps } from '@mui/system';
import { useLocation, matchPath } from 'react-router-dom'

import { paths } from "../../app/constants/paths";

import { EStudieses } from "../icons/EStudieses";
import { Logo as Logotype } from "../icons/Logo";


export const Logo: FC = () => {
    const location = useLocation();
    const path = matchPath(paths.teacher.main, location.pathname)
        ?? matchPath(paths.teacher.courses.course, location.pathname)
        ?? matchPath(paths.student.main, location.pathname)
        ?? matchPath(paths.student.courses.course, location.pathname)

    return (
        <Box sx={styles.root} >
            <Box sx={styles.logotype}>
                <Logotype />
            </Box>
            <Box sx={path ? styles.logoTextContainerHidden : styles.logoTextContainer}>
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
    logotype: {
        marginRight: '12px'
    } as SxProps<Theme>,
    logoTextContainer: {
        display: 'flex',
        maxWidth: '100px',
        '@media (min-width: 700px)': {
            maxWidth: '120px'
        }
    } as SxProps<Theme>,
    logoTextContainerHidden: {
        '@media (max-width: 700px)': {
            display: 'none',
        }
    } as SxProps<Theme>,
}
