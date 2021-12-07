import { actions } from "..";
import { actions as registretionActions } from "../../registretion";
import { actions as userProfileActions } from "../../userProfile";
import { actions as authActions } from "../../auth";

import { postGUserCheck } from "../../../api/postGUserCheck";
import { AppThunk } from "../../../app/store";


import { GoogleAuthStatus, IErrorCode } from "../../types";


export const fetchGAuth = (googleToken: string): AppThunk => async (dispatch) => {
    dispatch(actions.authStarted())
    try {
        const response = await postGUserCheck({ googleToken })
        if (!response) {
            dispatch(actions.authFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }

        if (!response.success) {
            dispatch(actions.authFailed(response.error))
            return
        }

        if (response.payload.status === GoogleAuthStatus.newUser)
            dispatch(registretionActions.setGoogleToken(googleToken))

        if (response.payload.status === GoogleAuthStatus.registeredUser) {
            dispatch(userProfileActions.userProfileSuccess(response.payload.user))
            dispatch(authActions.authSuccess(response.payload.accessToken))
        }

        dispatch(actions.authSuccess(response.payload))
        return

    } catch (error) {
        dispatch(actions.authFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}