import { actions, fetchWorkSubmissionStatus } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IAuthorFormResponses } from "../../types";

import { postAuthorForm } from "../../../api/postAuthorForm";
import { fetchSubmissionStatus } from "../../deadlineStatus";


export const postAuthorformStudent = (taskId: string, responses: IAuthorFormResponses): AppThunk => async (dispatch, getState) => {
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
        const response = await postAuthorForm({ accessToken, taskId, responses })
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
        dispatch(actions.reset())
        dispatch(fetchSubmissionStatus(taskId))
        dispatch(fetchWorkSubmissionStatus(taskId))
        console.log('send successfully')
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}