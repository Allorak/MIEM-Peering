import { FC, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "../../../app/constants/paths";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { IUserRegistration, IUserRegistrationRequest } from "../../../store/types";
import { fetchRegistrationUser } from "../../../store/registrationUser";

import { RegistrationForm } from "./RegistrationForm";

export const Registration: FC = () => {
    const dispatch = useAppDispatch()
    const history = useNavigate()

    const registrationByGoogleToken = useAppSelector(state => state.registration.googleToken)
    const error = useAppSelector(state => state.registrationUser.error)

    useEffect(() => {
        if (registrationByGoogleToken) {
            history(paths.registration.selectRole, { replace: true })
        }
    }, [registrationByGoogleToken])


    const handleRequest = useCallback((formResponses: IUserRegistration) => {
        const convertData: IUserRegistrationRequest = {
            fullname: `${formResponses.firstname.trim()} ${formResponses.surname.trim()}`,
            password: formResponses.password,
            email: formResponses.email,
            role: formResponses.role,
            ...(formResponses.img && {
                img: formResponses.img
            })
        }
        dispatch(fetchRegistrationUser(convertData))
    }, [])

    return (
        <RegistrationForm
            onRequest={handleRequest}
            error={error}
        />
    )
}