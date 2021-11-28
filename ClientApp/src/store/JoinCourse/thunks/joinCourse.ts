import { actions } from "..";
import { postAuth } from "../../../api/postAuth";
import { postNewCourse } from "../../../api/postNewCourse";
import { AppThunk } from "../../../app/store";


import { IErrorCode, ICourse } from "../../types";


export const joinCourse = (payload: ICourse): AppThunk => async (dispatch, getState) => {
    dispatch(actions.joinCourseStarted())
    try {
        const accessToken = getState().auth.payload.accessToken
        const role = getState().userProfile.payload.role  
        const couserId = payload.courseId //Полученный id курса
        if (!accessToken || role !== 'student') {
            dispatch(actions.courseJoinFailed({
                code: IErrorCode.NO_ACCESS,
                message: 'Ошибка аутентификации', // TODO
            }))
            console.log("Join course error: No access or Role")
            return
        }
        const response = await postNewCourse({...payload, accessToken}) // ???
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

        dispatch(actions.courseJoinSuccess(response.payload))
        
    } catch (error) {
        dispatch(actions.courseJoinFailed({
            code: IErrorCode.REQUEST,
            message: 'Не удалось выполнить запрос'
        }));
    }
}