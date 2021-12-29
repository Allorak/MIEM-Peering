import { actions } from "..";
import { getOverviewExpert } from "../../../api/getOverviewExpert";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";




export const fetchOverviewExpert = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.reset())
    dispatch(actions.fetchStarted())

    const accessToken = getState().auth.accessToken

    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации',
        }))
        return
    }

    try {
        const response = await getOverviewExpert({ accessToken, taskId })
        if (!response) {
            dispatch(actions.fetchFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера',
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.fetchFailed(response.error))
            return
        }
        dispatch(actions.fetchSuccess(response.payload))

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}