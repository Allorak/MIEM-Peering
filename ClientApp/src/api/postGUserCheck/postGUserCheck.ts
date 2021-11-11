import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const postGUserCheck = async (payload: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = false

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/googleauth/${payload.gAccessToken}`,
    headers: {
      'Accept-Language': 'ru',
    },
  }

  // Типизация Response

  if (isMock) {
    const response = await mock(requestConfig)
    return response
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  console.log(response.data, "DATA")
  return response.data
}
