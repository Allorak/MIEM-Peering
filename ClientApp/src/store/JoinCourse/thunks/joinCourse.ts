import { actions } from "..";
import { postJoinCourse } from "../../../api/postJoinCourse";
import { AppThunk } from "../../../app/store";
import { IErrorCode } from "../../types";

export const joinCourse = (courseCode: string): AppThunk => async (dispatch, getState) => {
    dispatch(actions.joinCourseStarted())
    try {
        const accessToken = getState().auth.accessToken
        if (!accessToken) {
            dispatch(actions.courseJoinFailed({
                code: IErrorCode.NO_ACCESS,
                message: 'Ошибка аутентификации', // TODO
            }))
            console.log("Join course error: No access or Role")
            return
        }
        const response = await postJoinCourse({ accessToken, courseCode })
        if (!response) {
            dispatch(actions.courseJoinFailed({
                code: IErrorCode.RESPONSE,
                message: 'Некорректный ответ сервера', // TODO: i18n
            }))
            return
        }
        if (!response.success) {
            dispatch(actions.courseJoinFailed(response.error))
            return
        }

        dispatch(actions.courseJoinSuccess(response.success))

    } catch (error) {
        dispatch(actions.courseJoinFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}