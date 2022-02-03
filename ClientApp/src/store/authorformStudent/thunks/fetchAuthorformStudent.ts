import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IQuestionTypes } from "../../types";

import { getAuthorform } from "../../../api/getAuthorform";


export const fetchAuthorformStudent = (taskId: string): AppThunk => async (dispatch, getState) => {
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
        const response = await getAuthorform({ accessToken, taskId })
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
        dispatch(actions.fetchAuthorFormSuccess({
            rubrics: response.payload.rubrics.map(rubric => {
                if (rubric.type === IQuestionTypes.MULTIPLE && rubric.required)
                    return { ...rubric, value: rubric.responses[0].id }
                if (rubric.type === IQuestionTypes.SELECT_RATE && rubric.required)
                    return { ...rubric, value: rubric.minValue }
                return rubric
            })
        }))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}