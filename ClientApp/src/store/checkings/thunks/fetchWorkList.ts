import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { getCheckingsWorkList } from "../../../api/getCheckingsWorkList";

import { IErrorCode } from "../../types";


export const fetchCheckingsWorkList = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.fetchStudentListStarted())

    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.fetchListFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Fetch course error: No access or Role")
        return
    }

    try {
        const response = await getCheckingsWorkList({ accessToken, taskId })
        if (!response) {
            dispatch(actions.fetchListFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.fetchListFailed(response.error))
            return
        }
        dispatch(actions.fetchStudentListSuccess(response.payload))
        return

    } catch (error) {
        dispatch(actions.fetchListFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}