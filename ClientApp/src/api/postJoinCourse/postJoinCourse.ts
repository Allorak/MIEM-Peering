import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'

export const postJoinCourse = async ({accessToken, courseCode}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/courseusers/join`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      courseCode
    },
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
