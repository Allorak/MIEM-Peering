import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";

import { actions as authActions } from "../../auth";

import Cookies from 'universal-cookie';
import { getUserProfile } from "../../../api/getUserProfile";


export const fetchUserProfileCookiesJWT = (): AppThunk => async (dispatch) => {
    dispatch(actions.userProfileStarted())
    const cookies = new Cookies();
    const accessToken = cookies.get('JWT')

    try {
        if (!accessToken) {
            dispatch(actions.userProfileFailed({
                code: IErrorCode.NO_ACCESS,
                message: 'Нет досутпа'
            }));
            return
        }

        const response = await getUserProfile({ accessToken })
        console.log(response)
        if (!response) {
            dispatch(actions.userProfileFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.userProfileFailed(response.error))
            return
        }
        
        dispatch(authActions.authSuccess(accessToken))
        dispatch(actions.userProfileSuccess(response.payload))


    } catch (error) {
        dispatch(actions.userProfileFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}