import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Theme, SxProps } from '@mui/system';
import LoginIcon from '@mui/icons-material/Login';

import { Logo } from '../../components/logo';
import { Button, Container, } from '@mui/material';

import { Preview } from './preview';
import { Roles } from './roles';
import { Functional } from './functional';
import { Video } from './video';
import { Footer } from './footer';

import { paths } from '../../app/constants/paths';
import { scrollStyles } from '../../const/styles';

export const Landing: FC = () => {
    const history = useNavigate()

    const goToLogin = useCallback(() => {
        history(paths.login)
    }, [])

    return (
        <Box sx={styles.wrapper}>
            <Box
                component={"section"}
                sx={styles.previewSection}
            >
                <Box sx={styles.firstSectionWrapper}>
                    <Box bgcolor={"common.white"}
                        boxShadow={"0px 10px 10px -10px rgba(34, 60, 80, 0.2)"}
                    >
                        <Container>
                            <Box sx={styles.header}>
                                <Logo />
                                <Button
                                    variant={"contained"}
                                    sx={{ p: "5px 15px" }}
                                    onClick={goToLogin}
                                >
                                    {"Авторизоваться"}
                                </Button>
                            </Box>
                        </Container>
                    </Box>


                    <Box
                        flex={"1 1 100%"}
                        display={"flex"}
                        alignItems={"center"}
                    >
                        <Box
                            flex={"1 1 100%"}
                        >
                            <Container>
                                <Preview
                                    onLogin={goToLogin}
                                />
                            </Container>
                        </Box>
                    </Box>

                </Box>
            </Box >

            <Box
                component={"section"}
                sx={styles.section}
                bgcolor={"common.white"}
                p={"20px 0"}
                minHeight={"fit-content"}
            >
                <Container>
                    <Roles />
                </Container>
            </Box>

            <Box
                component={"section"}
                sx={styles.section}
            >
                <Container>
                    <Functional />
                </Container>
            </Box >

            <Box
                component={"section"}
                sx={styles.section}
                bgcolor={"common.white"}
            >
                <Container>
                    <Video />
                </Container>
            </Box>

            <Box>
                <Footer />
            </Box>
        </Box >


    )
}

const styles = {
    previewSection: {
        minHeight: "100vh"
    } as SxProps<Theme>,
    section: {
        p: "20px 0px"
    } as SxProps<Theme>,
    wrapper: {
        ...scrollStyles,
        overflowY: 'auto',
        width: "100%",
        maxHeight: "100vh"
    } as SxProps<Theme>,
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
    } as SxProps<Theme>,

    firstSectionWrapper: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
    } as SxProps<Theme>,
}