import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";
import { getStudentWorkStatistics } from "../../../api/getStudentWorkStatistics";


export const fetchStudentWorkStatistics = (taskId: string, workId: string): AppThunk => async (dispatch, getState) => {

  dispatch(actions.fetchWorkStatisticsStarted())

  const accessToken = getState().auth.accessToken
  if (!accessToken) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.NO_ACCESS,
      message: 'Ошибка аутентификации', // TODO
    }))
    return
  }

  try {
    const response = await getStudentWorkStatistics({ accessToken, taskId, workId })
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
    dispatch(actions.fetchWorkStatisticsSuccess(response.payload))
    return

  } catch (error) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.REQUEST,
      message: 'Не удалось выполнить запрос'
    }));
  }
}