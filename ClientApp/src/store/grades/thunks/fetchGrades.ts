import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { getGrades } from "../../../api/getGrades";

import { IErrorCode } from "../../types";


export const fetchGrades = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.fetchStarted())
    const accessToken = getState().auth.accessToken

    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Fetch experts error: No access token")
        return
    }

    try {
        const response = await getGrades({ accessToken, taskId })
        if (!response) {
            dispatch(actions.fetchFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.fetchFailed(response.error))
            return
        }
        dispatch(actions.fetchSuccess(response.payload.students))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}