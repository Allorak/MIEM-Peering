import { FC, useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom"
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { Button, CircularProgress, Slide, TextField, Typography } from '@mui/material';
import { Box, Theme, SxProps } from '@mui/system';
import { TransitionProps } from '@mui/material/transitions';
import Cookies from 'universal-cookie';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useController, useForm } from 'react-hook-form';

import { fetchGAuth } from '../../store/googleAuth/thunks/googleAuth';

import { Logo } from '../../components/logo';
import { GoogleLogo as GoogleIcon } from '../../components/icons/GoogleLogo';

import { palette } from '../../theme/colors';

import { paths } from '../../app/constants/paths';
import { GoogleAuthStatus, ICookiesToken, IRole, IUserAuthorization } from '../../store/types';
import { actions, fetchAuthorizationUser } from '../../store/authorizationUser';

import clientID from '../../secret/GoogleClientID';
import { Popup } from '../../components/popup';
import { Registration } from '../private/registration';

import { scrollStyles } from '../../const/styles';
import { FormReValidateMode, FormValidateMode } from '../../const/common';
import { actions as regActions } from '../../store/registrationUser';
import React from 'react';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const Login: FC = () => {
    const cookies = new Cookies();
    const dispatch = useAppDispatch()

    const history = useNavigate()

    const [popupStatus, setPopupStatus] = useState(false)
    const isAuthorized = useAppSelector(state => state.authorizationUser.isAuthorized)
    const isAuthorizing = useAppSelector(state => state.authorizationUser.isAuthorizing)
    const error = useAppSelector(state => state.authorizationUser.error)
    const payload = useAppSelector(state => state.gAuth.payload)
    const userProfile = useAppSelector(state => state.userProfile.payload)
    const accessToken = useAppSelector(state => state.auth.accessToken)

    const registerFlag = useAppSelector(state => state.registrationUser.payload)
    const isRegistering = useAppSelector(state => state.registrationUser.isRegistering)

    useEffect(() => {
        const tokenByCookies = cookies.get(ICookiesToken.key)
        dispatch(actions.resetAuth())
        dispatch(regActions.resetReg())

        if (tokenByCookies) {
            history(paths.root, {
                replace: true
            })
        }
    }, [])

    useEffect(() => {
        if (registerFlag && popupStatus) {
            setPopupStatus(!popupStatus)
        }
    }, [registerFlag])

    useEffect(() => {
        if (!popupStatus) {
            dispatch(regActions.resetReg())
        }
    }, [popupStatus])

    useEffect(() => {
        if (isAuthorized) {
            dispatch(actions.resetAuth())
            dispatch(regActions.resetReg())
            history(paths.root, {
                replace: true
            })
        }
    }, [isAuthorized])

    const onGoogleLoginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('accessToken' in response) {
            dispatch(fetchGAuth(response.tokenId))
        }
    }

    const onGoogleLoginFail = (e: any) => {
        alert('Google Auth Error')
        console.log('Google login fail:', e.error)
    }

    const { handleSubmit, control } = useForm<IUserAuthorization>({
        mode: FormValidateMode,
        reValidateMode: FormReValidateMode,
        defaultValues: {
            email: "",
            pass: ""
        }
    })

    const { field: passProps } = useController({ name: "pass", control })
    const { field: emailProps } = useController({ name: "email", control })

    const onSubmit = useCallback((formResponses: IUserAuthorization) => {
        dispatch(fetchAuthorizationUser(formResponses))
    }, [])

    if (payload && payload.status === GoogleAuthStatus.newUser) {
        return (
            <Navigate
                to={paths.registration.main}
                replace
            />
        )
    }

    if (payload && payload.status === GoogleAuthStatus.registeredUser && accessToken && userProfile) {
        return (
            <Navigate
                to={userProfile.role === IRole.teacher ? paths.teacher.main : paths.student.main}
                replace
            />
        )
    }

    return (
        <>
            <Popup
                title={`Регистрация`}
                open={popupStatus}
                onCloseHandler={setPopupStatus}
                loading={isRegistering}
                PaperProps={{ sx: { flex: '0 1 100%' } }}
                dialogContentSx={{ padding: '30px', ...scrollStyles, backgroundColor: "white" }}
                TransitionComponent={Transition}
                transitionDuration={800}
            >
                <Registration />
            </Popup>
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
                        // buttonText="Login"
                        onSuccess={onGoogleLoginSuccess}
                        onFailure={onGoogleLoginFail}
                        cookiePolicy={'single_host_origin'}
                        render={renderProps => (
                            <Button
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={
                                    <GoogleIcon />
                                }
                                variant='outlined'
                                sx={{ width: '100%' }}
                            >
                                {"Войти через Google"}
                            </Button>
                        )}
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
                    <Box component='form'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {error && (
                            <Box sx={styles.formItemContainer}>
                                <Typography
                                    variant='body1'
                                    color={'error.main'}
                                    fontWeight={700}
                                >
                                    {error.message}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={styles.formItemContainer}>
                            <Typography variant='body1'
                                sx={styles.textFieldTitle}
                            >
                                {"E-mail"}
                            </Typography>
                            <TextField
                                name='email'
                                variant='outlined'
                                type={'email'}
                                placeholder={'e.g example@mail.com'}
                                InputProps={emailProps}
                            />
                        </Box>
                        <Box sx={styles.formItemContainer}>
                            <Typography variant='body1'
                                sx={styles.textFieldTitle}
                            >
                                {"Пароль"}
                            </Typography>
                            <TextField
                                name='pass'
                                variant='outlined'
                                type={'password'}
                                placeholder={'Ваш пароль'}
                                InputProps={passProps}
                            />
                        </Box>
                        <Button
                            type="submit"
                            variant='contained'
                            sx={{ width: '100%' }}
                            {...(isAuthorizing && {
                                startIcon:
                                    <CircularProgress color={"inherit"} size={"24px"} />
                            })}
                        >
                            {"Войти"}
                        </Button>
                        <Typography variant='body1'
                            sx={{ lineHeight: '26px', marginTop: '18px' }}
                        >
                            {"Нет учетной записи?"}
                            <Box sx={{ display: 'inline-block' }}
                                onClick={() => { setPopupStatus(true) }}>
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
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
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