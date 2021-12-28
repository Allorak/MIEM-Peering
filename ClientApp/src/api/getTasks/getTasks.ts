import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const getTasks = async ({
  accessToken,
  courseId
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = false

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/tasks/get/course=${courseId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    }
  }

  if (isMock) {
    const response = await mock(requestConfig)
    return response
  }


  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
