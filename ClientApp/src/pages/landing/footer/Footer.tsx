import { FC } from "react";
import { Box, Button, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { WikiIcon } from "../../../components/icons/Wiki";
import { ZulipIcon } from "../../../components/icons/Zulip";

import { palette } from "../../../theme/colors";

export const Footer: FC = () => {
    return (
        <Box sx={styles.wrapper}>
            <Box sx={styles.footer}>
                <Typography
                    sx={styles.footerTitle}
                    variant={"h5"}
                    fontWeight={600}
                    color={"primary.main"}
                    textAlign={"center"}
                    >
                    {'Мы всегда открыты к новым предложениям и знакомствам'}
                </Typography>
                <Typography
                    sx={styles.footerText}
                    variant={"body1"}
                    color={palette.fill.grey}>
                    {'Если у вас остались вопросы после ознакомления с данным проектом, то вы можете связать с разработчиками в Zulip, а также ознакомиться с документацией в MIEM WIKI.'}
                </Typography>
                <Box sx={styles.footerBtns}>
                    <Button variant='outlined'
                        startIcon={<WikiIcon />}
                        sx={styles.footerBtnLink}
                        target={"_blank"}
                        href={"https://wiki.miem.hse.ru/ru/Projects/401"}
                    >
                        {'МИЭМ - WIKI'}
                    </Button>
                    <Button variant='outlined'
                        startIcon={<ZulipIcon />}
                        sx={styles.footerBtnLink}
                        target={"_blank"}
                        href={"https://chat.miem.hse.ru/#narrow/stream/1395-401-.D0.9F.D0.B8.D1.80.D0.B8.D0.BD.D0.B3"}
                    >
                        {'Zulip'}
                    </Button>
                </Box>
                <Box>
                    <Typography>
                        {'Copyright © 2022 «MIEM Peering»'}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

const styles = {
    footerTitle: {
        mb: '20px'
    } as SxProps<Theme>,
    footerText: {
        textAlign: 'center',
        mb: '40px',
        maxWidth: '500px'
    } as SxProps<Theme>,
    footerBtns: {
        display: 'flex',
        flexFlow: 'wrap',
        justifyContent: 'center',
        mb: '20px'
    } as SxProps<Theme>,
    footerBtnLink: {
        minWidth: '220px;',
        margin: '8px',
    } as SxProps<Theme>,
    footer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: '10px'
    } as SxProps<Theme>,
    wrapper: {
        mt: "50px",
        mb: '10px',
        px: "15px",
        '@media (max-width: 768px)': {
            mt: "25px",
        }
    } as SxProps<Theme>,
}