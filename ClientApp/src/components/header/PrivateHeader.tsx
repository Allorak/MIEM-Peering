
import { Box, SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { Logo } from "../logo";
import { Navbar } from "../navbar";
import { UserAcc } from "../userIco";
import * as constStyles from "../../const/styles"
import { palette } from "../../theme/colors";

export const PrivateHeader: FC = () => {
    return (
        <Box sx={styles.wrapper}>
            {/* <Box sx={constStyles.container}> */}
                <Box sx={styles.root}>
                    <Box sx={styles.logoContainer}>
                        <Logo />
                    </Box>
                    <Box sx={styles.rightItem}>
                        <Box>
                            <Navbar />
                        </Box>
                        <Box>
                            <UserAcc />
                        </Box>
                    </Box>
                {/* </Box> */}
            </Box>
        </Box>
    )
}

const styles = {
    wrapper: {
        margin: '0px 0px 0px 0px',
        '@media (max-width: 700px)': {
            margin: '10px 0px 15px 0px'
        },
        padding: '15px 20px',
        backgroundColor: 'common.white',
        borderBottom: `1px solid ${palette.divider}`,
        // position: 'fixed',
        // zIndex: 1000,
        // width: '100%'
    } as SxProps<Theme>,
    root: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    } as SxProps<Theme>,
    rightItem: {
        // flex: '1 1 1088px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    } as SxProps<Theme>,

    logoContainer: {
        margin: '0px 40px 0px 0px',
        '@media (max-width: 700px)': {
            margin: '0px'
        }
    } as SxProps<Theme>

}