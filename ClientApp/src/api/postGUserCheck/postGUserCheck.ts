import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const postGUserCheck = async (payload: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/googleauth/${payload.gAccessToken}`,
    headers: {
      'Accept-Language': 'ru',
    },
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  console.log(response.data, "DATA")
  return response.data
}
