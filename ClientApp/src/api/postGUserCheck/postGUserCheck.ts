import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const postGUserCheck = async (payload: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/posttoken`, //сделать api
    headers: {
      'Authorization': `Bearer ${payload.gAccessToken}`,
      'Accept-Language': 'ru',
    },
    //sdata: payload, // можно не отправлять ????
  }

  // Типизация Response

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  console.log(response.data, "DATA")
  return response.data
}
