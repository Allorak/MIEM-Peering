import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";
import { getSubmissionDeadlineStatus } from "../../../api/getSubmissionDeadlineStatus";


export const fetchSubmissionStatus = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.fetchSubmissionStatusStarted())
    const accessToken = getState().auth.accessToken

    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Fetch status error")
        return
    }

    try {
        const response = await getSubmissionDeadlineStatus({ accessToken, taskId })

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

        dispatch(actions.fetchSubmissionStatusSuccess(response.payload))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}