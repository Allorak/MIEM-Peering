import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { getCheckingsStudentWork } from "../../../api/getCheckingsStudentWork";

import { IErrorCode } from "../../types";


export const fetchStudentWork = (taskId: string, studentId: string): AppThunk => async (dispatch, getState) => {

  dispatch(actions.fetchStudentWorkStarted())

  const accessToken = getState().auth.accessToken
  if (!accessToken) {
    dispatch(actions.fetchWorkFailed({
      code: IErrorCode.NO_ACCESS,
      message: 'Ошибка аутентификации', // TODO
    }))
    console.log("Fetch course error: No access or Role")
    return
  }

  try {
    const response = await getCheckingsStudentWork({ accessToken, taskId, studentId })
    if (!response) {
      dispatch(actions.fetchWorkFailed({
        code: IErrorCode.RESPONSE,
        message: 'Некорректный ответ сервера', // TODO: i18n
      }))
      return
    }
    if (!response.success) {
      dispatch(actions.fetchWorkFailed(response.error))
      return
    }
    dispatch(actions.fetchStudentWorkSuccess(response.payload))
    return

  } catch (error) {
    dispatch(actions.fetchWorkFailed({
      code: IErrorCode.REQUEST,
      message: 'Не удалось выполнить запрос'
    }));
  }
}