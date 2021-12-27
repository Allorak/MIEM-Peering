import { actions } from "..";
import { postNewCourse } from "../../../api/postNewCourse";
import { AppThunk } from "../../../app/store";


import { IErrorCode, INewCourseRequest, IRole } from "../../types";


export const addCourse = (payload: INewCourseRequest): AppThunk => async (dispatch, getState) => {

    dispatch(actions.addCourseStarted())
    try {
        const accessToken = getState().auth.accessToken
        const userProfie = getState().userProfile.payload
        if (!accessToken || !userProfie || (userProfie && userProfie.role !== IRole.teacher)) {
            dispatch(actions.courseAddFailed({
                code: IErrorCode.NO_ACCESS,
                message: 'Ошибка аутентификации', // TODO
            }))
            console.log("Add course error: No access or Role")
            return
        }
        const response = await postNewCourse({ ...payload, accessToken })
        if (!response) {
            dispatch(actions.courseAddFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.courseAddFailed(response.error))
            return
        }

        dispatch(actions.courseAddSuccess(response.payload))

    } catch (error) {
        dispatch(actions.courseAddFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}