import { actions } from "..";
import { deleteStudentCourse as deleteCourseById } from "../../../api/deleteStudentCourse";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IRole } from "../../types";


export const deleteStudentCourse = (courseId: string): AppThunk => async (dispatch, getState) => {
  dispatch(actions.joinCourseStarted())
  try {
    const accessToken = getState().auth.accessToken
    const userProfie = getState().userProfile.payload

    if (!accessToken || !userProfie || (userProfie && userProfie.role !== IRole.student)) {
      dispatch(actions.courseJoinFailed({
        code: IErrorCode.NO_ACCESS,
        message: 'Ошибка аутентификации', // TODO
      }))
      return
    }
   
    const response = await deleteCourseById({ courseId, accessToken })

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

    dispatch(actions.courseDeleteSuccess())

  } catch (error) {
    dispatch(actions.courseJoinFailed({
      code: IErrorCode.REQUEST,
      message: 'Не удалось выполнить запрос'
    }));
  }
}