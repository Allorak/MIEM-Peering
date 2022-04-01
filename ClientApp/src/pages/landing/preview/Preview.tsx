import { FC } from "react";
import { Box, Button, Theme, Typography } from "@mui/material";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { SxProps } from "@mui/system";

import { useInView } from 'react-intersection-observer';

import { PreviewLogo } from "./PreviewLogo";

import { palette } from "../../../theme/colors";

interface IProps {
    onLogin: () => void
}

export const Preview: FC<IProps> = ({
    onLogin
}) => {
    const { ref: myRef, inView: myTitleIsVisible } = useInView({ triggerOnce: true })
    const { ref: myRefText, inView: myTextIsVisible } = useInView({ triggerOnce: true })
    const { ref: myRefButton, inView: myButtonIsVisible } = useInView({ triggerOnce: true })

    return (
        <Box sx={styles.preview}>
            <Typography sx={myTitleIsVisible ? styles.previewTitle : { ...styles.previewTitle, ...styles.previewHidden }}
                lineHeight={"64px"}
                height={"100%"}
                variant={"h1"}
                fontWeight={700}
                color={"primary"}
                pl={"5px"}
                ref={myRef}
            >
                {"Система пиринговой проверки"}
            </Typography>

            <Typography
                sx={myTextIsVisible ? styles.previewText : { ...styles.previewText, ...styles.previewHidden }}
                variant={"h5"}
                color={palette.fill.grey}
                pl={"5px"}
                ref={myRefText}
            >
                {"MIEM Peering - система управления обучением с умным механизмом пиринговой проверки."}
            </Typography>

            <Box sx={styles.previewImage}>
                <PreviewLogo />
            </Box>

            <Button
                sx={myButtonIsVisible ? styles.previewButton : { ...styles.previewButton, ...styles.previewHidden }}
                variant={"contained"}
                color={"primary"}
                onClick={onLogin}
                endIcon={<ArrowForwardOutlinedIcon />}
                ref={myRefButton}
            >
                {"Начать"}
            </Button>
        </Box>
    )
}

const styles = {
    preview: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        textAlign: 'left'
    } as SxProps<Theme>,
    previewImage: {
        position: 'static',
        width: '100%',
        height: '100%',
        mb: '30px',
        '@media (min-width: 768px)': {
            position: 'absolute',
            top: '0',
            right: '0',
            width: '50%',
            mb: '0'
        },
    } as SxProps<Theme>,
    previewTitle: {
        opacity: '1',
        maxWidth: '100%',
        mb: '24px',
        '@media (min-width: 768px)': {
            maxWidth: '50%',
        },
        '@media (max-width: 768px)': {
            fontSize: '35px',
            lineHeight: "40px",
            textAlign: "center",
            mb: '15px',
        },
        transition: 'opacity 3s'
    } as SxProps<Theme>,
    previewHidden: {
        opacity: '0'

    } as SxProps<Theme>,
    previewText: {
        opacity: '1',
        maxWidth: '100%',
        mb: '30px',
        transition: 'opacity 3s 1s',
        '@media (min-width: 768px)': {
            mb: '80px',
            maxWidth: '40%',
        },
        '@media (max-width: 768px)': {
            textAlign: "center",
        }
    } as SxProps<Theme>,
    previewButton: {
        opacity: '1',
        transition: 'opacity 3s 2s',
        p: "8px 20px",
        fontSize: "18px",
        maxWidth: '100%',
        boxShadow: "0px 0px 15px 8px rgba(34, 60, 80, 0.09)",
        mt: '10px',
        '@media (min-width: 768px)': {
            mt: '0',
            maxWidth: "fit-content",
        },
        ":hover": {
            boxShadow: "0px 0px 15px 8px rgba(34, 60, 80, 0.09)",
        }
    } as SxProps<Theme>,
}