import { actions, fetchExperts } from "..";
import { AppThunk } from "../../../app/store";

import { deleteExpert as apiDeleteExpert } from "../../../api/deleteExpert";

import { IErrorCode } from "../../types";


export const deleteExpert = (taskId: string, email: string): AppThunk => async (dispatch, getState) => {
    const accessToken = getState().auth.accessToken

    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Delete expert error: No access token")
        return
    }

    dispatch(actions.deleteStarted())
    try {
        const response = await apiDeleteExpert({ accessToken, taskId, email })
        if (!response) {
            dispatch(actions.deleteFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.deleteFailed(response.error))
            return
        }
        dispatch(actions.deleteSuccess())
        dispatch(fetchExperts(taskId))
        return

    } catch (error) {
        dispatch(actions.deleteFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}