import { actions } from "..";

import { postRegistrationUser } from "../../../api/postRegistrationUser";

import { AppThunk } from "../../../app/store";
import { fetchAuthorizationUser } from "../../authorizationUser";

import { IErrorCode, IUserRegistrationRequest } from "../../types";


export const fetchRegistrationUser = (payload: IUserRegistrationRequest): AppThunk => async (dispatch) => {
    dispatch(actions.regStarted())

    try {
        const response = await postRegistrationUser(payload)

        if (!response) {
            dispatch(actions.regFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }

        if (!response.success) {
            dispatch(actions.regFailed(response.error))
            console.log(response)
            return
        }

        dispatch(fetchAuthorizationUser({
            pass: payload.password,
            email: payload.email
        }))
        dispatch(actions.regSuccess(response.success))

        return
    } catch (error) {
        dispatch(actions.regFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}