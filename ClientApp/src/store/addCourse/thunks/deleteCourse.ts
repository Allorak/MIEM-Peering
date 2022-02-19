import { actions } from "..";
import { deleteCourse as deleteCourseById } from "../../../api/deleteCourse";
import { AppThunk } from "../../../app/store";

import { IErrorCode, IRole } from "../../types";


export const deleteCourse = (courseId: string): AppThunk => async (dispatch, getState) => {
  dispatch(actions.addCourseStarted())
  try {
    const accessToken = getState().auth.accessToken
    const userProfie = getState().userProfile.payload

    if (!accessToken || !userProfie || (userProfie && userProfie.role !== IRole.teacher)) {
      dispatch(actions.courseAddFailed({
        code: IErrorCode.NO_ACCESS,
        message: 'Ошибка аутентификации', // TODO
      }))
      return
    }

    const response = await deleteCourseById({ courseId, accessToken })

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