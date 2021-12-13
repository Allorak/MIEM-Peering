import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { getCheckingsPeerForm } from "../../../api/getCheckingsPeerForm";

import { IErrorCode, IQuestionTypes } from "../../types";


export const fetchPeerForm = (taskId: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.fetchPeerFormStarted())

    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.fetchPeerFormFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        return
    }

    try {
        const response = await getCheckingsPeerForm({ accessToken, taskId })
        if (!response) {
            dispatch(actions.fetchPeerFormFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.fetchPeerFormFailed(response.error))
            return
        }
        dispatch(actions.fetchPeerFormSuccess(response.payload.map(rubric => {
            if (rubric.type === IQuestionTypes.MULTIPLE && rubric.required)
                return { ...rubric, response: rubric.responses[0].response }
            if (rubric.type === IQuestionTypes.SELECT_RATE && rubric.required)
                return { ...rubric, response: rubric.minValue }
            return rubric
        })))
        return

    } catch (error) {
        dispatch(actions.fetchPeerFormFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}