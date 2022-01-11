import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";
import { getMyWork } from "../../../api/getMyWork";
import { getSubmissionIdForStrudent } from "../../../api/getSubmissionIdForStrudent";


export const fetchMyWork = (taskId: string): AppThunk => async (dispatch, getState) => {
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
        const submissionId = await getSubmissionIdForStrudent({ accessToken, taskId })

        if (!submissionId) {
            dispatch(actions.fetchFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера',
            }))
            return
        }
        if (!submissionId.success) {
            dispatch(actions.fetchFailed(submissionId.error))
            return
        }

        const response = await getMyWork({ accessToken, submissionId: submissionId.payload.submissionId })
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
        dispatch(actions.fetchSuccess(JSON.parse(JSON.stringify(response.payload))))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}