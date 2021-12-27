import { actions } from "..";
import { putCourse } from "../../../api/putCourse";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IUpdateCourseRequest, IRole } from "../../types";


export const updateCourse = (course: IUpdateCourseRequest): AppThunk => async (dispatch, getState) => {

    dispatch(actions.addCourseStarted())
    try {
        const accessToken = getState().auth.accessToken
        const userProfie = getState().userProfile.payload

        if (!accessToken || !userProfie || (userProfie && userProfie.role !== IRole.teacher)) {
            dispatch(actions.courseAddFailed({
                code: IErrorCode.NO_ACCESS,
                message: 'Ошибка аутентификации', // TODO
            }))
            console.log("Uodate course error: No access or Role")
            return
        }

        const response = await putCourse({ course, accessToken })

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

        dispatch(actions.updateSuccess())

    } catch (error) {
        dispatch(actions.courseAddFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}