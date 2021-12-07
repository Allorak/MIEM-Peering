import { actions } from "..";
import { AppThunk } from "../../../app/store";


import { IErrorCode, INewTask } from "../../types";
import { postTask } from "../../../api/postTask";


export const createTasks = (task: INewTask, courseId: string): AppThunk => async (dispatch, getState) => {
    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.createError({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        return
    }

    dispatch(actions.createStarted())
    try {
        const response = await postTask({ accessToken, courseId, task })
        if (!response) {
            dispatch(actions.createError({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.createError(response.error))
            return
        }
        dispatch(actions.createSuccess(response.payload))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}