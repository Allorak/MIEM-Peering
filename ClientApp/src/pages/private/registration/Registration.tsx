import { FC } from "react";
import { Navigate } from "react-router-dom";

import { paths } from "../../../app/constants/paths";
import { useAppSelector } from "../../../app/hooks";


export const Registration: FC = () => {

    const registrationByGoogleToken = useAppSelector(state => state.registration.googleToken)

    if (registrationByGoogleToken) {
        return (
            <Navigate
                to={paths.registration.selectRole}
                replace
            />
        )
    }

    console.log('registretion return null')
    return null

    //тут форма регистрации в будущем
}