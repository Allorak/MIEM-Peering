import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postAuth = async (payload: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/users`,
    headers: {
      'Authorization': `Bearer 'no access token'`,
      'Accept-Language': 'ru',
    },
    data: payload,
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
