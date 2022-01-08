import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'

export const postAuthorForm = async ({
  accessToken,
  taskId,
  responses
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = false

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: '/api/v1/submissions/add',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
        ...(JSON.parse(JSON.stringify(responses))),
        taskId
    }
  }

  if (isMock) return await mock(requestConfig)

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}