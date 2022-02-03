import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";
import { getWorksList } from "../../../api/getWorksList";


export const fetchWorkList = (taskId: string): AppThunk => async (dispatch, getState) => {
    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации',
        }))
        return
    }

    dispatch(actions.fetchWorkListStarted())
    try {
        const response = await getWorksList({ accessToken, taskId })
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
        dispatch(actions.fetchWorkListSuccess(response.payload))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}