import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const deleteExpert = async ({
  accessToken,
  taskId,
  email
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = true

  const requestConfig: AxiosRequestConfig = {
    method: 'DELETE',
    url: `/api/v1/tasks/${taskId}/experts/${email}`,
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
