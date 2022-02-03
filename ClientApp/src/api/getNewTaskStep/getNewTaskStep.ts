import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const getNewTaskStep = async ({
  accessToken,
  courseId
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/courses/second-step-available/course=${courseId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
