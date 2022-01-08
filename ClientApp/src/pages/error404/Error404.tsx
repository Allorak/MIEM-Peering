import { FC, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import { Button, Typography } from '@mui/material';
import { Box, Theme, SxProps} from '@mui/system';

import { useAppSelector } from '../../app/hooks';

import { IconErorr404 } from '../../components/icons/404';

import { paths } from '../../app/constants/paths';
import { IRole } from '../../store/types';

export const Error404: FC = () => {
    const history = useNavigate()

    const userProfile = useAppSelector(state => state.userProfile.payload)

    const goToHome = useCallback(() => {
        console.log('Return to Home')
        if (userProfile)
            history(userProfile.role === IRole.teacher ? paths.teacher.main : paths.student.main)
        else history(paths.root)
    }, [userProfile])
    
    return (
        <Box sx={styles.container}>
            <Box sx={styles.root}>
                <Box sx={styles.logo}>
                    <IconErorr404 />
                </Box>
                <Box sx={styles.infoblock}>
                    <Box sx={styles.infoblock__description}>
                        <Box sx={{mb: '30px' }}>
                            <Typography variant='h5' sx={{ color: '#273AB5'}}>
                                {"Увы, но эта страница где-то затерялась в галактике Интернета"}
                            </Typography>
                        </Box>
                        <Box sx={{mb: '60px' }}>
                            <Typography variant='body1' sx={{ color: '#17307A', lineHeight: '24px'}} >
                                {"Вы находитесь здесь, потому что ввели адрес страницы, которая уже не существует или была перемещена по другому адресу"}
                            </Typography>
                        </Box>
                    </Box>
                    <Button variant='contained'
                            sx={styles.infoblock__button}
                            onClick={goToHome}
                    >
                        {"Вернуться на Главную"}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        mx: '15px'
    } as SxProps<Theme>,
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        maxWidth: '460px',
        height: '465px',
        backgroundColor: theme => theme.palette.common.white,
        py: '35px',
        px: '35px',
        textAlign: 'center',
        borderRadius: '12px',
        '@media (min-width: 567px)': {
            py: '50px',
            px: '50px'
        },
        '@media (min-width: 767px)': {
            flexDirection: 'row',
            height: '400px',
            maxWidth: '1000px',
            py: '40px',
            px: '90px',
          }
    } as SxProps<Theme>,
    infoblock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        '@media (min-width: 767px)': {
            justifyContent: 'flex-start',
            alignItems: 'start',
            height: 'auto',
            marginLeft: '50px'
        }
    } as SxProps<Theme>,
    infoblock__description: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'start',
    } as SxProps<Theme>,
    infoblock__button: {
        width: '100%',
        whiteSpace: 'nowrap',
        '@media (min-width: 767px)': {
            maxWidth: '250px'
        }
    } as SxProps<Theme>,
    logo: {
        position: 'absolute',
        top: '240px',
        flexShrink: '0.5',
        maxWidth: '250px',
        width: '100%',
        '@media (min-width: 567px)': {
            top: '200px',
        },
        '@media (min-width: 767px)': {
            position: 'static',
            maxWidth: '512px',
        }
    } as SxProps<Theme>,
}
