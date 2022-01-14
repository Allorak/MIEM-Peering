import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const getCheckingsWorkList = async ({
  accessToken,
  taskId
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = false

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/submissions/get-checks-catalog/task=${taskId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    }
  }

  if (isMock) return await mock(requestConfig)

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
