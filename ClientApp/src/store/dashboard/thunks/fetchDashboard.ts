import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { ICourses, IErrorCode } from "../../types";
import { getTaskProps } from "../../../api/getTaskProps";


export const fetchDashboard = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.fetchStarted())
    const accessToken = getState().auth.accessToken

    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Fetch dashboard: No access or Role")
        return
    }

    try {
        const response = await getTaskProps({ accessToken, taskId })

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