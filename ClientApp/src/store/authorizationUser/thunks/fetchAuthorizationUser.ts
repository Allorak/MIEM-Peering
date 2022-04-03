import Cookies from "universal-cookie";

import { actions } from "..";
import { postAuthorizationUser } from "../../../api/postAuthorizationUser";
import { paths } from "../../../app/constants/paths";

import { AppThunk } from "../../../app/store";
import { auth } from "../../auth/thunks/auth";

import { IErrorCode, IUserAuthorizationRequest } from "../../types";

export const fetchAuthorizationUser = (payload: IUserAuthorizationRequest): AppThunk => async (dispatch) => {
    dispatch(actions.authStarted())

    try {
        const response = await postAuthorizationUser(payload)
        if (!response) {
            dispatch(actions.authFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }

        if (!response.success) {
            dispatch(actions.authFailed(response.error))
            console.log(response)
            return
        }

        dispatch(auth(response.payload.accessToken))
        dispatch(actions.authSuccess(response.success))

        return
    } catch (error) {
        dispatch(actions.authFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}