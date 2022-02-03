import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postTask = async ({
  accessToken,
  courseId,
  task
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/tasks/add`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      ...task,
      courseId,
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}