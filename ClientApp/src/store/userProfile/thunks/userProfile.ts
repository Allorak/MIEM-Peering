import { actions } from "..";
import { getUserProfile } from "../../../api/getUserProfile";
import { AppThunk } from "../../../app/store";


import { IErrorCode } from "../../types";


export const fetchUserProfile = (): AppThunk => async (dispatch, getState) => {
    dispatch(actions.userProfileStarted())
    const accessToken = getState().auth.accessToken

    try {
        if (!accessToken) {
            dispatch(actions.userProfileFailed({
                code: IErrorCode.NO_ACCESS,
                message: 'Нет досутпа'
            }));
            return
        }

        const response = await getUserProfile({ accessToken })
        if (!response) {
            dispatch(actions.userProfileFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.userProfileFailed(response.error))
            return
        }
        dispatch(actions.userProfileSuccess(response.payload))


    } catch (error) {
        dispatch(actions.userProfileFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}