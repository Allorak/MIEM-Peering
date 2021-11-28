import { FC, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { Button, Checkbox, TextField, Typography } from '@mui/material';
import { Box, Theme, SxProps } from '@mui/system';

import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { fetchGAuth } from '../../store/googleAuth/thunks/googleAuth';
import { actions as userProfileActions } from "../../store/userProfile";
import { actions as authActions } from "../../store/auth";

import { Logo } from '../../components/logo';
import GoogleLogo from '../../img/google-logo.svg'

import { palette } from '../../theme/colors';

import { paths } from '../../app/constants/paths';
import { GoogleAuthStatus } from '../../store/types';

import clientID from '../../secret/GoogleClientID';


export const Login: FC = () => {
    const dispatch = useAppDispatch()

    const history = useNavigate()

    const isAuthorized = useAppSelector(state => state.gAuth.isAuthorized)
    const isAuthorizing = useAppSelector(state => state.gAuth.isAuthorizing)
    const payload = useAppSelector(state => state.gAuth.payload)

    useEffect(() => {
        if (payload && payload.status === GoogleAuthStatus.newUser) {
            history(paths.registration.main)
        }

        if (payload && payload.status === GoogleAuthStatus.registeredUser) {
            dispatch(userProfileActions.userProfileSuccess(payload.user))
            console.log("REGISTERED")
        }
    }, [payload])

    const onGoogleLoginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('accessToken' in response) {
            console.log(response, "Google response")
            console.log(response.accessToken, 'Google access token')
            dispatch(fetchGAuth(response.tokenId))
        }
    }

    const onGoogleLoginFail = (e: any) => {
        console.log(e.error)
    }

    return (
        <Box sx={styles.container}>
            <Box sx={styles.root}>
                <Logo />
                <Box sx={styles.headingTitle}>
                    <Typography variant='h4'>
                        {"Вход"}
                    </Typography>
                    <Typography variant='body1'>
                        {"Пожалуйста, войдите в систему, чтобы получить доступ ко всем функциям"}
                    </Typography>
                </Box>
                <GoogleLogin
                    clientId={clientID}
                    render={renderProps => (
                        <Button
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            startIcon={
                                <img src={GoogleLogo} alt='' />
                            }
                            variant='outlined'
                            sx={{ width: '100%' }}
                        >
                            {"Войти через Google"}
                        </Button>
                    )}
                    onSuccess={onGoogleLoginSuccess}
                    onFailure={onGoogleLoginFail}
                    cookiePolicy={'single_host_origin'}
                />
                <Box sx={styles.orSeperate}>
                    <span />
                    <Typography variant='body1'
                        sx={{ textTransform: 'uppercase', mx: '24px' }}
                    >
                        {"или"}
                    </Typography>
                    <span />
                </Box>
                <Box component='form'>
                    <Box sx={styles.formItemContainer}>
                        <Typography variant='body1'
                            sx={styles.textFieldTitle}
                        >
                            {"E-mail"}
                        </Typography>
                        <TextField
                            variant='outlined'
                            type={'email'}
                            placeholder={'e.g example@mail.com'}
                        />
                    </Box>
                    <Box sx={styles.formItemContainer}>
                        <Typography variant='body1'
                            sx={styles.textFieldTitle}
                        >
                            {"Пароль"}
                        </Typography>
                        <TextField
                            variant='outlined'
                            type={'password'}
                            placeholder={'Ваш пароль'}
                        />
                    </Box>
                    <Box sx={styles.keepSignIn}>
                        <Checkbox />
                        <Typography
                            sx={styles.keepMeText}
                        >
                            {"Запомнить меня"}
                        </Typography>
                        <Typography
                            variant='button'
                            sx={{ flex: '1 0 auto' }}
                        >
                            {"Забыли пароль"}
                        </Typography>
                    </Box>
                    <Button variant='contained'
                        sx={{ width: '100%' }}
                    >
                        {"Войти"}
                    </Button>
                    <Typography variant='body1'
                        sx={{ lineHeight: '26px', marginTop: '18px' }}
                    >
                        {"Нет учетной записи?"}
                        <Typography variant='button'
                            sx={{
                                lineHeight: '26px',
                                fontWeight: 600,
                                color: "#2F3CED",
                                paddingLeft: '10px'
                            }}
                        >
                            {"Зарегистрироваться"}
                        </Typography>

                    </Typography>
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
        position: 'absolute',
        width: '100%'
    } as SxProps<Theme>,
    root: {
        position: 'relative',
        maxWidth: '548px',
        backgroundColor: theme => theme.palette.common.white,
        py: '40px',
        px: '50px',
        textAlign: 'center',
        borderRadius: '4px'
    } as SxProps<Theme>,
    headingTitle: {
        marginTop: '31.14px',
        textAlign: 'left',
        marginBottom: '28px'
    } as SxProps<Theme>,
    orSeperate: {
        display: 'flex',
        alignItems: 'center',
        my: '20px',
        'span': {
            display: 'block',
            height: '1px',
            flex: "1 1 100%",
            backgroundColor: palette.divider
        }
    } as SxProps<Theme>,
    textFieldTitle: {
        fontWeight: '600',
        lineHeight: '17px',
        color: theme => theme.palette.common.black,
        textAlign: 'left',
        marginBottom: '12px'
    } as SxProps<Theme>,
    formItemContainer: {
        marginBottom: '22px'
    } as SxProps<Theme>,
    keepSignIn: {
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        "& .MuiCheckbox-root": {
            marginRight: '10px'
        }
    } as SxProps<Theme>,
    keepMeText: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '22px',
        color: '#657297',
        flex: '0 1 100%',
        textAlign: 'left'
    } as SxProps<Theme>

}
