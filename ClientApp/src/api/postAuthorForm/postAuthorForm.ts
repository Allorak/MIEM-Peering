import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'

export const postAuthorForm = async ({
  accessToken,
  taskId,
  responses
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: '/api/v1/submissions/add',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      taskId,
      answers: responses.answers
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}