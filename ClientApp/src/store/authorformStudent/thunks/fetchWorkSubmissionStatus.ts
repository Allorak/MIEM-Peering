import { actions } from "..";
import { AppThunk } from "../../../app/store";

import { IErrorCode } from "../../types";

import { getSubmissionStatus } from "../../../api/getSubmissionStatus";


export const fetchWorkSubmissionStatus = (taskId: string): AppThunk => async (dispatch, getState) => {
  dispatch(actions.fetchSubmissionStatusStarted())
  const accessToken = getState().auth.accessToken

  if (!accessToken) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.NO_ACCESS,
      message: 'Ошибка аутентификации', // TODO
    }))
    console.log("Fetch Submission status error: No access or Role")
    return
  }

  try {
    const response = await getSubmissionStatus({ accessToken, taskId })

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

    dispatch(actions.fetchSubmissionStatusSuccess(response.payload))
    return

  } catch (error) {
    dispatch(actions.fetchFailed({
      code: IErrorCode.REQUEST,
      message: 'Не удалось выполнить запрос'
    }));
  }
}