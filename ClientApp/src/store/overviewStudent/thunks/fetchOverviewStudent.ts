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
            message: 'Ошибка аутентификации',
        }))
        return
    }

    dispatch(actions.fetchStarted())
    try {
        const response = await getOverviewStudent({ accessToken, taskId })
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
        dispatch(actions.fetchSuccess(
            {
                ...response.payload,
                deadlines: {
                    submissionEndDateTime: new Date(response.payload.deadlines.submissionEndDateTime),
                    submissionStartDateTime: new Date(response.payload.deadlines.submissionStartDateTime),
                    reviewEndDateTime: new Date(response.payload.deadlines.reviewEndDateTime),
                    reviewStartDateTime: new Date(response.payload.deadlines.reviewStartDateTime),
                }
            }
        ))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}