import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { PeerSteps } from '../../store/types'
import { mock } from './mock'


export const postTask = async ({
  accessToken,
  courseId,
  task
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = false

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/tasks/add`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      ...task,
      stepParams: {
        step: task.settings.stepParams.step,
        ...(task.settings.stepParams.step === PeerSteps.FIRST_STEP && {experts: task.settings.stepParams.experts}),
        ...(task.settings.stepParams.step === PeerSteps.SECOND_STEP && {taskId: task.settings.stepParams.taskId})
      },
      courseId
    }
  }

  if (isMock) {
    const response = await mock(requestConfig)
    return response
  }


  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}