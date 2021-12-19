
import { Box, SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { Logo } from "../logo";
import { Navbar } from "../navbar";
import { UserAcc } from "../userIco";
import * as constStyles from "../../const/styles"
import { palette } from "../../theme/colors";
import { useNavigate } from "react-router-dom";
import { usePrivatePathT } from "../../app/hooks/usePrivatePathT";
import { paths } from "../../app/constants/paths";

export const PrivateHeader: FC = () => {
    const history = useNavigate()
    const { path: pathT } = usePrivatePathT()
    
    return (
        <Box sx={styles.wrapper}>
            {/* <Box sx={constStyles.container}> */}
                <Box sx={styles.root}>
                    <Box sx={styles.leftContainer}
                        onClick={() => history(pathT ? paths.teacher.main : paths.student.main)}
                    >
                        <Logo/>
                        <Box sx={styles.navbarBlock}>
                            <Navbar />
                        </Box>
                    </Box>
                    <Box sx={styles.rightItem}>
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
        padding: '15px 20px',
        backgroundColor: 'common.white',
        borderBottom: `1px solid ${palette.divider}`
    } as SxProps<Theme>,
    root: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    } as SxProps<Theme>,
    navbarBlock: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '450px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        '@media (min-width: 700px)': {
            marginLeft: '40px',
        }
    } as SxProps<Theme>,
    rightItem: {
        width: '27%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    } as SxProps<Theme>,

    leftContainer: {
        display: 'flex',
        width: '73%',
        margin: '0px 16px 0px 0px',
    } as SxProps<Theme>

}