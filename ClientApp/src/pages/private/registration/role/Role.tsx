import { FC, useCallback, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button, Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";

import { registretion } from "../../../../store/registretion";
import { IRole } from "../../../../store/types";
import { paths } from "../../../../app/constants/paths";

import { TeacherImg } from "../../../../components/icons/Teacher";
import { StudentImg } from "../../../../components/icons/Student";


export const Role: FC = () => {

    const history = useNavigate()
    const dispatch = useAppDispatch()

    const isRegistratered = useAppSelector(state => state.registration.isRegistered)
    const isRegistering = useAppSelector(state => state.registration.isRegistering)
    const error = useAppSelector(state => state.registration.error)
    const payload = useAppSelector(state => state.registration.payload)
    const accessToken = useAppSelector(state => state.auth.accessToken)
    const userProfile = useAppSelector(state => state.userProfile.payload)

    useEffect(() => {
        if (payload && payload === true && accessToken && userProfile)
            userProfile.role === IRole.teacher ? history(paths.teacher.main) : history(paths.student.main)
    }, [payload, accessToken, userProfile])

    const registrationToken = useAppSelector(state => state.registration.googleToken)

    const handleSelectRole = useCallback((role: IRole) => {
        if (registrationToken) {
            dispatch(registretion({
                googleToken: registrationToken, role: role
            }))
        }
    }, [registrationToken])

    if (!registrationToken) {
        return (
            <Navigate
                to={paths.login}
                replace
            />
        )
    }

    return (
        <Box sx={styles.container}>
            <Box sx={styles.root}>
                <Box sx={styles.cardContainer}>
                    <Box>
                        <Typography variant='h4' >
                            {"Преподаватель"}
                        </Typography>
                        <TeacherImg />
                    </Box>
                    <Box>
                        <Button variant='contained'
                            sx={styles.selectButton}
                            onClick={() => { handleSelectRole(IRole.teacher) }}
                        >
                            {"Я преподаватель"}
                        </Button>
                    </Box>
                </Box>

                <Box sx={styles.cardContainer}>
                    <Box>
                        <Typography variant='h4' >
                            {"Студент"}
                        </Typography>
                        <StudentImg />
                    </Box>
                    <Box>
                        <Button variant='outlined'
                            sx={styles.selectButton}
                            onClick={() => { handleSelectRole(IRole.student) }}
                        >
                            {"Я студент"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const styles = {
    root: {
        maxWidth: '600px',
        width: '100%',
        display: 'block',
        backgroundColor: 'transparent',
        '@media (min-width: 768px)': {
            display: 'flex',
        },
    } as SxProps<Theme>,
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        textAlign: 'center',
    } as SxProps<Theme>,
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme => theme.palette.common.white,
        borderRadius: '4px',
        m: '10px',
        p: '20px',
        transition: 'all 0.3s ease 0s',
        'img': {
            marginTop: '30px'
        },
        ':hover': {
            cursor: 'pointer',
            boxShadow: '0px 0px 12px -3px rgba(34, 60, 80, 0.2)',

        }
    } as SxProps<Theme>,
    selectButton: {
        marginTop: '20px',
        width: '100%',
        whiteSpace: 'nowrap'
    } as SxProps<Theme>,
}