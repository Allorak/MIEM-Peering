import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { ICourse, ICourses, IErrorCode } from "../../types";
import { getCourses } from "../../../api/getCourses";


export const fetchCourses = (): AppThunk => async (dispatch, getState) => {
    const accessToken = getState().auth.accessToken
    if (!accessToken) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.NO_ACCESS,
            message: 'Ошибка аутентификации', // TODO
        }))
        console.log("Fetch course error: No access or Role")
        return
    }

    dispatch(actions.fetchStarted())
    try {
        const response = await getCourses({ accessToken })
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
        dispatch(actions.fetchSuccess(JSON.parse(JSON.stringify(response.payload.map(course => (
            {
                id: course.id,
                name: course.title,
                subject: course.subject,
                adminImageUrl: course.teacher.imageUrl,
                adminName: course.teacher.fullname,
                description: course.description,
                settings: course.settings
            } as ICourses))))))
        return

    } catch (error) {
        dispatch(actions.fetchFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}