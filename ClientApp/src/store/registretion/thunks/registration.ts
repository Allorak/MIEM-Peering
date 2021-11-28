import { actions } from "..";
import { postRegistretion } from "../../../api/postRegistretion";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IRegistretionRequest } from "../../types";
import { fetchGAuth } from "../../googleAuth/thunks/googleAuth";


export const registretion = (payload: IRegistretionRequest): AppThunk => async (dispatch) => {
    dispatch(actions.regStarted())

    try {
        const response = await postRegistretion(payload)
        if (!response) {
            dispatch(actions.regFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.regFailed(response.error))
            return
        }

        dispatch(fetchGAuth(payload.googleToken))
        dispatch(actions.regSuccess(response.success))
        return
    } catch (error) {
        dispatch(actions.regFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}