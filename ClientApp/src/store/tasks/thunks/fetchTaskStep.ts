import { actions } from "..";

import { getNewTaskStep } from "../../../api/getNewTaskStep";

import { AppThunk } from "../../../app/store";
import { IErrorCode } from "../../types";


export const fetchTaskStep = (courseId: string): AppThunk => async (dispatch, getState) => {
  dispatch(actions.fetchTaskStepStarted())
  const accessToken = getState().auth.accessToken

  if (!accessToken) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.NO_ACCESS,
      message: 'Ошибка аутентификации', // TODO
    }))
    return
  }

  try {
    const response = await getNewTaskStep({ accessToken, courseId })

    if (!response) {
      dispatch(actions.fetchFailed({
        code: IErrorCode.RESPONSE,
        message: 'Некорректный ответ сервера', // TODO: i18n
      }))
      return
    }

    dispatch(actions.fetchTaskStepSuccess(response.success))
    return

  } catch (error) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.REQUEST,
      message: 'Не удалось выполнить запрос'
    }));
  }
}