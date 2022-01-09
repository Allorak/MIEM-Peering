import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";
import { getReviewDeadlineStatus } from "../../../api/getReviewDeadlineStatus";


export const fetchReviewStatus = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.fetchReviewStatusStarted())
    const accessToken = getState().auth.accessToken

    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Fetch status error: No access token")
        return
    }

    try {
        const response = await getReviewDeadlineStatus({ accessToken, taskId })
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
        dispatch(actions.fetchReviewStatusSuccess(response.payload.state))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}