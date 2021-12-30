import { actions, fetchAuthorformStudent } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IPeerResponses } from "../../types";

import { postAuthorForm } from "../../../api/postAuthorForm";


export const postAuthorformStudent = (taskId: string, responses: IPeerResponses): AppThunk => async (dispatch, getState) => {
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
        console.log('send successfully')
        dispatch(fetchAuthorformStudent(taskId))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}