import { actions, fetchPeerForm, fetchCheckingsWorkList } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IPeerResponses } from "../../types";
import { postReviewByTeacher } from "../../../api/postReviewByTeacher";


export const createReview = (taskId: string, workId: string, responses: IPeerResponses): AppThunk => async (dispatch, getState) => {
    dispatch(actions.createReviewStarted())

    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.createReviewFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        return
    }

    try {
        const response = await postReviewByTeacher({ accessToken, taskId, responses, workId })
        if (!response) {
            dispatch(actions.createReviewFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.createReviewFailed(response.error))
            return
        }
        dispatch(actions.createReviewSuccess())
        dispatch(actions.reset())
        dispatch(fetchCheckingsWorkList(taskId))
        return

    } catch (error) {
        dispatch(actions.createReviewFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}