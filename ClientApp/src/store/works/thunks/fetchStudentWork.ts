import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { getStudentWork } from "../../../api/getStudentWork";

import { IErrorCode } from "../../types";


export const fetchStudentWork = (taskId: string, workId: string): AppThunk => async (dispatch, getState) => {

  dispatch(actions.fetchStudentWorkStarted())

  const accessToken = getState().auth.accessToken
  if (!accessToken) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.NO_ACCESS,
      message: 'Ошибка аутентификации', // TODO
    }))
    console.log("Fetch course error: No access or Role")
    return
  }

  try {
    const response = await getStudentWork({ accessToken, taskId, workId })
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
    dispatch(actions.fetchStudentWorkSuccess({responses: response.payload.answers}))
    return

  } catch (error) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.REQUEST,
      message: 'Не удалось выполнить запрос'
    }));
  }
}