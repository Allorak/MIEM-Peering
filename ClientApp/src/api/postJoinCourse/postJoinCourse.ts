import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'

export const postJoinCourse = async ({accessToken, courseCode}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = true

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/course/create`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      courseCode
    },
  }

  if (isMock) {
    const response = await mock(requestConfig)
    return response
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
