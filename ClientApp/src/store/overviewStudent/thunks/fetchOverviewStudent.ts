import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";

import { getOverviewStudent } from "../../../api/getOverviewStudent";


export const fetchOverviewStudent = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.reset())
    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Fetch course error: No access or Role")
        return
    }

    dispatch(actions.fetchStarted())
    try {
        const response = await getOverviewStudent({ accessToken, taskId })
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
        dispatch(actions.fetchSuccess(response.payload))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}