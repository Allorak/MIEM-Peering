import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";
import { getMyReviews } from "../../../api/getMyReviews";


export const fetchReviews = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.fetchMyReviewsStarted())

    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.fetchListFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        return
    }

    try {
        const response = await getMyReviews({ accessToken, taskId })
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
        dispatch(actions.fetchReviewsSuccess(response.payload))
        return

    } catch (error) {
        dispatch(actions.fetchListFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}