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
  console.log(task)

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/tasks/add`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      ...task,
      // ...(task.settings.experts && task.settings.experts && {  experts: task.settings.experts }),
      stepParams: {
        step: PeerSteps.FIRST_STEP,
        experts: ['name.name.gm98@gmail.com']
      },
      courseId,
    }
  }

  if (isMock) {
    const response = await mock(requestConfig)
    return response
  }


  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}